'use client';

import { createContext, type RefObject, useContext } from 'react';
import type { EditorMention } from '../editor/mention';
import type {
  PromptInputMentionItem,
  PromptInputMentionRegistry
} from './prompt-input-mention-registry';

export type PromptInputStatus = 'idle' | 'submitted' | 'streaming' | 'error';

/** A mention as reported on change and on submit. Offsets index into `text`. */
export interface PromptInputMention extends EditorMention {
  /** Whatever the item carried when it was picked or resolved. */
  data?: unknown;
}

export interface PromptInputMessage {
  /** Plain text with each label inlined behind its trigger. */
  text: string;
  /** Round-trippable markup — feeds straight back into `value`. */
  markup: string;
  /** Document order; duplicates preserved. */
  mentions: PromptInputMention[];
}

/** What the mounted input part derives from its own state. */
export interface PromptInputValueDetails {
  text: string;
  mentions: PromptInputMention[];
}

/**
 * The channel the mounted input part reports through. `Textarea` and `Editor`
 * both implement it, so Root never has to know which substrate is underneath.
 */
export interface PromptInputInputApi {
  focus: () => void;
  /** Push a value that came from outside the part (controlled prop, reset). */
  setMarkup: (markup: string) => void;
  /** Text and mentions for a markup string the part has not seen yet. */
  deriveExternal: (markup: string) => PromptInputValueDetails;
  /** The live value, read off the part rather than off React state. */
  getMessage: () => PromptInputMessage;
  insertMention?: (
    item: PromptInputMentionItem,
    options?: { trigger?: string }
  ) => void;
}

export type PromptInputPartKind = 'textarea' | 'editor';

export interface PromptInputContextValue {
  /** Markup — opaque to Root, interpreted only by `Editor`. */
  value: string;
  details: PromptInputValueDetails;
  /** No mentions, and text that trims to `""`. */
  empty: boolean;
  /** Called by the mounted part on every change it makes. */
  setValue: (markup: string, details: PromptInputValueDetails) => void;
  status: PromptInputStatus;
  disabled: boolean;
  onStop?: () => void;
  inputRef: RefObject<HTMLElement | null>;
  /** The `<form>`, so the suggestion menu can size itself to the composer. */
  frameRef: RefObject<HTMLFormElement | null>;
  registerInput: (
    node: HTMLElement | null,
    api?: PromptInputInputApi,
    kind?: PromptInputPartKind
  ) => void;
  requestSubmit: () => void;
  mentions: PromptInputMentionRegistry;
  /** Whether an `Editor` part is mounted — `Mentions` requires one. */
  editorMounted: boolean;
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

/**
 * The one emptiness predicate, read by submit gating, `data-empty` and the
 * placeholder so they cannot disagree: a message of nothing but a chip is not
 * empty, and the space auto-inserted after a chip does not make it non-empty.
 */
export function isEmptyValue(details: PromptInputValueDetails): boolean {
  return details.mentions.length === 0 && details.text.trim() === '';
}
