import { Schema } from 'prosemirror-model';
import {
  hardBreakNodeSpec,
  mentionNodeSpec,
  paragraphNodeSpec
} from '../schema';

/**
 * The PromptInput composer: one paragraph of text, hard breaks, and atomic
 * mentions. Nothing else, so pasted HTML sanitizes to plain text for free,
 * there is no mark or block the parser could keep.
 */
export const composerSchema = new Schema({
  nodes: {
    doc: { content: 'paragraph' },
    paragraph: paragraphNodeSpec,
    text: { group: 'inline' },
    hardBreak: hardBreakNodeSpec,
    mention: mentionNodeSpec
  }
});

export const mentionType = composerSchema.nodes.mention;
export const hardBreakType = composerSchema.nodes.hardBreak;
export const paragraphType = composerSchema.nodes.paragraph;
