import type { Node as PMNode, Schema } from 'prosemirror-model';
import { isSafeHref } from './link';

/** A ProseMirror document as JSON, the value `Editor` takes and emits. */
export interface EditorJSON {
  type: string;
  attrs?: Record<string, unknown>;
  content?: EditorJSON[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

export function emptyDoc(schema: Schema): PMNode {
  const doc = schema.topNodeType.createAndFill();
  if (!doc) throw new Error('[Apsara] Editor schema has no default block.');
  return doc;
}

/** The text inside a node, with mentions written as `@label`. */
function textOf(json: EditorJSON): string {
  if (typeof json.text === 'string') return json.text;
  if (json.type === 'mention') {
    const trigger = (json.attrs?.trigger as string | undefined) ?? '@';
    return `${trigger}${(json.attrs?.label as string | undefined) ?? ''}`;
  }
  if (json.type === 'hardBreak') return '\n';
  return (json.content ?? []).map(textOf).join('');
}

function textNode(text: string): EditorJSON[] {
  return text ? [{ type: 'text', text }] : [];
}

function sanitizeMarks(
  schema: Schema,
  marks: EditorJSON['marks']
): EditorJSON['marks'] {
  if (!marks) return undefined;
  const kept = marks.filter(mark => {
    if (!(mark.type in schema.marks)) return false;
    if (mark.type === 'link') {
      const href = mark.attrs?.href;
      return typeof href === 'string' && isSafeHref(href);
    }
    return true;
  });
  return kept.length ? kept : undefined;
}

/**
 * Rewrites JSON so the schema can load it: a node type the schema does not
 * have becomes its text, as a paragraph at block level. An unknown mark is
 * dropped, and so is a link with an unsafe `href`.
 */
function sanitize(
  schema: Schema,
  json: EditorJSON,
  inline: boolean
): EditorJSON[] {
  if (json.type === 'text') {
    if (!json.text) return [];
    return [{ ...json, marks: sanitizeMarks(schema, json.marks) }];
  }

  const type = schema.nodes[json.type];
  if (!type) {
    const text = textOf(json);
    if (inline) return textNode(text);
    return [{ type: 'paragraph', content: textNode(text) }];
  }

  const attrs =
    json.type === 'heading'
      ? {
          ...json.attrs,
          level: Math.min(Math.max(Number(json.attrs?.level) || 1, 1), 4)
        }
      : json.attrs;

  return [
    {
      ...json,
      attrs,
      marks: sanitizeMarks(schema, json.marks),
      content: json.content?.flatMap(child =>
        sanitize(schema, child, type.inlineContent)
      )
    }
  ];
}

/** One paragraph per text block, for JSON that still does not fit the schema. */
function fallbackDoc(schema: Schema, json: EditorJSON): PMNode {
  const blocks: string[] = [];
  const walk = (node: EditorJSON) => {
    const type = schema.nodes[node.type];
    if (type?.isTextblock || (!type && !node.content?.some(c => c.content))) {
      blocks.push(textOf(node));
      return;
    }
    node.content?.forEach(walk);
  };
  json.content?.forEach(walk);
  const paragraphs = blocks.map(text =>
    schema.nodes.paragraph.create(null, text ? schema.text(text) : null)
  );
  return paragraphs.length
    ? schema.topNodeType.create(null, paragraphs)
    : emptyDoc(schema);
}

/** Loads JSON into a document of `schema`. Never throws. */
export function docFromJSON(schema: Schema, json: EditorJSON): PMNode {
  if (!json || json.type !== 'doc' || !json.content?.length) {
    return emptyDoc(schema);
  }
  const [clean] = sanitize(schema, json, false);
  try {
    const doc = schema.nodeFromJSON(clean);
    doc.check();
    return doc;
  } catch {
    return fallbackDoc(schema, json);
  }
}
