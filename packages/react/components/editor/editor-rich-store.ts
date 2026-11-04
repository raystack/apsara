import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { redo, undo } from 'prosemirror-history';
import {
  Fragment,
  type Node as PMNode,
  type Schema,
  Slice
} from 'prosemirror-model';
import {
  type Command,
  EditorState,
  NodeSelection,
  Plugin,
  Selection,
  type Transaction
} from 'prosemirror-state';
import {
  activeLink,
  activeTextStyle,
  editorCommands,
  isBlockActive,
  isMarkActive,
  setLink
} from './core/commands';
import { buildInputRules } from './core/input-rules';
import { docFromJSON, type EditorJSON, emptyDoc } from './core/json';
import { buildEditingKeymap } from './core/keymaps';
import type { EditorFormat } from './core/schema';
import { docToHTML, docToText, isEditorEmpty } from './core/serializers';
import type { EditorAction } from './core/shortcuts';
import { mentionTransaction } from './core/suggestion-plugin';
import { TaskItemView } from './core/task-item-view';
import styles from './editor.module.css';
import {
  type EditorExtension,
  EditorStore,
  type EditorStoreProps
} from './editor-store';
import type {
  EditorApi,
  EditorChangeDetails,
  EditorCommands,
  EditorMarkdownChangeDetails,
  MarkdownAdapter
} from './editor-types';

export interface RichEditorStoreProps extends EditorStoreProps {
  markdown?: MarkdownAdapter;
  onValueChange?: (
    value: EditorJSON,
    details: EditorChangeDetails | EditorMarkdownChangeDetails
  ) => void;
}

export interface RichEditorStoreOptions {
  schema: Schema;
  /** The first doc. A string is Markdown. */
  value: EditorJSON | string | undefined;
  shortcuts: Record<EditorAction, string | false>;
  props: RichEditorStoreProps;
  autoFocus: boolean | 'start' | 'end';
}

interface Target {
  priority: number;
  run: () => boolean;
}

const URL_PATTERN = /^(https?:\/\/|mailto:)\S+$/i;

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

/** Loads a `value` or `defaultValue`. A string is Markdown. */
function parseValue(
  schema: Schema,
  value: EditorJSON | string,
  adapter: MarkdownAdapter | undefined
): PMNode {
  if (typeof value !== 'string') return docFromJSON(schema, value);
  if (adapter) return docFromJSON(schema, adapter.toEditor(value));
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Apsara] Editor received a string value without the `markdown` ' +
        'prop. The string loads as plain text.'
    );
  }
  const paragraphs = value
    .split(/\n{2,}/)
    .map(text =>
      schema.nodes.paragraph.create(null, text ? schema.text(text) : null)
    );
  return schema.topNodeType.create(null, paragraphs);
}

/**
 * Pasted Markdown. A single paragraph pastes as inline content and takes the
 * marks at the caret, as a plain-text paste does.
 */
function pastedSlice(state: EditorState, doc: PMNode): Slice {
  const first = doc.firstChild;
  if (doc.childCount !== 1 || first?.type !== state.schema.nodes.paragraph) {
    return Slice.maxOpen(doc.content);
  }
  const marks = state.storedMarks ?? state.selection.$from.marks();
  const nodes: PMNode[] = [];
  first.forEach(node => {
    let set = node.marks;
    for (const mark of marks) {
      if (!mark.type.isInSet(set)) set = mark.addToSet(set);
    }
    nodes.push(node.mark(set));
  });
  return new Slice(Fragment.from(nodes), 0, 0);
}

/** Links pasted over a selection, and Markdown on paste and copy. */
function clipboardPlugin(store: RichEditorStore): Plugin {
  return new Plugin({
    props: {
      handlePaste: (view, event) => {
        const data = event.clipboardData;
        if (!data) return false;
        const text = data.getData('text/plain');
        const url = text.trim();

        // A URL pasted over a selection links the selection.
        if (
          !view.state.selection.empty &&
          URL_PATTERN.test(url) &&
          setLink(url)(view.state, view.dispatch)
        ) {
          return true;
        }

        const adapter = store.props.markdown;
        const { $from } = view.state.selection;
        const marks = view.state.storedMarks ?? $from.marks();
        if (
          !adapter ||
          adapter.paste === false ||
          !text ||
          data.types.includes('text/html') ||
          $from.parent.type.spec.code ||
          marks.some(mark => mark.type.spec.code)
        ) {
          return false;
        }
        const doc = docFromJSON(store.schema, adapter.toEditor(text));
        view.dispatch(
          view.state.tr
            .replaceSelection(pastedSlice(view.state, doc))
            .scrollIntoView()
        );
        return true;
      },
      clipboardTextSerializer: (slice, view) => {
        const adapter = store.props.markdown;
        // A copied slice includes its parents up to the doc.
        const doc = adapter?.copy
          ? view.state.schema.topNodeType.createAndFill(null, slice.content)
          : null;
        if (adapter && doc) {
          return adapter.fromEditor(doc.toJSON() as EditorJSON);
        }
        return slice.content.textBetween(0, slice.content.size, '\n\n');
      }
    }
  });
}

/** Formats, lists, input rules, cursors, task items and the clipboard. */
function richExtension(store: RichEditorStore): EditorExtension {
  const taskViews = new Set<TaskItemView>();
  const inputRules = buildInputRules(store.schema);
  return {
    commands: {
      bold: editorCommands.toggleMark('bold'),
      italic: editorCommands.toggleMark('italic'),
      underline: editorCommands.toggleMark('underline'),
      strike: editorCommands.toggleMark('strike'),
      code: editorCommands.toggleMark('code'),
      link: () => store.openLink(),
      paragraph: editorCommands.setParagraph(),
      heading1: editorCommands.setHeading(1),
      heading2: editorCommands.setHeading(2),
      heading3: editorCommands.setHeading(3),
      heading4: editorCommands.setHeading(4),
      bulletList: editorCommands.toggleList('bulletList'),
      orderedList: editorCommands.toggleList('orderedList'),
      taskList: editorCommands.toggleList('taskList'),
      blockquote: editorCommands.toggleBlock('blockquote'),
      codeBlock: editorCommands.toggleBlock('codeBlock'),
      focusToolbar: () => store.focusToolbar()
    },
    keys: [
      buildEditingKeymap(store.schema),
      ...(inputRules ? [inputRules] : [])
    ],
    last: [
      dropCursor({ class: styles['drop-cursor'], color: false }),
      gapCursor(),
      clipboardPlugin(store)
    ],
    nodeViews: {
      taskItem: (node, view, getPos) => {
        const task: TaskItemView = new TaskItemView(
          node,
          view,
          getPos,
          {
            item: styles['task-item'],
            checkbox: styles['task-checkbox'],
            content: styles['task-content']
          },
          () => {
            taskViews.delete(task);
          }
        );
        taskViews.add(task);
        return task;
      }
    },
    setEditable: editable => {
      for (const task of taskViews) task.setEditable(editable);
    }
  };
}

/**
 * The store `Editor` creates: the core store plus the rich-text features,
 * the `actionsRef` API, toolbars and links, and JSON and Markdown values.
 */
export class RichEditorStore extends EditorStore {
  declare props: RichEditorStoreProps;
  readonly api: EditorApi;

  /** The last value this store emitted or loaded. */
  private lastValue: EditorJSON | string | undefined;
  /** Markdown for docs the adapter has converted, so a controlled string that matches the doc does not reload it. */
  private readonly markdownCache = new WeakMap<PMNode, string>();
  private readonly toolbars = new Set<Target>();
  private readonly linkOpeners = new Set<Target>();

  constructor(options: RichEditorStoreOptions) {
    const { schema, value, props } = options;
    super({
      schema,
      doc:
        value === undefined
          ? emptyDoc(schema)
          : parseValue(schema, value, props.markdown),
      shortcuts: options.shortcuts,
      props,
      autoFocus: options.autoFocus,
      // Runs during `super`, so it only builds closures over the store.
      extend: store => richExtension(store as RichEditorStore)
    });
    this.lastValue = value;
    this.api = this.createApi();
  }

  protected override report(doc: PMNode): void {
    const onValueChange = this.props.onValueChange;
    if (!onValueChange) {
      this.lastValue = undefined;
      return;
    }
    const value = doc.toJSON() as EditorJSON;
    this.lastValue = value;
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
      getMarkdown: () => this.markdownOf(doc, adapter, value)
    };
  }

  private markdownOf(
    doc: PMNode,
    adapter: MarkdownAdapter,
    value?: EditorJSON
  ): string {
    let markdown = this.markdownCache.get(doc);
    if (markdown === undefined) {
      markdown = adapter.fromEditor(value ?? (doc.toJSON() as EditorJSON));
      this.markdownCache.set(doc, markdown);
    }
    return markdown;
  }

  private parse(value: EditorJSON | string): PMNode {
    return parseValue(this.schema, value, this.props.markdown);
  }

  /**
   * Applies a controlled `value`. Nothing happens when it is the value the
   * store last emitted, when a Markdown string is what the doc converts to, or
   * when it loads to the doc the editor already has.
   */
  reconcile(value: EditorJSON | string): void {
    if (value === this.lastValue) return;
    this.lastValue = value;
    const adapter = this.props.markdown;
    if (
      typeof value === 'string' &&
      adapter &&
      this.markdownOf(this.state.doc, adapter) === value
    ) {
      return;
    }
    const doc = this.parse(value);
    if (doc.eq(this.state.doc)) return;
    this.replaceState(doc);
  }

  /** Loads `doc` with a new history, so Undo cannot step back past it. */
  private replaceState(doc: PMNode): void {
    const pos = Math.min(this.state.selection.from, doc.content.size);
    this.state = EditorState.create({
      doc,
      plugins: this.state.plugins,
      selection: Selection.near(doc.resolve(pos))
    });
    this.view?.updateState(this.state);
    this.emit();
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

  // ---- toolbars and links ----

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
      toggleMark: mark => runCommand(editorCommands.toggleMark(mark)),
      setParagraph: () => runCommand(editorCommands.setParagraph()),
      setHeading: level => runCommand(editorCommands.setHeading(level)),
      toggleBlock: block => runCommand(editorCommands.toggleBlock(block)),
      toggleList: list => runCommand(editorCommands.toggleList(list)),
      setLink: href => runCommand(editorCommands.setLink(href)),
      unsetLink: () => runCommand(editorCommands.unsetLink()),
      insertHorizontalRule: () =>
        runCommand(editorCommands.insertHorizontalRule()),
      insertText: text => runCommand(editorCommands.insertText(text)),
      insertMention: (item, options) =>
        runCommand((state, dispatch) => {
          if (!state.schema.nodes.mention) return false;
          if (!dispatch) return true;
          const trigger =
            options?.trigger ?? this.mentions.triggers()[0] ?? '@';
          const type = item.type ?? 'mention';
          this.mentions.remember(trigger, { ...item, type });
          const tr = mentionTransaction(state, {
            id: item.id,
            label: item.label,
            type,
            trigger
          });
          if (tr) dispatch(tr);
          return true;
        }),
      clearFormatting: () => runCommand(editorCommands.clearFormatting()),
      undo: () => runCommand(undo),
      redo: () => runCommand(redo),
      setContent: value =>
        runCommand((_state, dispatch) => {
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
        return store.markdownOf(store.state.doc, adapter);
      },
      focus: position => store.focus(position)
    };
  }
}

function isFormatActive(
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
