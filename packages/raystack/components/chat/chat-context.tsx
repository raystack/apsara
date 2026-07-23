'use client';

import { createContext, useContext } from 'react';

export interface ChatMessagesState {
  /** Whether the reader is at the live edge (scrolled to the bottom). */
  atBottom: boolean;
  /**
   * Ids of the registered messages currently intersecting the viewport, in
   * document order. Only messages given a `messageId` are tracked.
   */
  visibleMessageIds: string[];
}

export interface ChatMessagesActions {
  /** Scrolls the conversation to the live edge. */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /** Scrolls the message registered with the given `messageId` into view. */
  scrollToMessage: (
    id: string,
    options?: { behavior?: ScrollBehavior }
  ) => void;
}

export interface ChatMessageRegistration {
  id?: string;
  scrollAnchor?: boolean;
}

export interface ChatMessagesRegistry {
  register: (
    element: HTMLElement,
    registration: ChatMessageRegistration
  ) => () => void;
}

export const ChatMessagesStateContext = createContext<ChatMessagesState | null>(
  null
);
export const ChatMessagesActionsContext =
  createContext<ChatMessagesActions | null>(null);
export const ChatMessagesRegistryContext =
  createContext<ChatMessagesRegistry | null>(null);

export function useChatMessagesState(part: string): ChatMessagesState {
  const context = useContext(ChatMessagesStateContext);
  if (!context) {
    throw new Error(`${part} must be used within <Chat.Messages>`);
  }
  return context;
}

export function useChatMessagesActions(part: string): ChatMessagesActions {
  const context = useContext(ChatMessagesActionsContext);
  if (!context) {
    throw new Error(`${part} must be used within <Chat.Messages>`);
  }
  return context;
}

export interface UseChatMessagesReturn
  extends ChatMessagesState,
    ChatMessagesActions {}

/**
 * Scroll state and commands for the enclosing `Chat.Messages`: `atBottom`,
 * `visibleMessageIds`, `scrollToBottom` and `scrollToMessage`.
 */
export function useChatMessages(): UseChatMessagesReturn {
  const state = useChatMessagesState('useChatMessages');
  const actions = useChatMessagesActions('useChatMessages');
  return { ...state, ...actions };
}
