'use client';

import {
  ChatPanelActions,
  ChatPanelContent,
  ChatPanelExpandTrigger,
  ChatPanelHeader,
  ChatPanelMinimizeTrigger,
  ChatPanelTitle
} from './chat-panel-parts';
import { ChatPanelRoot } from './chat-panel-root';
import { ChatPanelTrigger } from './chat-panel-trigger';

export const ChatPanel = Object.assign(ChatPanelRoot, {
  Header: ChatPanelHeader,
  Title: ChatPanelTitle,
  Actions: ChatPanelActions,
  Content: ChatPanelContent,
  MinimizeTrigger: ChatPanelMinimizeTrigger,
  ExpandTrigger: ChatPanelExpandTrigger,
  Trigger: ChatPanelTrigger
});
