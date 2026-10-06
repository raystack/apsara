// The escaping, mark-boundary and list rules follow prosemirror-markdown's
// to_markdown.ts (MIT, https://github.com/ProseMirror/prosemirror-markdown),
// rewritten to walk editor JSON instead of a ProseMirror document.

import type { EditorJSON } from '../core/json';
import { isSafeHref, stripControlCharacters } from '../core/link';
import {
  type MentionAttrs,
  mentionText,
  serializeMention
} from '../core/mention';
import { LIST_TYPES } from '../core/schema';

type JSONMark = NonNullable<EditorJSON['marks']>[number];

export interface ToMarkdownOptions {
  mentions: 'markup' | 'label';
  underline: 'html' | 'drop';
}

/** Marks earlier in the list open first and close last. Code is innermost. */
const MARK_ORDER = ['link', 'bold', 'italic', 'strike', 'underline', 'code'];

const LISTS: readonly string[] = LIST_TYPES;

const PUNCTUATION = /[\p{P}\p{S}]/u;

function rank(mark: JSONMark): number {
  const index = MARK_ORDER.indexOf(mark.type);
  return index === -1 ? MARK_ORDER.length : index;
}

function sameMark(a: JSONMark, b: JSONMark): boolean {
  return a.type === b.type && a.attrs?.href === b.attrs?.href;
}

function hrefOf(mark: JSONMark): string {
  return String(mark.attrs?.href ?? '');
}

function firstChar(text: string): string {
  const code = text.codePointAt(0);
  return code === undefined ? '' : String.fromCodePoint(code);
}

function lastChar(text: string): string {
  const code = text.charCodeAt(text.length - 1);
  const surrogate = code >= 0xdc00 && code <= 0xdfff && text.length > 1;
  return text.slice(surrogate ? -2 : -1);
}

function isPunctuation(char: string): boolean {
  return PUNCTUATION.test(char);
}

/** Neither whitespace nor punctuation, the characters that stop a delimiter. */
function isWordChar(char: string): boolean {
  return char !== '' && !/\s/u.test(char) && !isPunctuation(char);
}

/** A character reference. It renders as `char`, but it counts as punctuation next to a delimiter. */
function charRef(char: string): string {
  return `&#x${(char.codePointAt(0) ?? 0).toString(16).toUpperCase()};`;
}

function escapeText(text: string): string {
  return text.replace(/[`*\\~[\]_<]/g, '\\$&').replace(/&(?=#?\w+;)/g, '\\&');
}

/**
 * Escapes text at the start of a line. Leading whitespace would indent the
 * line into a code block or be dropped, so the first space becomes a
 * reference. `-`, `+`, `>`, `#`, `1.` and a run of `=` would start a list, a
 * quote, a heading or a rule.
 */
function escapeLineStart(text: string): string {
  if (/^[ \t]/.test(text)) return charRef(text[0]) + text.slice(1);
  return text
    .replace(/^[->]/, '\\$&')
    .replace(/^\+(?=[ \t]|$)/, '\\+')
    .replace(/^#{1,6}(?=[ \t]|$)/, '\\$&')
    .replace(/^(\d{1,9})([.)])(?=[ \t]|$)/, '$1\\$2')
    .replace(/^=+[ \t]*$/, '\\$&');
}

function escapeHref(href: string): string {
  return href.replace(/[\s()<>]/g, char => encodeURIComponent(char));
}

function codeSpan(text: string): string {
  const runs = text.match(/`+/g) ?? [];
  const longest = runs.reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(longest + 1);
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${text}${pad}${fence}`;
}

class InlineWriter {
  private out = '';
  private active: JSONMark[] = [];
  private trailing = '';
  private atLineStart = true;
  /**
   * The last closing delimiter follows punctuation, so it closes only before
   * whitespace, punctuation or the end, as in `**Note:**`.
   */
  private closedAfterPunctuation = false;

  constructor(
    private readonly options: ToMarkdownOptions,
    private readonly heading: boolean
  ) {}

  private opener(mark: JSONMark): string {
    switch (mark.type) {
      case 'bold':
        return '**';
      case 'italic':
        return '*';
      case 'strike':
        return '~~';
      case 'underline':
        return this.options.underline === 'html' ? '<u>' : '';
      case 'link':
        return '[';
      default:
        return '';
    }
  }

  private closer(mark: JSONMark): string {
    switch (mark.type) {
      case 'bold':
        return '**';
      case 'italic':
        return '*';
      case 'strike':
        return '~~';
      case 'underline':
        return this.options.underline === 'html' ? '</u>' : '';
      case 'link':
        return `](${escapeHref(stripControlCharacters(hrefOf(mark)))})`;
      default:
        return '';
    }
  }

  /** Appends Markdown source. */
  private raw(source: string) {
    if (!source) return;
    let text = source;
    if (this.closedAfterPunctuation) {
      this.closedAfterPunctuation = false;
      const first = firstChar(text);
      if (isWordChar(first)) text = charRef(first) + text.slice(first.length);
    }
    this.out += text;
  }

  /** Appends text, escaped. */
  private text(text: string) {
    if (!text) return;
    const escaped = escapeText(text);
    this.raw(this.atLineStart ? escapeLineStart(escaped) : escaped);
    this.atLineStart = false;
  }

  /** Opens `marks`. `next` is the Markdown that follows the delimiters. */
  private open(marks: JSONMark[], next: string) {
    const openers = marks.map(mark => this.opener(mark)).join('');
    if (!openers) return;
    const run = openers.match(/^(?:\*+|~+)/)?.[0];
    if (run) {
      // A run followed by punctuation opens only after whitespace or
      // punctuation, as in `text**:note**`.
      const after = firstChar(openers.slice(run.length) || next);
      const before = lastChar(this.out);
      if (isWordChar(before) && isPunctuation(after)) {
        this.out = this.out.slice(0, -before.length) + charRef(before);
      }
    }
    // `!` right before `[` would turn the link into an image.
    if (openers.startsWith('[') && this.out.endsWith('!')) {
      this.out = `${this.out.slice(0, -1)}\\!`;
    }
    this.raw(openers);
    this.atLineStart = false;
  }

  /** Closes the marks past `keep`, then writes the whitespace held back. */
  private settle(keep: number) {
    let closers = '';
    while (this.active.length > keep) {
      const mark = this.active.pop();
      if (mark) closers += this.closer(mark);
    }
    if (closers) {
      this.raw(closers);
      const run = closers.match(/(?:\*+|~+)$/)?.[0];
      if (run) {
        const before = lastChar(this.out.slice(0, -run.length));
        this.closedAfterPunctuation = isPunctuation(before);
      }
    }
    this.raw(this.trailing);
    this.trailing = '';
  }

  private commonPrefix(marks: JSONMark[]): number {
    let keep = 0;
    while (
      keep < this.active.length &&
      keep < marks.length &&
      sameMark(this.active[keep], marks[keep])
    ) {
      keep += 1;
    }
    return keep;
  }

  write(node: EditorJSON, next: EditorJSON | undefined) {
    let marks = (node.marks ?? [])
      .filter(mark => mark.type !== 'link' || isSafeHref(hrefOf(mark)))
      .sort((a, b) => rank(a) - rank(b));
    const code = marks.some(mark => mark.type === 'code');
    marks = marks.filter(mark => mark.type !== 'code');

    if (node.type === 'hardBreak') {
      // A mark that ends at the break closes before it, so no delimiter
      // starts the next line.
      marks = marks.filter(
        mark =>
          next?.marks?.some(other => sameMark(other, mark)) &&
          (next.type !== 'text' || /\S/.test(next.text ?? ''))
      );
    } else if (
      node.type === 'text' &&
      (node.text ?? '').trim() === '' &&
      !code
    ) {
      // Whitespace-only text opens no new marks, so no `** **` is written.
      marks = marks.slice(0, this.commonPrefix(marks));
    }

    const keep = this.commonPrefix(marks);
    this.settle(keep);

    if (node.type === 'text') {
      this.writeText(node.text ?? '', marks, keep, code);
      return;
    }

    if (node.type === 'hardBreak') {
      // A heading is one line, so a break in it becomes a space.
      const output = this.heading ? ' ' : '\\\n';
      this.open(marks.slice(keep), output);
      this.active = marks;
      this.raw(output);
      this.atLineStart = !this.heading;
      return;
    }

    if (node.type === 'mention') {
      const attrs = node.attrs as unknown as MentionAttrs;
      if (this.options.mentions === 'label') {
        const label = mentionText(attrs);
        this.open(marks.slice(keep), escapeText(label));
        this.active = marks;
        this.text(label);
        return;
      }
      // `![` opens an image, so a `!` mention reads back as text.
      let markup = serializeMention(attrs);
      if (markup.startsWith('![')) markup = `\\${markup}`;
      this.open(marks.slice(keep), markup);
      this.active = marks;
      this.raw(markup);
      this.atLineStart = false;
    }
  }

  private writeText(
    text: string,
    marks: JSONMark[],
    keep: number,
    code: boolean
  ) {
    const lead = text.match(/^\s*/)?.[0] ?? '';
    const trail =
      text.length > lead.length ? (text.match(/\s*$/)?.[0] ?? '') : '';
    const core = text.slice(lead.length, text.length - trail.length);

    if (marks.length > keep || code) {
      // Markdown does not allow whitespace just inside a delimiter, so it
      // moves outside the marks.
      this.text(lead);
      const body = code ? (core ? codeSpan(core) : '') : escapeText(core);
      this.open(marks.slice(keep), body);
      this.active = marks;
      this.raw(body);
      if (body) this.atLineStart = false;
    } else {
      this.active = marks;
      this.text(lead + core);
    }

    if (code || marks.length) this.trailing = trail;
    else this.raw(trail);
  }

  finish(): string {
    this.settle(0);
    return this.out;
  }
}

function inline(
  content: EditorJSON[] | undefined,
  options: ToMarkdownOptions,
  heading = false
): string {
  const nodes = [...(content ?? [])];
  // A hard break at the end of a block has no Markdown form.
  while (nodes[nodes.length - 1]?.type === 'hardBreak') nodes.pop();
  const writer = new InlineWriter(options, heading);
  nodes.forEach((node, index) => {
    writer.write(node, nodes[index + 1]);
  });
  return writer.finish();
}

function indent(text: string, first: string, rest: string): string {
  return text
    .split('\n')
    .map((line, index) => {
      if (index === 0) return first + line;
      return line ? rest + line : line;
    })
    .join('\n');
}

function textOf(node: EditorJSON): string {
  return (node.content ?? []).map(child => child.text ?? '').join('');
}

/**
 * Blocks with `separator` before each one after the first. A list right after
 * a list that uses the same marker switches its marker (`-` and `*`, `.` and
 * `)`), or the two would read back as one list.
 */
function sequence(
  nodes: EditorJSON[],
  options: ToMarkdownOptions,
  separator: (node: EditorJSON) => string
): string {
  let out = '';
  let previous: string | null = null;
  nodes.forEach((node, index) => {
    if (index > 0) out += separator(node);
    if (!LISTS.includes(node.type)) {
      out += block(node, options);
      previous = null;
      return;
    }
    const ordered = node.type === 'orderedList';
    const [first, second] = ordered ? ['.', ')'] : ['-', '*'];
    const marker = previous === first ? second : first;
    out += list(node, options, marker);
    previous = marker;
  });
  return out;
}

function listItem(item: EditorJSON, options: ToMarkdownOptions): string {
  return sequence(item.content ?? [], options, child =>
    LISTS.includes(child.type) ? '\n' : '\n\n'
  );
}

function list(
  node: EditorJSON,
  options: ToMarkdownOptions,
  marker: string
): string {
  const items = node.content ?? [];
  // A list with a second paragraph or a code block in an item is loose.
  const loose = items.some(item =>
    (item.content ?? []).slice(1).some(child => !LISTS.includes(child.type))
  );
  const start = Number(node.attrs?.start ?? 1);
  const first = Number.isSafeInteger(start) && start >= 0 ? start : 1;
  return items
    .map((item, index) => {
      let prefix = `${marker} `;
      if (node.type === 'orderedList') prefix = `${first + index}${marker} `;
      if (node.type === 'taskList') {
        prefix = `${marker} [${item.attrs?.checked ? 'x' : ' '}] `;
      }
      const body = listItem(item, options);
      return indent(body, prefix, ' '.repeat(prefix.length));
    })
    .join(loose ? '\n\n' : '\n');
}

function block(node: EditorJSON, options: ToMarkdownOptions): string {
  switch (node.type) {
    case 'paragraph':
      return inline(node.content, options);
    case 'heading': {
      const level = Math.min(
        Math.max(Math.round(Number(node.attrs?.level)) || 1, 1),
        6
      );
      return `${'#'.repeat(level)} ${inline(node.content, options, true)}`;
    }
    case 'blockquote':
      return blocks(node.content, options)
        .split('\n')
        .map(line => (line ? `> ${line}` : '>'))
        .join('\n');
    case 'codeBlock': {
      const text = textOf(node);
      const runs = text.match(/`{3,}/g) ?? [];
      const longest = runs.reduce((max, run) => Math.max(max, run.length), 2);
      const fence = '`'.repeat(longest + 1);
      const language = (node.attrs?.language as string | null) ?? '';
      return `${fence}${language}\n${text}\n${fence}`;
    }
    case 'horizontalRule':
      return '---';
    default:
      return node.content ? blocks(node.content, options) : (node.text ?? '');
  }
}

function blocks(
  content: EditorJSON[] | undefined,
  options: ToMarkdownOptions
): string {
  return sequence(content ?? [], options, () => '\n\n');
}

/** Serializes editor JSON as Markdown. */
export function toMarkdown(value: EditorJSON, options: ToMarkdownOptions) {
  return blocks(value.content, options);
}
