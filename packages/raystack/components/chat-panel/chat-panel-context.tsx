'use client';

import { createContext, PointerEvent, useContext } from 'react';

export type ChatPanelMode = 'docked' | 'floating' | 'minimized';
export type ChatPanelSide = 'left' | 'right';

export interface ChatPanelDragHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
}

export interface ChatPanelContextValue {
  mode: ChatPanelMode;
  side: ChatPanelSide;
  setMode: (mode: ChatPanelMode) => void;
  minimize: () => void;
  restore: () => void;
  toggleFloating: () => void;
  dragHandlers: ChatPanelDragHandlers;
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
