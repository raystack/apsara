import type { MarkdownAdapter as MarkdownAdapterShape } from '../editor-types';
import { fromMarkdown } from './from-markdown';
import { toMarkdown } from './to-markdown';

export interface MarkdownAdapterOptions {
  /**
   * `'markup'` writes `@[label](type:id)`, which round-trips. `'label'` writes `@label`.
   * @default 'markup'
   */
  mentions?: 'markup' | 'label';
  /**
   * `'html'` writes `<u>…</u>`. `'drop'` writes plain text.
   * @default 'html'
   */
  underline?: 'html' | 'drop';
  /**
   * Parses plain-text Markdown on paste.
   * @default true
   */
  paste?: boolean;
  /**
   * Writes Markdown to `text/plain` on copy.
   * @default false
   */
  copy?: boolean;
}

export type MarkdownAdapter = MarkdownAdapterShape;

function create(options: MarkdownAdapterOptions = {}): MarkdownAdapterShape {
  const writeOptions = {
    mentions: options.mentions ?? 'markup',
    underline: options.underline ?? 'html'
  };
  return {
    toEditor: markdown => fromMarkdown(markdown),
    fromEditor: value => toMarkdown(value, writeOptions),
    paste: options.paste ?? true,
    copy: options.copy ?? false
  };
}

const defaults = create();

/**
 * Converts between Markdown and editor JSON. Pass `MarkdownAdapter.create()`
 * to the editor's `markdown` prop.
 */
export const MarkdownAdapter = {
  create,
  toEditor: defaults.toEditor,
  fromEditor: defaults.fromEditor
};
