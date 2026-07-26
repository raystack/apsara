'use client';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { createContext, useContext } from 'react';

export type ChatPanelMode = 'docked' | 'floating' | 'minimized';
export type ChatPanelSide = 'left' | 'right';

export interface ChatPanelContextValue {
  mode: ChatPanelMode;
  side: ChatPanelSide;
  setMode: (mode: ChatPanelMode) => void;
  minimize: () => void;
  restore: () => void;
  toggleFloating: () => void;
  /** dnd-kit activator ref for the drag handle (the header). */
  dragHandleRef: (element: HTMLElement | null) => void;
  /** dnd-kit activator listeners; undefined while dragging is disabled. */
  dragListeners: DraggableSyntheticListeners;
}

export const ChatPanelContext = createContext<ChatPanelContextValue | null>(
  null
);

export function useChatPanelContext(part: string): ChatPanelContextValue {
  const context = useContext(ChatPanelContext);
  if (!context) {
    throw new Error(`ChatPanel.${part} must be used within <ChatPanel>`);
  }
  return context;
}
