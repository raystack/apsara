import type {
  DOMOutputSpec,
  Mark,
  Node as PMNode,
  Schema
} from 'prosemirror-model';
import { docFromJSON, type EditorJSON } from './json';
import type { EditorMention, MentionAttrs } from './mention';
import { buildSchema } from './schema';

const VOID_ELEMENTS = new Set(['br', 'hr', 'img', 'input']);

const HOLE = '\u0000';

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

function isAttrs(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !('nodeType' in value)
  );
}

/** Writes a `toDOM` spec as a string. `hole` fills the content slot. */
function renderSpec(spec: DOMOutputSpec, hole: () => string): string {
  if (typeof spec === 'string') return escapeText(spec);
  if (!Array.isArray(spec)) return '';

  const [rawTag, ...rest] = spec as readonly [string, ...unknown[]];
  const tag = rawTag.includes(' ') ? rawTag.split(' ')[1] : rawTag;
  let children = rest;
  let attrs = '';
  if (isAttrs(rest[0])) {
    children = rest.slice(1);
    for (const [name, value] of Object.entries(rest[0])) {
      if (value == null) continue;
      attrs += ` ${name}="${escapeAttribute(String(value))}"`;
    }
  }

  if (VOID_ELEMENTS.has(tag)) return `<${tag}${attrs}>`;

  let inner = '';
  for (const child of children) {
    // The hole can sit in a nested element, as in `['pre', ['code', 0]]`.
    inner += child === 0 ? hole() : renderSpec(child as DOMOutputSpec, hole);
  }
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

function markTags(mark: Mark): [string, string] {
  const toDOM = mark.type.spec.toDOM;
  if (!toDOM) return ['', ''];
  const html = renderSpec(toDOM(mark, true), () => HOLE);
  const [open, close = ''] = html.split(HOLE);
  return [open, close];
}

function serializeChildren(node: PMNode): string {
  if (!node.inlineContent) {
    let html = '';
    node.forEach(child => {
      html += serializeNode(child);
    });
    return html;
  }

  // Adjacent text with the same marks shares one element, as
  // ProseMirror's DOMSerializer does.
  let html = '';
  const open: Mark[] = [];
  const closers: string[] = [];
  node.forEach(child => {
    let keep = 0;
    while (
      keep < open.length &&
      keep < child.marks.length &&
      child.marks[keep].eq(open[keep])
    ) {
      keep += 1;
    }
    while (open.length > keep) {
      open.pop();
      html += closers.pop();
    }
    for (let index = keep; index < child.marks.length; index += 1) {
      const [start, end] = markTags(child.marks[index]);
      html += start;
      open.push(child.marks[index]);
      closers.push(end);
    }
    html += serializeNode(child);
  });
  while (closers.length) html += closers.pop();
  return html;
}

function serializeNode(node: PMNode): string {
  if (node.isText) return escapeText(node.text ?? '');
  const toDOM = node.type.spec.toDOM;
  if (!toDOM) return serializeChildren(node);
  return renderSpec(toDOM(node), () => serializeChildren(node));
}

/** HTML for a document, built from the schema's `toDOM` specs with no DOM. */
export function docToHTML(doc: PMNode): string {
  return serializeChildren(doc);
}

export interface DocText {
  text: string;
  mentions: EditorMention[];
}

/**
 * Plain text for a document: text blocks are separated by a blank line, a
 * hard break is a newline, and a mention reads as its trigger and label.
 * Mention offsets index into `text`.
 */
export function docToText(doc: PMNode): DocText {
  let text = '';
  let first = true;
  const mentions: EditorMention[] = [];

  doc.descendants(node => {
    if (node.isTextblock) {
      if (first) first = false;
      else text += '\n\n';
      return true;
    }
    if (node.isText) {
      text += node.text ?? '';
      return false;
    }
    if (node.type.name === 'mention') {
      const attrs = node.attrs as MentionAttrs;
      const label = `${attrs.trigger}${attrs.label}`;
      mentions.push({
        ...attrs,
        start: text.length,
        end: text.length + label.length
      });
      text += label;
      return false;
    }
    if (node.type.name === 'hardBreak') {
      text += '\n';
      return false;
    }
    return true;
  });

  return { text, mentions };
}

/** The mentions in a document, in document order. */
export function docMentions(doc: PMNode): EditorMention[] {
  return docToText(doc).mentions;
}

/**
 * The predicate behind `data-empty` and `details.empty`: one paragraph that
 * holds only whitespace and hard breaks.
 */
export function isEditorEmpty(doc: PMNode): boolean {
  if (doc.childCount !== 1) return false;
  const first = doc.firstChild;
  if (!first || first.type.name !== 'paragraph') return false;
  let empty = true;
  first.forEach(child => {
    if (child.isText && (child.text ?? '').trim() === '') return;
    if (child.type.name === 'hardBreak') return;
    empty = false;
  });
  return empty;
}

/** The placeholder shows only while the doc is one paragraph with no content. */
export function showsPlaceholder(doc: PMNode): boolean {
  const first = doc.firstChild;
  return (
    doc.childCount === 1 &&
    first !== null &&
    first.type.name === 'paragraph' &&
    first.content.size === 0
  );
}

let fullSchema: Schema | undefined;

/** Converts editor JSON to HTML. It needs no DOM, so it runs on the server. */
export function editorToHTML(value: EditorJSON): string {
  fullSchema ??= buildSchema();
  return docToHTML(docFromJSON(fullSchema, value));
}

/** Converts editor JSON to plain text. Mentions read as `@label`. */
export function editorToText(value: EditorJSON): string {
  fullSchema ??= buildSchema();
  return docToText(docFromJSON(fullSchema, value)).text;
}
