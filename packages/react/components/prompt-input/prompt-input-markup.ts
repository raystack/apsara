import {
  Fragment,
  type Node as PMNode,
  Schema,
  Slice
} from 'prosemirror-model';
import {
  type EditorMention,
  isTriggerCharacter,
  type MentionAttrs,
  readMention,
  serializeMention
} from '../editor/core/mention';
import {
  hardBreakNodeSpec,
  mentionNodeSpec,
  paragraphNodeSpec
} from '../editor/core/nodes';
import { docToText } from '../editor/core/serializers';

/**
 * The nodes of `buildSchema(['mention'])`: no marks and no other blocks, so
 * pasted HTML arrives as plain text. It is built from the shared specs, so
 * the specs for the other formats are not bundled.
 */
export const promptInputSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: paragraphNodeSpec,
    text: { group: 'inline' },
    hardBreak: hardBreakNodeSpec,
    mention: mentionNodeSpec
  }
});

const { hardBreak, paragraph } = promptInputSchema.nodes;

export interface PromptInputDocDetails {
  /** Round-trippable markup, as in `"check @[DataTable](component:data-table)"`. */
  markup: string;
  /** Plain text with each label inlined behind its trigger. */
  text: string;
  /** Document order; duplicates preserved. */
  mentions: EditorMention[];
}

/** Inline content for a plain string, where newlines become hard breaks. */
export function inlineFragmentFromText(text: string): Fragment {
  const nodes: PMNode[] = [];
  text.split('\n').forEach((line, index) => {
    if (index > 0) nodes.push(hardBreak.create());
    if (line) nodes.push(promptInputSchema.text(line));
  });
  return Fragment.fromArray(nodes);
}

/**
 * Parses the markup dialect into a doc. Called only for `value` and
 * `defaultValue`, never for typed or pasted input, so prose that happens to
 * contain `@[…](…)` stays literal while it is being written.
 */
export function docFromMarkup(markup: string): PMNode {
  const nodes: PMNode[] = [];
  let literal = '';
  let index = 0;

  const flush = () => {
    if (!literal) return;
    nodes.push(promptInputSchema.text(literal));
    literal = '';
  };

  while (index < markup.length) {
    const char = markup[index];

    if (char === '\n') {
      flush();
      nodes.push(hardBreak.create());
      index += 1;
      continue;
    }

    if (markup[index + 1] === '[' && isTriggerCharacter(char)) {
      const match = readMention(markup, index);
      if (match) {
        flush();
        nodes.push(promptInputSchema.nodes.mention.create(match.attrs));
        index = match.next;
        continue;
      }
    }

    literal += char;
    index += 1;
  }
  flush();

  return promptInputSchema.topNodeType.create(
    null,
    paragraph.create(null, Fragment.fromArray(nodes))
  );
}

function markupLeaf(node: PMNode): string {
  if (node.type.name === 'mention') {
    return serializeMention(node.attrs as MentionAttrs);
  }
  return node.type.spec.leafText?.(node) ?? '';
}

/**
 * Markup, text and mentions for a doc. Text blocks are separated by a blank
 * line in both, as in `docToText`.
 */
export function deriveDocDetails(doc: PMNode): PromptInputDocDetails {
  return {
    markup: doc.textBetween(0, doc.content.size, '\n\n', markupLeaf),
    ...docToText(doc)
  };
}

/** The length of the text, where a chip counts as its trigger and label. */
export function textLength(doc: PMNode): number {
  return doc.textBetween(0, doc.content.size, '\n\n').length;
}

/**
 * Collapses a pasted slice to inline content: block boundaries become hard
 * breaks, mentions keep their ids, and marks are dropped.
 */
export function flattenToInlineSlice(slice: Slice): Slice {
  const nodes: PMNode[] = [];

  const walk = (fragment: Fragment) => {
    fragment.forEach(child => {
      if (child.isInline) {
        nodes.push(child.mark([]));
        return;
      }
      if (nodes.length) nodes.push(hardBreak.create());
      walk(child.content);
    });
  };
  walk(slice.content);

  return new Slice(Fragment.fromArray(nodes), 0, 0);
}
