// The escaping, mark-boundary and list rules follow prosemirror-markdown's
// to_markdown.ts (MIT, https://github.com/ProseMirror/prosemirror-markdown),
// rewritten to walk editor JSON instead of a ProseMirror document.

import type { EditorJSON } from '../core/json';
import { type MentionAttrs, serializeMention } from '../core/mention';

type JSONMark = NonNullable<EditorJSON['marks']>[number];

export interface ToMarkdownOptions {
  mentions: 'markup' | 'label';
  underline: 'html' | 'drop';
}

/** Marks earlier in the list open first and close last. Code is innermost. */
const MARK_ORDER = ['link', 'bold', 'italic', 'strike', 'underline', 'code'];

function rank(mark: JSONMark): number {
  const index = MARK_ORDER.indexOf(mark.type);
  return index === -1 ? MARK_ORDER.length : index;
}

function sameMark(a: JSONMark, b: JSONMark): boolean {
  return a.type === b.type && a.attrs?.href === b.attrs?.href;
}

function escapeText(text: string, atLineStart: boolean): string {
  let escaped = text
    .replace(/[`*\\~[\]_<]/g, '\\$&')
    .replace(/&(?=#?\w+;)/g, '\\&');
  if (atLineStart) {
    escaped = escaped
      .replace(/^(\s*)([-+>]|#{1,6})(?=\s|$)/, '$1\\$2')
      .replace(/^(\s*\d+)([.)])(?=\s|$)/, '$1\\$2');
  }
  return escaped;
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

  constructor(private readonly options: ToMarkdownOptions) {}

  private open(mark: JSONMark): string {
    switch (mark.type) {
      case 'bold':
        return '**';
      case 'italic':
        return '_';
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

  private close(mark: JSONMark): string {
    switch (mark.type) {
      case 'bold':
        return '**';
      case 'italic':
        return '_';
      case 'strike':
        return '~~';
      case 'underline':
        return this.options.underline === 'html' ? '</u>' : '';
      case 'link':
        return `](${escapeHref(String(mark.attrs?.href ?? ''))})`;
      default:
        return '';
    }
  }

  /** Closes the marks past `keep`, then writes the whitespace held back. */
  private settle(keep: number) {
    while (this.active.length > keep) {
      const mark = this.active.pop();
      if (mark) this.out += this.close(mark);
    }
    this.out += this.trailing;
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

  write(node: EditorJSON) {
    let marks = [...(node.marks ?? [])].sort((a, b) => rank(a) - rank(b));
    const code = marks.find(mark => mark.type === 'code');
    marks = marks.filter(mark => mark.type !== 'code');

    if (node.type === 'text') {
      const text = node.text ?? '';
      // Whitespace-only text opens no new marks, so no `** **` is written.
      if (text.trim() === '' && !code) {
        marks = marks.slice(0, this.commonPrefix(marks));
      }
    }

    const keep = this.commonPrefix(marks);
    this.settle(keep);

    if (node.type === 'text') {
      const text = node.text ?? '';
      const lead = text.match(/^\s*/)?.[0] ?? '';
      const trail =
        text.length > lead.length ? (text.match(/\s*$/)?.[0] ?? '') : '';
      const core = text.slice(lead.length, text.length - trail.length);
      // Markdown does not allow whitespace just inside a delimiter, so it
      // moves outside the marks.
      const opening = marks.length > keep;
      if (opening || code) this.out += lead;
      for (const mark of marks.slice(keep)) this.out += this.open(mark);
      this.active = marks;
      let body = escapeText(opening ? core : lead + core, this.atLineStart);
      if (code) body = core ? codeSpan(core) : '';
      this.out += body;
      if (code || marks.length) this.trailing = trail;
      else this.out += trail;
      if (text.length) this.atLineStart = false;
      return;
    }

    for (const mark of marks.slice(keep)) this.out += this.open(mark);
    this.active = marks;

    if (node.type === 'hardBreak') {
      this.out += '\\\n';
      this.atLineStart = true;
      return;
    }
    if (node.type === 'mention') {
      const attrs = node.attrs as unknown as MentionAttrs;
      this.out +=
        this.options.mentions === 'label'
          ? escapeText(`${attrs.trigger}${attrs.label}`, this.atLineStart)
          : serializeMention(attrs);
      this.atLineStart = false;
    }
  }

  finish(): string {
    this.settle(0);
    return this.out;
  }
}

function inline(content: EditorJSON[] | undefined, options: ToMarkdownOptions) {
  const writer = new InlineWriter(options);
  for (const node of content ?? []) writer.write(node);
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

const LISTS = ['bulletList', 'orderedList', 'taskList'];

function listItem(item: EditorJSON, options: ToMarkdownOptions): string {
  const children = item.content ?? [];
  let body = '';
  children.forEach((child, index) => {
    if (index > 0) body += LISTS.includes(child.type) ? '\n' : '\n\n';
    body += block(child, options);
  });
  return body;
}

function list(node: EditorJSON, options: ToMarkdownOptions): string {
  const items = node.content ?? [];
  // A list with a second paragraph or a code block in an item is loose.
  const loose = items.some(item =>
    (item.content ?? []).slice(1).some(child => !LISTS.includes(child.type))
  );
  const start = Number(node.attrs?.start ?? 1);
  return items
    .map((item, index) => {
      let marker = '- ';
      if (node.type === 'orderedList') marker = `${start + index}. `;
      if (node.type === 'taskList') {
        marker = item.attrs?.checked ? '- [x] ' : '- [ ] ';
      }
      const body = listItem(item, options);
      return indent(body, marker, ' '.repeat(marker.length));
    })
    .join(loose ? '\n\n' : '\n');
}

function block(node: EditorJSON, options: ToMarkdownOptions): string {
  switch (node.type) {
    case 'paragraph':
      return inline(node.content, options);
    case 'heading': {
      const level = Number(node.attrs?.level ?? 1);
      return `${'#'.repeat(level)} ${inline(node.content, options)}`;
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
    case 'bulletList':
    case 'orderedList':
    case 'taskList':
      return list(node, options);
    default:
      return node.content ? blocks(node.content, options) : (node.text ?? '');
  }
}

function blocks(
  content: EditorJSON[] | undefined,
  options: ToMarkdownOptions
): string {
  return (content ?? []).map(node => block(node, options)).join('\n\n');
}

/** Serializes editor JSON as Markdown. */
export function toMarkdown(value: EditorJSON, options: ToMarkdownOptions) {
  return blocks(value.content, options);
}
