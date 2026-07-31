import { Fragment, type Node as PMNode, Slice } from 'prosemirror-model';
import {
  type EditorMention,
  isTriggerCharacter,
  type MentionAttrs,
  serializeMention
} from './mention';
import {
  editorSchema,
  hardBreakType,
  mentionType,
  paragraphType
} from './schema';

export interface EditorDocDetails {
  /** Round-trippable markup — `"check @[DataTable](component:data-table)"`. */
  markup: string;
  /** Plain text with each label inlined behind its trigger. */
  text: string;
  /** Document order; duplicates preserved. */
  mentions: EditorMention[];
  /** No mentions, and text that trims to `""`. */
  empty: boolean;
}

interface MentionMatch {
  attrs: MentionAttrs;
  /** Index just past the closing `)`. */
  next: number;
}

/**
 * Reads `X[label](type:id)` at `start`, where `X` is the trigger. Returns null
 * for anything malformed so the caller can keep the characters as literal text.
 */
function readMention(source: string, start: number): MentionMatch | null {
  const trigger = source[start];
  if (!isTriggerCharacter(trigger) || source[start + 1] !== '[') return null;

  let index = start + 2;
  let label = '';
  while (index < source.length) {
    const char = source[index];
    if (char === '\\' && index + 1 < source.length) {
      label += source[index + 1];
      index += 2;
      continue;
    }
    if (char === ']') break;
    if (char === '\n') return null;
    label += char;
    index += 1;
  }
  if (source[index] !== ']' || source[index + 1] !== '(') return null;
  index += 2;

  let type = '';
  let id = '';
  let separated = false;
  while (index < source.length) {
    const char = source[index];
    if (char === '\\' && index + 1 < source.length) {
      if (separated) id += source[index + 1];
      else type += source[index + 1];
      index += 2;
      continue;
    }
    if (char === ')') break;
    if (char === '\n') return null;
    if (char === ':' && !separated) {
      separated = true;
      index += 1;
      continue;
    }
    if (separated) id += char;
    else type += char;
    index += 1;
  }
  if (source[index] !== ')') return null;
  if (!separated || !label || !type || !id) return null;

  return { attrs: { id, label, type, trigger }, next: index + 1 };
}

/** Inline content for a plain string — newlines become hard breaks. */
export function inlineFragmentFromText(text: string): Fragment {
  const nodes: PMNode[] = [];
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) nodes.push(hardBreakType.create());
    if (line) nodes.push(editorSchema.text(line));
  });
  return Fragment.fromArray(nodes);
}

/**
 * Parses the markup dialect into a document. Called only for `value` /
 * `defaultValue` — never for typed or pasted input, so ordinary prose that
 * happens to contain `@[…](…)` stays literal while it is being written.
 */
export function docFromMarkup(markup: string): PMNode {
  const nodes: PMNode[] = [];
  let literal = '';
  let index = 0;

  const flush = () => {
    if (!literal) return;
    nodes.push(editorSchema.text(literal));
    literal = '';
  };

  while (index < markup.length) {
    const char = markup[index];

    if (char === '\n') {
      flush();
      nodes.push(hardBreakType.create());
      index += 1;
      continue;
    }

    if (markup[index + 1] === '[' && isTriggerCharacter(char)) {
      const match = readMention(markup, index);
      if (match) {
        flush();
        nodes.push(mentionType.create(match.attrs));
        index = match.next;
        continue;
      }
    }

    literal += char;
    index += 1;
  }
  flush();

  return editorSchema.topNodeType.create(
    null,
    paragraphType.create(null, Fragment.fromArray(nodes))
  );
}

/** A document holding a plain string, with no markup interpretation at all. */
export function docFromText(text: string): PMNode {
  return editorSchema.topNodeType.create(
    null,
    paragraphType.create(null, inlineFragmentFromText(text))
  );
}

/** Everything the host needs from a document, in one walk. */
export function deriveDocDetails(doc: PMNode): EditorDocDetails {
  let markup = '';
  let text = '';
  const mentions: EditorMention[] = [];

  doc.descendants(node => {
    if (node.type === mentionType) {
      const attrs = node.attrs as MentionAttrs;
      const label = `${attrs.trigger}${attrs.label}`;
      mentions.push({
        ...attrs,
        start: text.length,
        end: text.length + label.length
      });
      markup += serializeMention(attrs);
      text += label;
      return false;
    }
    if (node.type === hardBreakType) {
      markup += '\n';
      text += '\n';
      return false;
    }
    if (node.isText) {
      markup += node.text ?? '';
      text += node.text ?? '';
      return false;
    }
    return true;
  });

  return {
    markup,
    text,
    mentions,
    empty: mentions.length === 0 && text.trim() === ''
  };
}

/** The `text/plain` clipboard flavour for a copied range. */
export function textFromFragment(fragment: Fragment): string {
  let text = '';
  const walk = (content: Fragment) => {
    content.forEach(node => {
      if (node.type === mentionType) {
        const attrs = node.attrs as MentionAttrs;
        text += `${attrs.trigger}${attrs.label}`;
        return;
      }
      if (node.type === hardBreakType) {
        text += '\n';
        return;
      }
      if (node.isText) {
        text += node.text ?? '';
        return;
      }
      if (node.isBlock && text) text += '\n';
      walk(node.content);
    });
  };
  walk(fragment);
  return text;
}

export function serializeMarkup(doc: PMNode): string {
  return deriveDocDetails(doc).markup;
}

export function serializeText(doc: PMNode): string {
  return deriveDocDetails(doc).text;
}

/**
 * The length of the derived text, without building it. Read on every
 * transaction by the `maxLength` filter, which only ever wanted the number.
 */
export function textLength(doc: PMNode): number {
  let length = 0;
  doc.descendants(node => {
    if (node.type === mentionType) {
      const attrs = node.attrs as MentionAttrs;
      length += attrs.trigger.length + attrs.label.length;
      return false;
    }
    if (node.type === hardBreakType) {
      length += 1;
      return false;
    }
    if (node.isText) {
      length += node.text?.length ?? 0;
      return false;
    }
    return true;
  });
  return length;
}

/**
 * The emptiness predicate, without building the markup and the mention list
 * `deriveDocDetails` would. Read by the placeholder decoration on every state
 * change, so it walks only as far as the first piece of content.
 *
 * Equivalent to `deriveDocDetails(doc).empty`: the concatenated text trims to
 * `""` exactly when every text node does, and a hard break contributes only a
 * newline.
 */
export function isDocEmpty(doc: PMNode): boolean {
  let empty = true;
  doc.descendants(node => {
    if (!empty) return false;
    if (node.type === mentionType) {
      empty = false;
      return false;
    }
    if (node.type === hardBreakType) return false;
    if (node.isText) {
      if ((node.text ?? '').trim() !== '') empty = false;
      return false;
    }
    return true;
  });
  return empty;
}

/**
 * Collapses a pasted slice to the inline content this schema allows: block
 * boundaries become hard breaks, mentions survive with their ids, everything
 * else arrives as text because the schema has nowhere else to put it.
 */
export function flattenToInlineSlice(slice: Slice): Slice {
  const nodes: PMNode[] = [];

  const walk = (fragment: Fragment) => {
    fragment.forEach(child => {
      if (child.isInline) {
        nodes.push(child.mark([]));
        return;
      }
      if (nodes.length) nodes.push(hardBreakType.create());
      walk(child.content);
    });
  };
  walk(slice.content);

  return new Slice(Fragment.fromArray(nodes), 0, 0);
}
