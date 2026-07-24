'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { ComponentProps, useContext, useLayoutEffect, useRef } from 'react';
import styles from './chat.module.css';
import { ChatMessagesRegistryContext } from './chat-context';

export interface ChatItemProps extends ComponentProps<'div'> {
  /**
   * Stable id registered with the enclosing `Chat.Messages`, enabling
   * visibility tracking and `scrollToMessage`.
   */
  messageId?: string;
  /**
   * Marks the item as a scroll anchor: when it mounts inside
   * `Chat.Messages`, the viewport scrolls it near the top so the reply can
   * stream in below — set it on the latest user message.
   * @defaultValue false
   */
  scrollAnchor?: boolean;
}

export function ChatItem({
  className,
  messageId,
  scrollAnchor = false,
  ref,
  ...props
}: ChatItemProps) {
  const registry = useContext(ChatMessagesRegistryContext);
  const localRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(localRef, ref);

  useLayoutEffect(() => {
    const element = localRef.current;
    if (!registry || !element) return;
    return registry.register(element, { id: messageId, scrollAnchor });
  }, [registry, messageId, scrollAnchor]);

  return (
    <div
      ref={mergedRef}
      data-message-id={messageId}
      className={cx(styles.item, className)}
      {...props}
    />
  );
}

ChatItem.displayName = 'Chat.Item';
