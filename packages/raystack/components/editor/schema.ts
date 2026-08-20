import { Schema } from 'prosemirror-model';
import type { MentionAttrs } from './mention';

/**
 * A deliberately tiny schema: one paragraph of text, hard breaks, and atomic
 * mentions. Nothing else, so pasted HTML sanitizes to plain text for free —
 * there is no mark or block the parser could keep.
 */
export const editorSchema = new Schema({
  nodes: {
    doc: { content: 'paragraph' },

    paragraph: {
      content: 'inline*',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0]
    },

    text: { group: 'inline' },

    hardBreak: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM: () => ['br']
    },

    mention: {
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
      // Only used for the clipboard's `text/html` flavour — on screen the node
      // view owns the element. Pasting this back restores the chip with its id.
      toDOM: node => {
        const { id, label, type, trigger } = node.attrs as MentionAttrs;
        return [
          'span',
          {
            'data-mention-id': id,
            'data-mention-label': label,
            'data-mention-type': type,
            'data-mention-trigger': trigger
          },
          `${trigger}${label}`
        ];
      }
    }
  }
});

export const mentionType = editorSchema.nodes.mention;
export const hardBreakType = editorSchema.nodes.hardBreak;
export const paragraphType = editorSchema.nodes.paragraph;
