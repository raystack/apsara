'use client';

import { PromptInputFooter, PromptInputHeader } from './prompt-input-parts';
import { PromptInputRoot } from './prompt-input-root';
import { PromptInputSubmit } from './prompt-input-submit';
import { PromptInputTextarea } from './prompt-input-textarea';

export const PromptInput = Object.assign(PromptInputRoot, {
  Textarea: PromptInputTextarea,
  Header: PromptInputHeader,
  Footer: PromptInputFooter,
  Submit: PromptInputSubmit
});
