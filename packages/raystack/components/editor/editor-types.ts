import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { ReactNode } from 'react';
import type { EditorBlock } from './core/commands';
import type { EditorJSON } from './core/json';
import type { EditorMention } from './core/mention';
import type { EditorMentionItem } from './core/mention-registry';
import type {
  EditorFormat,
  EditorHeadingLevel,
  EditorList,
  EditorMark
} from './core/schema';

export interface EditorCommands {
  toggleMark: (mark: EditorMark) => boolean;
  setParagraph: () => boolean;
  setHeading: (level: EditorHeadingLevel) => boolean;
  toggleBlock: (block: 'blockquote' | 'codeBlock') => boolean;
  toggleList: (list: EditorList) => boolean;
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

export interface EditorApi {
  /** Null until `Editor.Content` mounts. */
  readonly view: EditorView | null;
  getState: () => EditorState;
  /** Runs a command. Returns true if it applied. */
  commands: EditorCommands;
  /** Dry runs a command. Nothing is dispatched. */
  can: EditorCommands;
  isActive: (format: EditorFormat, attrs?: Record<string, unknown>) => boolean;
  getJSON: () => EditorJSON;
  getText: () => string;
  getHTML: () => string;
  /** Null, with a dev console error, when the `markdown` prop is not set. */
  getMarkdown: () => string | null;
  focus: (position?: 'start' | 'end') => void;
}

export interface EditorChangeDetails {
  /** One paragraph that holds only whitespace. */
  empty: boolean;
  /** Collects the mentions in the doc from this change, in document order. */
  getMentions: () => EditorMention[];
  /** Converts the doc from this change to plain text. Mentions read as `@label`. */
  getText: () => string;
  /** Converts the doc from this change to HTML. */
  getHTML: () => string;
}

export type EditorMarkdownChangeDetails = EditorChangeDetails & {
  /** Converts the doc from this change to Markdown with the editor's adapter. */
  getMarkdown: () => string;
};

/** Converts between Markdown and editor JSON. */
export interface MarkdownAdapter {
  toEditor: (markdown: string) => EditorJSON;
  fromEditor: (value: EditorJSON) => string;
  /**
   * Parses plain-text Markdown on paste.
   * @default true
   */
  readonly paste?: boolean;
  /**
   * Writes Markdown to `text/plain` on copy.
   * @default false
   */
  readonly copy?: boolean;
}

export interface EditorSlashItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  group?: string;
  keywords?: string[];
  /** Shortcut shown on the row, in ProseMirror keymap syntax. */
  shortcut?: string;
  disabled?: boolean;
  /** Runs after the menu removes the typed `/query`. */
  run: (editor: EditorApi) => void;
}

export type { EditorBlock };
