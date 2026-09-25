'use client';

import { PromptInputEditor } from './prompt-input-editor';
import { PromptInputMentions } from './prompt-input-mentions';
import { PromptInputFooter, PromptInputHeader } from './prompt-input-parts';
import { PromptInputRoot } from './prompt-input-root';
import { PromptInputSubmit } from './prompt-input-submit';
import { PromptInputTextarea } from './prompt-input-textarea';

export const PromptInput = Object.assign(PromptInputRoot, {
  Textarea: PromptInputTextarea,
  Editor: PromptInputEditor,
  Mentions: PromptInputMentions,
  Header: PromptInputHeader,
  Footer: PromptInputFooter,
  Submit: PromptInputSubmit
});
