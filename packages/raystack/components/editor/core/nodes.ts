import type { NodeSpec } from 'prosemirror-model';
import { type MentionAttrs, mentionText } from './mention';

/**
 * The node specs that the Editor schema and the PromptInput composer schema
 * share. This module has no top-level calls, so a PromptInput-only app does
 * not keep the rest of the Editor schema.
 */

export const mentionNodeSpec: NodeSpec = {
  inline: true,
  group: 'inline',
  // Atomic: the cursor never enters it, so it deletes and moves as one unit.
  atom: true,
  selectable: true,
  // ProseMirror makes inline atoms draggable by default, which would let a
  // chip be dropped into the middle of a word.
  draggable: false,
  attrs: {
    id: {},
    label: {},
    type: { default: 'mention' },
    trigger: { default: '@' }
  },
  leafText: node => mentionText(node.attrs as MentionAttrs),
  parseDOM: [
    {
      tag: 'span[data-mention-id]',
      getAttrs: dom => {
        const el = dom as HTMLElement;
        return {
          id: el.getAttribute('data-mention-id') ?? '',
          label: el.getAttribute('data-mention-label') ?? el.textContent,
          type: el.getAttribute('data-mention-type') ?? 'mention',
          trigger: el.getAttribute('data-mention-trigger') ?? '@'
        };
      }
    }
  ],
  // Used for the clipboard's `text/html` flavour and for `editorToHTML`. On
  // screen the node view owns the element. Pasting this back restores the chip
  // with its id.
  toDOM: node => {
    const attrs = node.attrs as MentionAttrs;
    return [
      'span',
      {
        'data-mention-id': attrs.id,
        'data-mention-label': attrs.label,
        'data-mention-type': attrs.type,
        'data-mention-trigger': attrs.trigger
      },
      mentionText(attrs)
    ];
  }
};

export const paragraphNodeSpec: NodeSpec = {
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM: () => ['p', 0]
};

export const hardBreakNodeSpec: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  // A code block holds `\n` where a paragraph holds a hard break, so turning
  // one into the other keeps the lines.
  linebreakReplacement: true,
  leafText: () => '\n',
  parseDOM: [{ tag: 'br' }],
  toDOM: () => ['br']
};
