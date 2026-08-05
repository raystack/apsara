'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './chat.module.css';
import { ChatAttachment } from './chat-attachment';
import { ChatComposer } from './chat-composer';
import { ChatItem } from './chat-item';
import { ChatJumpButton, ChatMessages } from './chat-messages';
import { ChatSeparator } from './chat-separator';

export interface ChatRootProps extends ComponentProps<'div'> {}

function ChatRoot({ className, ...props }: ChatRootProps) {
  return (
    <div className={cx(styles.chat, className)} data-slot='chat' {...props} />
  );
}

ChatRoot.displayName = 'Chat';

export const Chat = Object.assign(ChatRoot, {
  Messages: ChatMessages,
  Item: ChatItem,
  JumpButton: ChatJumpButton,
  Composer: ChatComposer,
  Separator: ChatSeparator,
  Attachment: ChatAttachment
});
