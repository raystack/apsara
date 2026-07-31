'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './chat.module.css';

export interface ChatComposerProps extends ComponentProps<'div'> {}

/** The container under the messages, usually holding a `PromptInput`. */
export function ChatComposer({ className, ...props }: ChatComposerProps) {
  return (
    <div
      className={cx(styles.composer, className)}
      data-slot='chat-composer'
      {...props}
    />
  );
}

ChatComposer.displayName = 'Chat.Composer';
