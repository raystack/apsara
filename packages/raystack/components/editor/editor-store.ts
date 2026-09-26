import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { closeHistory, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { type Node as PMNode, type Schema, Slice } from 'prosemirror-model';
import {
  type Command,
  EditorState,
  NodeSelection,
  Plugin,
  Selection,
  type Transaction
} from 'prosemirror-state';
import { Decoration, DecorationSet, type EditorView } from 'prosemirror-view';
import {
  activeLink,
  activeTextStyle,
  clearFormatting,
  insertHorizontalRule,
  insertText,
  isBlockActive,
  isMarkActive,
  redoCommand,
  setHeading,
  setLink,
  setParagraph,
  toggleBlock,
  toggleList,
  toggleMarkCommand,
  undoCommand,
  unsetLink
} from './core/commands';
import coreStyles from './core/editor-core.module.css';
import { buildInputRules } from './core/input-rules';
import { docFromJSON, type EditorJSON, emptyDoc } from './core/json';
import { buildEditingKeymap } from './core/keymaps';
import { isSafeHref } from './core/link';
import type { MentionAttrs } from './core/mention';
import {
  MentionNodeView,
  type MentionPortal,
  type MentionPortalRegistry
} from './core/mention-node-view';
import { MentionRegistry } from './core/mention-registry';
import type { EditorFormat } from './core/schema';
import {
  docToHTML,
  docToText,
  isEditorEmpty,
  showsPlaceholder
} from './core/serializers';
import type { EditorAction } from './core/shortcuts';
import {
  mentionTransaction,
  type SuggestionState,
  type SuggestionTrigger,
  suggestionPlugin,
  suggestionPluginKey
} from './core/suggestion-plugin';
import { TaskItemView } from './core/task-item-view';
import styles from './editor.module.css';
import type {
  EditorApi,
  EditorChangeDetails,
  EditorCommands,
  EditorMarkdownChangeDetails,
  MarkdownAdapter
} from './editor-types';

/** Marks transactions that came from `value`, so they are not reported back. */
export const EXTERNAL = 'apsara-editor-external';

export interface EditorStoreProps {
  placeholder?: string;
  disabled: boolean;
  readOnly: boolean;
  markdown?: MarkdownAdapter;
  onValueChange?: (
    value: EditorJSON,
    details: EditorChangeDetails | EditorMarkdownChangeDetails
  ) => void;
}

export interface EditorTriggerEntry extends SuggestionTrigger {
  onKeyDown: (event: KeyboardEvent, state: SuggestionState) => boolean;
}

/** What `Editor.Content` needs from an open menu for its combobox ARIA. */
export interface EditorMenuAria {
  listboxId: string;
  activeOptionId?: string;
}

interface Target {
  priority: number;
  run: () => boolean;
}

const URL_PATTERN = /^(https?:\/\/|mailto:)\S+$/i;

function leafText(node: PMNode): string {
  if (node.type.name === 'hardBreak') return '\n';
  if (node.type.name !== 'mention') return '';
  const attrs = node.attrs as MentionAttrs;
  return `${attrs.trigger}${attrs.label}`;
}

function run(targets: Set<Target>): boolean {
  const sorted = [...targets].sort((a, b) => b.priority - a.priority);
  return sorted.some(target => target.run());
}

function register(targets: Set<Target>, target: Target): () => void {
  targets.add(target);
  return () => {
    targets.delete(target);
  };
}

/**
 * The editor's state, view and wiring. `Editor` creates one, and every part
 * reads it through context. The state lives here and not in the view, so a
 * remounted `Editor.Content` keeps the doc and the history.
 */
export class EditorStore {
  readonly schema: Schema;
  readonly shortcuts: Record<EditorAction, string | false>;
  readonly mentions = new MentionRegistry();
  readonly api: EditorApi;
  /** Read by `Editor.Content` when it mounts. */
  readonly autoFocus: boolean | 'start' | 'end';

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

  /** The last value this store emitted or loaded. */
  private lastValue: EditorJSON | string | undefined;
  private markdownOut: { doc: PMNode; markdown: string } | null = null;
  private triggers = new Map<string, EditorTriggerEntry>();
  private toolbars = new Set<Target>();
  private linkOpeners = new Set<Target>();
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

  readonly nodeViews = {
    mention: (node: PMNode) => new MentionNodeView(node, this.portalRegistry),
    taskItem: (
      node: PMNode,
      view: EditorView,
      getPos: () => number | undefined
    ) =>
      new TaskItemView(node, view, getPos, {
        item: styles['task-item'],
        checkbox: styles['task-checkbox'],
        content: styles['task-content']
      })
  };

  constructor(options: {
    schema: Schema;
    value: EditorJSON | string | undefined;
    shortcuts: Record<EditorAction, string | false>;
    props: EditorStoreProps;
    autoFocus: boolean | 'start' | 'end';
  }) {
    this.schema = options.schema;
    this.shortcuts = options.shortcuts;
    this.props = options.props;
    this.autoFocus = options.autoFocus;
    this.lastValue = options.value;
    const doc =
      options.value === undefined
        ? emptyDoc(this.schema)
        : this.parse(options.value);
    this.state = EditorState.create({
      doc,
      plugins: this.plugins()
    });
    this.api = this.createApi();
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

  private report(doc: PMNode): void {
    const onValueChange = this.props.onValueChange;
    const value = doc.toJSON() as EditorJSON;
    this.lastValue = value;
    this.markdownOut = null;
    if (!onValueChange) return;
    onValueChange(value, this.details(doc, value));
  }

  private details(
    doc: PMNode,
    value: EditorJSON
  ): EditorChangeDetails | EditorMarkdownChangeDetails {
    const details: EditorChangeDetails = {
      empty: isEditorEmpty(doc),
      getMentions: () => docToText(doc).mentions,
      getText: () => docToText(doc).text,
      getHTML: () => docToHTML(doc)
    };
    const adapter = this.props.markdown;
    if (!adapter) return details;
    return {
      ...details,
      getMarkdown: () => {
        const markdown = adapter.fromEditor(value);
        this.markdownOut = { doc, markdown };
        return markdown;
      }
    };
  }

  /** Loads a `value` or `defaultValue`. A string is Markdown. */
  parse(value: EditorJSON | string): PMNode {
    if (typeof value !== 'string') return docFromJSON(this.schema, value);
    const adapter = this.props.markdown;
    if (adapter) return docFromJSON(this.schema, adapter.toEditor(value));
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Apsara] Editor received a string value without the `markdown` ' +
          'prop. The string loads as plain text.'
      );
    }
    const paragraphs = value
      .split(/\n{2,}/)
      .map(text =>
        this.schema.nodes.paragraph.create(
          null,
          text ? this.schema.text(text) : null
        )
      );
    return this.schema.topNodeType.create(null, paragraphs);
  }

  /**
   * Applies a controlled `value`. Nothing happens when it is the value the
   * store last emitted, or when it loads to the doc the editor already has.
   */
  reconcile(value: EditorJSON | string): void {
    if (value === this.lastValue) return;
    if (
      typeof value === 'string' &&
      this.markdownOut?.markdown === value &&
      this.markdownOut.doc === this.state.doc
    ) {
      this.lastValue = value;
      return;
    }
    this.lastValue = value;
    const doc = this.parse(value);
    if (doc.eq(this.state.doc)) return;
    const tr = this.replaceDocTransaction(doc);
    tr.setMeta(EXTERNAL, true);
    tr.setMeta('addToHistory', false);
    this.dispatch(tr);
  }

  private replaceDocTransaction(doc: PMNode): Transaction {
    const tr = this.state.tr.replaceWith(
      0,
      this.state.doc.content.size,
      doc.content
    );
    const pos = Math.min(this.state.selection.from, tr.doc.content.size);
    tr.setSelection(Selection.near(tr.doc.resolve(pos)));
    return tr;
  }

  updateProps(next: EditorStoreProps): void {
    const previous = this.props;
    this.props = next;
    if (
      previous.disabled !== next.disabled ||
      previous.readOnly !== next.readOnly
    ) {
      this.view?.setProps({ editable: () => this.isEditable() });
      this.emit();
    }
    if (previous.placeholder !== next.placeholder) {
      // Redraws the placeholder decoration. The doc does not change.
      this.dispatch(this.state.tr.setMeta(EXTERNAL, true));
    }
  }

  // ---- view ----

  private handleMouseUp = () => {
    if (!this.pointerSelecting) return;
    this.pointerSelecting = false;
    this.emit();
  };

  attachView(view: EditorView): void {
    this.view = view;
    view.dom.ownerDocument.addEventListener('mouseup', this.handleMouseUp);
    this.emit();
  }

  detachView(view: EditorView): void {
    if (this.view !== view) return;
    view.dom.ownerDocument.removeEventListener('mouseup', this.handleMouseUp);
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
    const inputRules = buildInputRules(this.schema);
    const plugins = [
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
      keymap(this.shortcutBindings()),
      buildEditingKeymap(this.schema),
      history(),
      keymap(baseKeymap),
      dropCursor({ class: styles['drop-cursor'], color: false }),
      gapCursor(),
      this.placeholderPlugin(),
      this.eventsPlugin()
    ];
    if (inputRules) plugins.splice(3, 0, inputRules);
    return plugins;
  }

  private shortcutBindings(): Record<string, Command> {
    const commands: Record<EditorAction, Command> = {
      bold: toggleMarkCommand('bold'),
      italic: toggleMarkCommand('italic'),
      underline: toggleMarkCommand('underline'),
      strike: toggleMarkCommand('strike'),
      code: toggleMarkCommand('code'),
      link: () => this.openLink(),
      paragraph: setParagraph,
      heading1: setHeading(1),
      heading2: setHeading(2),
      heading3: setHeading(3),
      heading4: setHeading(4),
      bulletList: toggleList('bulletList'),
      orderedList: toggleList('orderedList'),
      taskList: toggleList('taskList'),
      blockquote: toggleBlock('blockquote'),
      codeBlock: toggleBlock('codeBlock'),
      undo: undoCommand,
      redo: redoCommand,
      focusToolbar: () => this.focusToolbar()
    };
    const bindings: Record<string, Command> = {};
    for (const [action, key] of Object.entries(this.shortcuts)) {
      if (key) bindings[key] = commands[action as EditorAction];
    }
    return bindings;
  }

  private placeholderPlugin(): Plugin {
    return new Plugin({
      props: {
        decorations: state => {
          const text = this.props.placeholder;
          const first = state.doc.firstChild;
          if (!text || !first || !showsPlaceholder(state.doc)) return null;
          return DecorationSet.create(state.doc, [
            Decoration.node(0, first.nodeSize, {
              class: coreStyles.placeholder,
              'data-placeholder': text
            })
          ]);
        }
      }
    });
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
        },
        handlePaste: (view, event) => {
          const data = event.clipboardData;
          if (!data) return false;
          const text = data.getData('text/plain');
          const hasHtml = data.types.includes('text/html');

          // A URL pasted over a selection links the selection.
          if (
            text &&
            !view.state.selection.empty &&
            URL_PATTERN.test(text.trim()) &&
            isSafeHref(text.trim()) &&
            setLink(text.trim())(view.state, view.dispatch)
          ) {
            return true;
          }

          const adapter = this.props.markdown;
          if (
            !adapter ||
            adapter.paste === false ||
            hasHtml ||
            !text ||
            view.state.selection.$from.parent.type.spec.code
          ) {
            return false;
          }
          const doc = docFromJSON(this.schema, adapter.toEditor(text));
          view.dispatch(
            view.state.tr
              .replaceSelection(Slice.maxOpen(doc.content))
              .scrollIntoView()
          );
          return true;
        },
        clipboardTextSerializer: (slice, view) => {
          const adapter = this.props.markdown;
          const doc = adapter?.copy
            ? view.state.schema.topNodeType.createAndFill(null, slice.content)
            : null;
          if (adapter && doc) {
            return adapter.fromEditor(doc.toJSON() as EditorJSON);
          }
          return slice.content.textBetween(
            0,
            slice.content.size,
            '\n\n',
            leafText
          );
        }
      }
    });
  }

  // ---- menus, toolbars and links ----

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

  /** Applies fresh labels from `resolveMentions` without touching history. */
  refreshMentionLabels = (labels: Map<string, string>): void => {
    if (labels.size === 0) return;
    const tr = this.state.tr;
    let changed = false;
    this.state.doc.descendants((node, pos) => {
      if (node.type.name !== 'mention') return;
      const attrs = node.attrs as MentionAttrs;
      const fresh = labels.get(`${attrs.trigger}|${attrs.type}|${attrs.id}`);
      if (fresh && fresh !== attrs.label) {
        tr.setNodeMarkup(pos, undefined, { ...attrs, label: fresh });
        changed = true;
      }
    });
    if (!changed) return;
    tr.setMeta('addToHistory', false);
    this.dispatch(tr);
  };

  registerToolbar(priority: number, focus: () => boolean): () => void {
    return register(this.toolbars, { priority, run: focus });
  }

  focusToolbar(): boolean {
    return run(this.toolbars);
  }

  registerLinkOpener(priority: number, open: () => boolean): () => void {
    return register(this.linkOpeners, { priority, run: open });
  }

  openLink(): boolean {
    if (!this.isEditable() || !this.schema.marks.link) return false;
    return run(this.linkOpeners);
  }

  // ---- api ----

  private commandSet(
    runCommand: (command: Command) => boolean
  ): EditorCommands {
    return {
      toggleMark: mark => runCommand(toggleMarkCommand(mark)),
      setParagraph: () => runCommand(setParagraph),
      setHeading: level => runCommand(setHeading(level)),
      toggleBlock: block => runCommand(toggleBlock(block)),
      toggleList: list => runCommand(toggleList(list)),
      setLink: href => runCommand(setLink(href)),
      unsetLink: () => runCommand(unsetLink),
      insertHorizontalRule: () => runCommand(insertHorizontalRule),
      insertText: text => runCommand(insertText(text)),
      insertMention: (item, options) =>
        runCommand((state, dispatch) => {
          if (!state.schema.nodes.mention) return false;
          if (!dispatch) return true;
          const trigger =
            options?.trigger ?? this.mentions.triggers()[0] ?? '@';
          const type = item.type ?? 'mention';
          this.mentions.remember(trigger, { ...item, type });
          // Not focused: the chip belongs at the end of the doc.
          const end = Selection.atEnd(state.doc).from;
          const range = this.view?.hasFocus()
            ? undefined
            : { from: end, to: end };
          const tr = mentionTransaction(
            state,
            { id: item.id, label: item.label, type, trigger },
            range
          );
          if (tr) dispatch(tr);
          return true;
        }),
      clearFormatting: () => runCommand(clearFormatting),
      undo: () => runCommand(undoCommand),
      redo: () => runCommand(redoCommand),
      setContent: value =>
        runCommand((state, dispatch) => {
          if (dispatch) dispatch(this.replaceDocTransaction(this.parse(value)));
          return true;
        }),
      clear: () =>
        runCommand((state, dispatch) => {
          if (dispatch) {
            dispatch(this.replaceDocTransaction(emptyDoc(state.schema)));
          }
          return true;
        })
    };
  }

  private createApi(): EditorApi {
    const store = this;
    return {
      get view() {
        return store.view;
      },
      getState: () => store.state,
      commands: this.commandSet(store.run),
      can: this.commandSet(command => command(store.state)),
      isActive: (format: EditorFormat, attrs?: Record<string, unknown>) =>
        isFormatActive(store.state, format, attrs),
      getJSON: () => store.state.doc.toJSON() as EditorJSON,
      getText: () => docToText(store.state.doc).text,
      getHTML: () => docToHTML(store.state.doc),
      getMarkdown: () => {
        const adapter = store.props.markdown;
        if (!adapter) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              '[Apsara] Editor getMarkdown() needs the `markdown` prop. ' +
                'Pass MarkdownAdapter.create().'
            );
          }
          return null;
        }
        return adapter.fromEditor(store.state.doc.toJSON() as EditorJSON);
      },
      focus: position => store.focus(position)
    };
  }
}

export function isFormatActive(
  state: EditorState,
  format: EditorFormat,
  attrs?: Record<string, unknown>
): boolean {
  switch (format) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
      return isMarkActive(state, format);
    case 'link':
      return activeLink(state) !== null;
    case 'heading': {
      const style = activeTextStyle(state);
      if (typeof style !== 'number') return false;
      return attrs?.level === undefined || attrs.level === style;
    }
    case 'mention':
    case 'horizontalRule':
      return (
        state.selection instanceof NodeSelection &&
        state.selection.node.type.name === format
      );
    default:
      return isBlockActive(state, format);
  }
}
