'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './chat.module.css';

export interface ChatSeparatorProps extends ComponentProps<'div'> {}

export function ChatSeparator({ className, ...props }: ChatSeparatorProps) {
  return (
    <div
      className={cx(styles.separator, className)}
      data-slot='chat-separator'
      {...props}
    />
  );
}

ChatSeparator.displayName = 'Chat.Separator';
