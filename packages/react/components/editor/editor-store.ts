import { baseKeymap, chainCommands, newlineInCode } from 'prosemirror-commands';
import { closeHistory, history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import type { Node as PMNode, Schema } from 'prosemirror-model';
import {
  type Command,
  EditorState,
  Plugin,
  Selection,
  type Transaction
} from 'prosemirror-state';
import type { EditorView, NodeViewConstructor } from 'prosemirror-view';
import { EXTERNAL, insertHardBreak, placeholderPlugin } from './core/base';
import { type MentionAttrs, mentionKey } from './core/mention';
import {
  deleteAdjacentMention,
  moveOverMention
} from './core/mention-commands';
import {
  MentionNodeView,
  type MentionPortal,
  type MentionPortalRegistry
} from './core/mention-node-view';
import { MentionRegistry } from './core/mention-registry';
import { showsPlaceholder } from './core/serializers';
import type { EditorAction } from './core/shortcuts';
import {
  mentionTransaction,
  type SuggestionState,
  type SuggestionTrigger,
  suggestionPlugin,
  suggestionPluginKey
} from './core/suggestion-plugin';

export interface EditorStoreProps {
  placeholder?: string;
  disabled: boolean;
  readOnly: boolean;
  /** Fires for each doc change that did not come from outside the editor. */
  onChange?: (doc: PMNode) => void;
}

/**
 * Behavior added on top of the core store. `Editor` adds the rich-text
 * features through it. `PromptInput.Editor` adds its prompt keys.
 */
export interface EditorExtension {
  /** Runs right after the suggestion plugin, so an open menu still gets its keys first. */
  first?: Plugin[];
  /** Commands for the shortcut actions. The core runs `undo` and `redo` itself. */
  commands?: Partial<Record<EditorAction, Command>>;
  /** Runs after the shortcut keymap and before the core keys. */
  keys?: Plugin[];
  /** Runs after the base keymap. */
  last?: Plugin[];
  nodeViews?: Record<string, NodeViewConstructor>;
  /** Called when the editor turns editable or not. */
  setEditable?: (editable: boolean) => void;
  /**
   * Whether the doc shows the placeholder.
   * @default showsPlaceholder
   */
  showsPlaceholder?: (doc: PMNode) => boolean;
}

export interface EditorStoreOptions {
  schema: Schema;
  doc: PMNode;
  shortcuts: Record<EditorAction, string | false>;
  props: EditorStoreProps;
  /** Read by the view host when it mounts. */
  autoFocus?: boolean | 'start' | 'end';
  /** Puts the first caret at the end of the doc. */
  selectAtEnd?: boolean;
  /** Chip data shared with a component outside the editor. */
  mentions?: MentionRegistry;
  /** Called once, before the plugins are built. */
  extend?: (store: EditorStore) => EditorExtension;
}

export interface EditorTriggerEntry extends SuggestionTrigger {
  onKeyDown: (event: KeyboardEvent, state: SuggestionState) => boolean;
}

/** What `Editor.Content` needs from an open menu for its combobox ARIA. */
export interface EditorMenuAria {
  listboxId: string;
  activeOptionId?: string;
}

// Dragging selected text ends with `dragend`, not `mouseup`.
const POINTER_END_EVENTS = ['mouseup', 'pointerup', 'pointercancel', 'dragend'];

/**
 * The editor's state, view and wiring: dispatch, history, the suggestion
 * menus, mention chips and the placeholder. The parts read it through
 * context. The state lives here and not in the view, so a remounted view
 * keeps the doc and the history. `RichEditorStore` adds what `Editor` needs
 * on top of it.
 */
export class EditorStore {
  readonly schema: Schema;
  readonly shortcuts: Record<EditorAction, string | false>;
  readonly mentions: MentionRegistry;
  readonly autoFocus: boolean | 'start' | 'end';
  readonly nodeViews: Record<string, NodeViewConstructor>;

  state: EditorState;
  view: EditorView | null = null;
  props: EditorStoreProps;

  focused = false;
  pointerSelecting = false;
  suggestion: SuggestionState | null = null;
  mentionPortals: MentionPortal[] = [];
  menus = new Map<string, EditorMenuAria>();
  /** Bumped by every change a part can observe. */
  revision = 0;

  private readonly extension: EditorExtension;
  private triggers = new Map<string, EditorTriggerEntry>();
  private listeners = new Set<() => void>();
  private group: Transaction | null = null;

  readonly portalRegistry: MentionPortalRegistry = {
    add: portal => {
      this.mentionPortals = [...this.mentionPortals, portal];
      this.emit();
    },
    update: (id, attrs) => {
      this.mentionPortals = this.mentionPortals.map(portal =>
        portal.id === id ? { ...portal, attrs } : portal
      );
      this.emit();
    },
    remove: id => {
      this.mentionPortals = this.mentionPortals.filter(
        portal => portal.id !== id
      );
      this.emit();
    }
  };

  constructor(options: EditorStoreOptions) {
    this.schema = options.schema;
    this.shortcuts = options.shortcuts;
    this.props = options.props;
    this.autoFocus = options.autoFocus ?? false;
    this.mentions = options.mentions ?? new MentionRegistry();
    this.extension = options.extend?.(this) ?? {};
    this.nodeViews = {
      mention: node => new MentionNodeView(node, this.portalRegistry),
      ...this.extension.nodeViews
    };
    const { doc } = options;
    this.state = EditorState.create({
      doc,
      selection: options.selectAtEnd ? Selection.atEnd(doc) : undefined,
      plugins: this.plugins()
    });
  }

  // ---- subscription ----

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  emit(): void {
    this.revision += 1;
    for (const listener of this.listeners) listener();
  }

  // ---- state ----

  isEditable(): boolean {
    return !this.props.disabled && !this.props.readOnly;
  }

  dispatch = (tr: Transaction): void => {
    if (this.group && tr.docChanged && !tr.getMeta('appendedTransaction')) {
      // Joins the history event of the transaction that started the group.
      tr.setMeta('appendedTransaction', this.group);
    }
    const next = this.state.apply(tr);
    this.state = next;
    this.view?.updateState(next);
    if (tr.docChanged && !tr.getMeta(EXTERNAL)) this.report(next.doc);
    this.emit();
  };

  run = (command: Command): boolean =>
    command(this.state, this.dispatch, this.view ?? undefined);

  /** Reports a change made in the editor. */
  protected report(doc: PMNode): void {
    this.props.onChange?.(doc);
  }

  updateProps(next: EditorStoreProps): void {
    const previous = this.props;
    this.props = next;
    if (
      previous.disabled !== next.disabled ||
      previous.readOnly !== next.readOnly
    ) {
      this.view?.setProps({ editable: () => this.isEditable() });
      this.extension.setEditable?.(this.isEditable());
      this.emit();
    }
    if (previous.placeholder !== next.placeholder) {
      // Redraws the placeholder decoration. The doc does not change.
      this.dispatch(this.state.tr.setMeta(EXTERNAL, true));
    }
  }

  // ---- view ----

  private endPointerSelection = () => {
    if (!this.pointerSelecting) return;
    this.pointerSelecting = false;
    this.emit();
  };

  attachView(view: EditorView): void {
    if (
      process.env.NODE_ENV !== 'production' &&
      this.view &&
      this.view !== view
    ) {
      console.warn(
        '[Apsara] Editor has more than one Editor.Content. Render one per Editor.'
      );
    }
    this.view = view;
    const ownerDocument = view.dom.ownerDocument;
    for (const type of POINTER_END_EVENTS) {
      ownerDocument.addEventListener(type, this.endPointerSelection);
    }
    ownerDocument.defaultView?.addEventListener(
      'blur',
      this.endPointerSelection
    );
    this.emit();
  }

  detachView(view: EditorView): void {
    if (this.view !== view) return;
    const ownerDocument = view.dom.ownerDocument;
    for (const type of POINTER_END_EVENTS) {
      ownerDocument.removeEventListener(type, this.endPointerSelection);
    }
    ownerDocument.defaultView?.removeEventListener(
      'blur',
      this.endPointerSelection
    );
    this.view = null;
    this.focused = false;
    this.pointerSelecting = false;
    this.emit();
  }

  focus(position?: 'start' | 'end'): void {
    const view = this.view;
    if (!view) return;
    view.focus();
    if (!position) return;
    const selection =
      position === 'start'
        ? Selection.atStart(this.state.doc)
        : Selection.atEnd(this.state.doc);
    this.dispatch(this.state.tr.setSelection(selection).scrollIntoView());
  }

  // ---- plugins ----

  private plugins(): Plugin[] {
    const { extension } = this;
    return [
      // First, so an open menu wins arrows, Enter, Tab and Escape.
      suggestionPlugin({
        getTriggers: () => [...this.triggers.values()],
        onStateChange: next => {
          this.suggestion = next;
          this.emit();
        },
        onKeyDown: (event, state) =>
          this.triggers.get(state.trigger)?.onKeyDown(event, state) ?? false
      }),
      ...(extension.first ?? []),
      keymap(this.shortcutBindings()),
      ...(extension.keys ?? []),
      keymap(this.coreBindings()),
      history(),
      keymap(baseKeymap),
      ...(extension.last ?? []),
      placeholderPlugin(
        () => this.props.placeholder,
        extension.showsPlaceholder ?? showsPlaceholder
      ),
      this.eventsPlugin()
    ];
  }

  private shortcutBindings(): Record<string, Command> {
    const commands: Partial<Record<EditorAction, Command>> = {
      ...this.extension.commands,
      undo,
      redo
    };
    const bindings: Record<string, Command> = {};
    for (const [action, key] of Object.entries(this.shortcuts)) {
      const command = commands[action as EditorAction];
      if (key && command) bindings[key] = command;
    }
    return bindings;
  }

  /** Line breaks, chip keys and `Mod-y`, which redoes unless `redo` is off. */
  private coreBindings(): Record<string, Command> {
    const bindings: Record<string, Command> = {
      'Shift-Enter': chainCommands(newlineInCode, insertHardBreak),
      Backspace: deleteAdjacentMention(-1),
      Delete: deleteAdjacentMention(1),
      ArrowLeft: moveOverMention(-1),
      ArrowRight: moveOverMention(1)
    };
    if (this.shortcuts.redo !== false) bindings['Mod-y'] = redo;
    return bindings;
  }

  private eventsPlugin(): Plugin {
    return new Plugin({
      props: {
        handleDOMEvents: {
          focus: () => {
            this.focused = true;
            this.emit();
            return false;
          },
          blur: () => {
            this.focused = false;
            this.emit();
            return false;
          },
          mousedown: (_view, event) => {
            if (event.button !== 0) return false;
            this.pointerSelecting = true;
            this.emit();
            return false;
          }
        }
      }
    });
  }

  // ---- menus and mentions ----

  registerTrigger(entry: EditorTriggerEntry): () => void {
    if (
      process.env.NODE_ENV !== 'production' &&
      this.triggers.has(entry.char)
    ) {
      console.warn(
        `[Apsara] Editor has two menus for the trigger ${JSON.stringify(
          entry.char
        )}. Only the last one opens.`
      );
    }
    this.triggers.set(entry.char, entry);
    this.emit();
    return () => {
      if (this.triggers.get(entry.char) !== entry) return;
      this.triggers.delete(entry.char);
      this.menus.delete(entry.char);
      this.emit();
    };
  }

  hasTriggers(): boolean {
    return this.triggers.size > 0;
  }

  setMenu(trigger: string, aria: EditorMenuAria | null): void {
    const current = this.menus.get(trigger);
    if (!aria) {
      if (!current) return;
      this.menus.delete(trigger);
      this.emit();
      return;
    }
    if (
      current?.listboxId === aria.listboxId &&
      current.activeOptionId === aria.activeOptionId
    ) {
      return;
    }
    this.menus.set(trigger, aria);
    this.emit();
  }

  dismissSuggestion = (): void => {
    if (!this.suggestion) return;
    this.dispatch(
      this.state.tr.setMeta(suggestionPluginKey, { type: 'dismiss' })
    );
  };

  /**
   * Deletes the typed `/query`, then runs `action`. One undo restores the
   * query: the delete starts a history event and the action's transactions
   * join it.
   */
  runAfterDelete(
    range: { from: number; to: number },
    action: () => void
  ): void {
    const tr = closeHistory(this.state.tr.delete(range.from, range.to));
    this.dispatch(tr);
    this.group = tr;
    try {
      action();
    } finally {
      this.group = null;
    }
    this.view?.focus();
  }

  insertMentionAt(
    attrs: MentionAttrs,
    range?: { from: number; to: number }
  ): void {
    const tr = mentionTransaction(this.state, attrs, range);
    if (!tr) return;
    this.dispatch(tr);
    this.view?.focus();
  }

  /**
   * Applies fresh labels from `resolveMentions`. A label update is not an
   * edit, so it skips history and `onValueChange`.
   */
  refreshMentionLabels = (labels: Map<string, string>): void => {
    if (labels.size === 0) return;
    const tr = this.state.tr;
    let changed = false;
    this.state.doc.descendants((node, pos) => {
      if (node.type.name !== 'mention') return;
      const attrs = node.attrs as MentionAttrs;
      const fresh = labels.get(mentionKey(attrs.trigger, attrs.type, attrs.id));
      if (fresh && fresh !== attrs.label) {
        tr.setNodeMarkup(pos, undefined, { ...attrs, label: fresh });
        changed = true;
      }
    });
    if (!changed) return;
    tr.setMeta(EXTERNAL, true);
    tr.setMeta('addToHistory', false);
    this.dispatch(tr);
  };
}
