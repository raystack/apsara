'use client';

import { createContext, RefObject, useContext } from 'react';

export type PromptInputStatus = 'idle' | 'submitted' | 'streaming' | 'error';

export interface PromptInputContextValue {
  value: string;
  setValue: (value: string) => void;
  status: PromptInputStatus;
  disabled: boolean;
  onStop?: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  requestSubmit: () => void;
}

export const PromptInputContext = createContext<PromptInputContextValue | null>(
  null
);

export function usePromptInputContext(part: string): PromptInputContextValue {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error(`PromptInput.${part} must be used within <PromptInput>`);
  }
  return context;
}
