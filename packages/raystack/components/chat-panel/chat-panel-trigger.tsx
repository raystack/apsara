'use client';

import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, MouseEvent } from 'react';
import styles from './chat-panel.module.css';
import { useChatPanelContext } from './chat-panel-context';

export interface ChatPanelTriggerProps extends ComponentProps<'button'> {}

export function ChatPanelTrigger({
  className,
  children,
  onClick,
  'aria-label': ariaLabel = 'Open chat',
  ...props
}: ChatPanelTriggerProps) {
  const { mode, restore } = useChatPanelContext('Trigger');

  if (mode !== 'minimized') return null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    restore();
  };

  return (
    <button
      type='button'
      className={cx(styles.trigger, className)}
      aria-label={ariaLabel}
      onClick={handleClick}
      {...props}
    >
      {children ?? <ChatBubbleIcon aria-hidden='true' />}
    </button>
  );
}

ChatPanelTrigger.displayName = 'ChatPanel.Trigger';
