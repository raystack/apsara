import {
  Fragment,
  Mark,
  type NodeType,
  type Node as PMNode,
  type Schema
} from 'prosemirror-model';
import { isSafeHref, stripControlCharacters } from './link';
import { mentionText } from './mention';

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

function isNode(value: unknown): value is EditorJSON {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as EditorJSON).type === 'string'
  );
}

function childrenOf(json: EditorJSON): EditorJSON[] {
  return Array.isArray(json.content) ? json.content.filter(isNode) : [];
}

function isInline(schema: Schema, json: EditorJSON): boolean {
  return json.type === 'text' || !!schema.nodes[json.type]?.isInline;
}

/** The text of an inline leaf, with a mention written as `@label`. */
function leafText(json: EditorJSON): string {
  if (typeof json.text === 'string') return json.text;
  if (json.type === 'hardBreak') return '\n';
  if (json.type === 'mention') {
    const trigger = json.attrs?.trigger;
    return mentionText({
      trigger: typeof trigger === 'string' ? trigger : '@',
      label: String(json.attrs?.label ?? '')
    });
  }
  return '';
}

/**
 * The marks that `parent` allows. An unknown mark is dropped, and so is a
 * link with an unsafe `href`.
 */
function marksFor(
  schema: Schema,
  parent: NodeType,
  marks: EditorJSON['marks']
): readonly Mark[] {
  let set = Mark.none;
  if (!Array.isArray(marks)) return set;
  for (const json of marks) {
    const type = isNode(json) ? schema.marks[json.type] : undefined;
    if (!type || !parent.allowsMarkType(type)) continue;
    let attrs = json.attrs;
    if (type.name === 'link') {
      const href = json.attrs?.href;
      if (typeof href !== 'string' || !isSafeHref(href)) continue;
      attrs = { ...attrs, href: stripControlCharacters(href) };
    }
    try {
      set = type.create(attrs).addToSet(set);
    } catch {
      // Attributes the mark cannot take.
    }
  }
  return set;
}

/**
 * Inline content for `parent`. A node that `parent` does not allow keeps its
 * text, so a hard break in a code block becomes `\n`.
 */
function inlineNodes(
  schema: Schema,
  parent: NodeType,
  content: EditorJSON[]
): PMNode[] {
  const nodes: PMNode[] = [];
  for (const json of content) {
    if (json.type === 'text') {
      if (typeof json.text === 'string' && json.text) {
        nodes.push(
          schema.text(json.text, marksFor(schema, parent, json.marks))
        );
      }
      continue;
    }
    const type = schema.nodes[json.type];
    if (type?.isInline && parent.contentMatch.matchType(type)) {
      try {
        nodes.push(
          type.create(json.attrs, null, marksFor(schema, parent, json.marks))
        );
        continue;
      } catch {
        // A mention without an `id` or a `label` reads as its text.
      }
    }
    const children = childrenOf(json);
    if (children.length) {
      nodes.push(...inlineNodes(schema, parent, children));
      continue;
    }
    const text = leafText(json);
    if (text) nodes.push(schema.text(text));
  }
  return nodes;
}

function attrsFor(
  type: NodeType,
  attrs: EditorJSON['attrs']
): EditorJSON['attrs'] {
  if (type.name === 'heading') {
    const level = Math.round(Number(attrs?.level)) || 1;
    return { ...attrs, level: Math.min(Math.max(level, 1), 4) };
  }
  if (type.name === 'orderedList') {
    const start = Number(attrs?.start);
    return {
      ...attrs,
      start: Number.isSafeInteger(start) && start >= 0 ? start : 1
    };
  }
  return attrs;
}

/** Paragraphs that hold the text blocks of `node`, for a node that fits nowhere. */
function textBlocks(schema: Schema, node: PMNode): PMNode[] {
  const paragraph = schema.nodes.paragraph;
  if (node.type === paragraph) return [];
  if (node.isTextblock) return [paragraph.create(null, node.content)];
  const blocks: PMNode[] = [];
  node.descendants(child => {
    if (!child.isTextblock) return true;
    blocks.push(paragraph.create(null, child.content));
    return false;
  });
  return blocks;
}

/**
 * Makes `nodes` fit the content of `parent`. A node that does not fit is
 * wrapped, as a list item outside a list gets its list, or else keeps only its
 * text.
 */
function fit(schema: Schema, parent: NodeType, nodes: PMNode[]): PMNode[] {
  const fitted: PMNode[] = [];
  let match = parent.contentMatch;

  const place = (node: PMNode): boolean => {
    const fill = match.fillBefore(Fragment.from(node));
    const filled = fill && match.matchFragment(fill.addToEnd(node));
    if (fill && filled) {
      fill.forEach(child => {
        fitted.push(child);
      });
      fitted.push(node);
      match = filled;
      return true;
    }
    const wrapping = match.findWrapping(node.type);
    if (!wrapping?.length) return false;
    let wrapped: PMNode | null = node;
    for (let index = wrapping.length - 1; index >= 0 && wrapped; index -= 1) {
      wrapped = wrapping[index].createAndFill(null, wrapped);
    }
    const next = wrapped && match.matchType(wrapped.type);
    if (!wrapped || !next) return false;
    fitted.push(wrapped);
    match = next;
    return true;
  };

  for (const node of nodes) {
    if (place(node)) continue;
    for (const block of textBlocks(schema, node)) place(block);
  }
  return fitted;
}

/**
 * Block content from JSON. An unknown node unwraps into its blocks, or
 * becomes a paragraph when it holds only inline content. Inline nodes at block
 * level are wrapped in a paragraph.
 */
function blockNodes(schema: Schema, content: EditorJSON[]): PMNode[] {
  const paragraph = schema.nodes.paragraph;
  const blocks: PMNode[] = [];
  let run: EditorJSON[] = [];

  const flush = () => {
    if (run.length === 0) return;
    blocks.push(paragraph.create(null, inlineNodes(schema, paragraph, run)));
    run = [];
  };

  const visit = (json: EditorJSON) => {
    if (isInline(schema, json)) {
      run.push(json);
      return;
    }
    const type = schema.nodes[json.type];
    const children = childrenOf(json);
    if (!type || type === schema.topNodeType) {
      if (children.some(child => !isInline(schema, child))) {
        children.forEach(visit);
        return;
      }
      flush();
      blocks.push(
        paragraph.create(null, inlineNodes(schema, paragraph, [json]))
      );
      return;
    }
    flush();
    const inner = type.inlineContent
      ? inlineNodes(schema, type, children)
      : fit(schema, type, blockNodes(schema, children));
    const node = type.createAndFill(attrsFor(type, json.attrs), inner);
    if (node) blocks.push(node);
    else if (type.inlineContent) blocks.push(paragraph.create(null, inner));
    else for (const child of inner) blocks.push(...textBlocks(schema, child));
  };

  content.forEach(visit);
  flush();
  return blocks;
}

/**
 * Loads JSON into a document of `schema`, repairing what the schema cannot
 * hold. Never throws.
 */
export function docFromJSON(schema: Schema, json: EditorJSON): PMNode {
  try {
    if (!isNode(json) || json.type !== 'doc') return emptyDoc(schema);
    const top = schema.topNodeType;
    const doc = top.createAndFill(
      null,
      fit(schema, top, blockNodes(schema, childrenOf(json)))
    );
    if (!doc) return emptyDoc(schema);
    doc.check();
    return doc;
  } catch {
    return emptyDoc(schema);
  }
}
