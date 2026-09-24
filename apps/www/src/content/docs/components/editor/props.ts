export interface EditorProps {
  /**
   * Controlled document as editor JSON. With the `markdown` prop, a string is
   * parsed as Markdown.
   */
  value?: EditorJSON | string;

  /**
   * The first document when uncontrolled. Read once. With the `markdown` prop,
   * a string is parsed as Markdown.
   */
  defaultValue?: EditorJSON | string;

  /**
   * Fires once per doc change. It does not fire for changes made through
   * `value`. The value is always editor JSON.
   */
  onValueChange?: (value: EditorJSON, details: EditorChangeDetails) => void;

  /**
   * A Markdown adapter from `MarkdownAdapter.create()`. Allows Markdown strings
   * in `value` and `defaultValue`, parses Markdown on paste, and adds
   * `details.getMarkdown()`.
   */
  markdown?: MarkdownAdapter;

  /** Shows while the doc is empty. */
  placeholder?: string;

  /**
   * Allowlist of nodes and marks. Read once, when the editor is created.
   * @defaultValue all formats
   */
  formats?: Array<
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'link'
    | 'heading'
    | 'blockquote'
    | 'codeBlock'
    | 'bulletList'
    | 'orderedList'
    | 'taskList'
    | 'horizontalRule'
    | 'mention'
  >;

  /** Overrides a default key in ProseMirror keymap syntax, or turns it off with `false`. Read once. */
  shortcuts?: Partial<Record<EditorAction, string | false>>;

  /**
   * Makes the editor not editable and disables the toolbars.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Makes the editor not editable and hides the toolbars and menus.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Focuses the editor on mount, with the caret at the start or the end.
   * @defaultValue false
   */
  autoFocus?: boolean | 'start' | 'end';

  /** Imperative handle with commands and serializers. */
  actionsRef?: React.RefObject<EditorApi | null>;

  /** Replaces the root element or composes it with another component. */
  render?: React.ReactElement | ((props: object) => React.ReactElement);

  /** Additional CSS class names. */
  className?: string;
}

export interface EditorContentProps {
  /** Accessible name for the textbox. */
  'aria-label'?: string;

  /**
   * Turns the browser's spell check on or off.
   * @defaultValue true
   */
  spellCheck?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface EditorToolbarProps {
  /**
   * Accessible name for the toolbar.
   * @defaultValue "Formatting"
   */
  'aria-label'?: string;

  /**
   * The orientation of the toolbar layout.
   * @defaultValue "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /** Additional CSS class names. */
  className?: string;
}

export interface EditorFloatingToolbarProps {
  /**
   * The side of the selection the toolbar shows on.
   * @defaultValue "top"
   */
  side?: 'top' | 'bottom';

  /**
   * How the toolbar aligns to the selection.
   * @defaultValue "start"
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Distance from the selection in pixels.
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Decides whether the toolbar shows for a state. Replaces the default rule:
   * a non-empty text selection outside a code block.
   */
  shouldShow?: (state: EditorState) => boolean;

  /**
   * Accessible name for the toolbar.
   * @defaultValue "Formatting"
   */
  'aria-label'?: string;

  /** Additional CSS class names. */
  className?: string;
}

interface EditorControlProps {
  /** Accessible name and tooltip text. Each control has a default. */
  label?: string;

  /**
   * Shows the label and shortcut in a tooltip.
   * @defaultValue true
   */
  tooltip?: boolean;

  /** Replaces the default icon. */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface EditorMarkButtonProps extends EditorControlProps {
  /** The mark the button toggles. */
  mark: 'bold' | 'italic' | 'underline' | 'strike' | 'code';
}

export interface EditorBlockButtonProps extends EditorControlProps {
  /** The block the button toggles. `horizontalRule` inserts a divider. */
  block:
    | 'blockquote'
    | 'codeBlock'
    | 'bulletList'
    | 'orderedList'
    | 'taskList'
    | 'horizontalRule';
}

export interface EditorHeadingMenuProps extends EditorControlProps {
  /**
   * The heading levels in the menu.
   * @defaultValue [1, 2, 3, 4]
   */
  levels?: Array<1 | 2 | 3 | 4>;
}

export interface EditorListMenuProps extends EditorControlProps {
  /**
   * The list types in the menu.
   * @defaultValue ["bulletList", "orderedList", "taskList"]
   */
  types?: Array<'bulletList' | 'orderedList' | 'taskList'>;
}

export interface EditorLinkButtonProps extends EditorControlProps {}

export interface EditorHistoryButtonProps extends EditorControlProps {
  /** Which way the button steps through history. */
  action: 'undo' | 'redo';
}

export interface EditorSlashMenuProps {
  /**
   * The commands in the menu.
   * @defaultValue defaultSlashItems
   */
  items?: EditorSlashItem[];

  /**
   * The character that opens the menu.
   * @defaultValue "/"
   */
  trigger?: string;

  /**
   * Shown when no command matches the query.
   * @defaultValue "No results"
   */
  emptyMessage?: React.ReactNode;

  /** Observes the menu's open state. */
  onOpenChange?: (open: boolean) => void;
}

export interface EditorMentionsProps {
  /**
   * The character that opens the menu.
   * @defaultValue "@"
   */
  trigger?: string;

  /** Sync data, filtered on the label. */
  items?: EditorMentionItem[];

  /**
   * Async data. Debounced about 150 ms, with superseded requests aborted
   * through `signal`. Wins over `items`.
   */
  onSearch?: (
    query: string,
    context: { trigger: string; signal: AbortSignal }
  ) => Promise<EditorMentionItem[]>;

  /**
   * Fills in the icon, trailing content and label of chips loaded from
   * `value` or `defaultValue`.
   */
  resolveMentions?: (
    refs: Array<{ type: string; id: string; label: string }>
  ) => Promise<EditorMentionItem[]>;

  /**
   * Shown when nothing matches the query.
   * @defaultValue "No results"
   */
  emptyMessage?: React.ReactNode;

  /**
   * Skeleton rows shown while `onSearch` is in flight.
   * @defaultValue 3
   */
  loadingRowCount?: number;

  /** Observes the menu's open state. */
  onOpenChange?: (open: boolean) => void;
}

export interface EditorMentionItem {
  id: string;
  label: string;
  /**
   * Entity kind, saved in the mention node.
   * @defaultValue "mention"
   */
  type?: string;
  icon?: React.ReactNode;
  /** Trailing content on the row and the chip. */
  trailing?: React.ReactNode;
  /** Section heading. Sections render in first-appearance order. */
  group?: string;
  disabled?: boolean;
  /** Your own data. It is never saved in the document. */
  data?: unknown;
}

export interface EditorSlashItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  /** Section heading. Sections keep the order they are declared in. */
  group?: string;
  /** Extra words the filter matches. */
  keywords?: string[];
  /** Shortcut shown on the row, in ProseMirror keymap syntax. Built-in commands fill it in. */
  shortcut?: string;
  disabled?: boolean;
  /** Runs after the menu removes the typed `/query`. */
  run: (editor: EditorApi) => void;
}

export interface EditorApi {
  /** The ProseMirror view. Null until `Editor.Content` mounts. */
  view: EditorView | null;
  getState: () => EditorState;
  /** Runs a command. Returns true if it applied. */
  commands: EditorCommands;
  /** Dry runs a command. Nothing is dispatched. */
  can: EditorCommands;
  isActive: (format: string, attrs?: Record<string, unknown>) => boolean;
  getJSON: () => EditorJSON;
  getText: () => string;
  getHTML: () => string;
  /** Null, with a dev console error, when the `markdown` prop is not set. */
  getMarkdown: () => string | null;
  focus: (position?: 'start' | 'end') => void;
}

export interface EditorCommands {
  toggleMark: (
    mark: 'bold' | 'italic' | 'underline' | 'strike' | 'code'
  ) => boolean;
  setParagraph: () => boolean;
  setHeading: (level: 1 | 2 | 3 | 4) => boolean;
  toggleBlock: (block: 'blockquote' | 'codeBlock') => boolean;
  toggleList: (list: 'bulletList' | 'orderedList' | 'taskList') => boolean;
  setLink: (href: string) => boolean;
  unsetLink: () => boolean;
  insertHorizontalRule: () => boolean;
  insertText: (text: string) => boolean;
  insertMention: (
    item: EditorMentionItem,
    options?: { trigger?: string }
  ) => boolean;
  clearFormatting: () => boolean;
  undo: () => boolean;
  redo: () => boolean;
  setContent: (value: EditorJSON) => boolean;
  clear: () => boolean;
}

export interface EditorChangeDetails {
  /** One paragraph that holds only whitespace. */
  empty: boolean;
  /** Collects the mentions in the doc, in document order. */
  getMentions: () => EditorMention[];
  /** Converts the doc to plain text. Mentions read as `@label`. */
  getText: () => string;
  /** Converts the doc to HTML. */
  getHTML: () => string;
  /** Converts the doc to Markdown. Only present with the `markdown` prop. */
  getMarkdown?: () => string;
}

export interface MarkdownAdapterOptions {
  /**
   * `"markup"` writes `@[label](type:id)`, which round-trips. `"label"` writes `@label`.
   * @defaultValue "markup"
   */
  mentions?: 'markup' | 'label';

  /**
   * `"html"` writes `<u>…</u>`. `"drop"` writes plain text.
   * @defaultValue "html"
   */
  underline?: 'html' | 'drop';

  /**
   * Parses plain-text Markdown on paste.
   * @defaultValue true
   */
  paste?: boolean;

  /**
   * Writes Markdown to `text/plain` on copy.
   * @defaultValue false
   */
  copy?: boolean;
}

type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'undo'
  | 'redo'
  | 'focusToolbar';

interface EditorJSON {
  type: string;
  attrs?: Record<string, unknown>;
  content?: EditorJSON[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

interface EditorMention {
  id: string;
  label: string;
  type: string;
  trigger: string;
  start: number;
  end: number;
}

interface MarkdownAdapter {
  toEditor: (markdown: string) => EditorJSON;
  fromEditor: (value: EditorJSON) => string;
}

/** A ProseMirror `EditorState`. */
type EditorState = Record<string, unknown>;
/** A ProseMirror `EditorView`. */
type EditorView = Record<string, unknown>;
