/**
 * The parts of the mention model that are pure strings and offsets — no
 * ProseMirror. Kept in its own module so `PromptInput`'s root, its textarea and
 * the mention registry can share the vocabulary without pulling the editor
 * engine into their module graph.
 */

/** Attributes carried by a mention node. All of them survive serialization. */
export interface MentionAttrs {
  id: string;
  label: string;
  /** Entity kind — `"project"`, `"user"`, … */
  type: string;
  /** The character that opened the menu this mention was picked from. */
  trigger: string;
}

/**
 * A mention as it appears in a value change or a submitted message. Offsets
 * index into the derived plain text.
 */
export interface EditorMention extends MentionAttrs {
  start: number;
  end: number;
}

/** Cache key for the item store that backs a chip's icon, trailing and data. */
export function mentionKey(trigger: string, type: string, id: string): string {
  return `${trigger}|${type}|${id}`;
}

/**
 * A trigger is a single ASCII punctuation character. `[`, `]` and `\` are
 * excluded because the dialect uses them as delimiters, and `_` because it
 * reads as a word character — so a bare markdown link (`[label](a:b)`) and a
 * snake_cased word are never mistaken for a mention.
 */
const TRIGGER_PATTERN = new RegExp(
  '^[\\u0021-\\u002F\\u003A-\\u0040\\u005E\\u0060\\u007B-\\u007E]$'
);

export function isTriggerCharacter(char: string): boolean {
  return char.length === 1 && TRIGGER_PATTERN.test(char);
}

function escapeLabel(value: string): string {
  return value.replace(/[\\\])]/g, match => `\\${match}`);
}

function escapeRef(value: string): string {
  return value.replace(/[\\:)]/g, match => `\\${match}`);
}

/** Serializes one mention — `@[label](type:id)`. */
export function serializeMention(attrs: MentionAttrs): string {
  return `${attrs.trigger}[${escapeLabel(attrs.label)}](${escapeRef(
    attrs.type
  )}:${escapeRef(attrs.id)})`;
}

/**
 * Drops whitespace at the document edges — including the space auto-inserted
 * after a chip — while leaving mentions alone, then re-bases the offsets. A
 * chip is never at an edge in the whitespace sense, so trimming can only ever
 * remove text.
 */
export function trimDetails<
  T extends { markup: string; text: string; mentions: EditorMention[] }
>(details: T): T {
  const leading = details.text.length - details.text.trimStart().length;
  return {
    ...details,
    markup: details.markup.trim(),
    text: details.text.trim(),
    mentions: details.mentions.map(mention => ({
      ...mention,
      start: mention.start - leading,
      end: mention.end - leading
    }))
  };
}
