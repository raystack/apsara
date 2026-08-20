'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './message.module.css';
import { MessageBubble } from './message-bubble';

export type MessageAlign = 'start' | 'end';

export interface MessageProps extends ComponentProps<'div'> {
  /**
   * Which side of the conversation the message sits on. `"end"` aligns the
   * message to the trailing edge (the sender's own messages); `"start"` (the
   * default) to the leading edge.
   * @defaultValue "start"
   */
  align?: MessageAlign;
}

function MessageRoot({ className, align = 'start', ...props }: MessageProps) {
  return (
    <div
      data-align={align}
      className={cx(styles.message, className)}
      data-slot='message'
      {...props}
    />
  );
}

MessageRoot.displayName = 'Message';

export interface MessageGroupProps extends ComponentProps<'div'> {}

export function MessageGroup({ className, ...props }: MessageGroupProps) {
  return (
    <div
      className={cx(styles.group, className)}
      data-slot='message-group'
      {...props}
    />
  );
}

MessageGroup.displayName = 'Message.Group';

export interface MessageAvatarProps extends ComponentProps<'div'> {}

export function MessageAvatar({ className, ...props }: MessageAvatarProps) {
  return (
    <div
      className={cx(styles['message-avatar'], className)}
      data-slot='message-avatar'
      {...props}
    />
  );
}

MessageAvatar.displayName = 'Message.Avatar';

export interface MessageHeaderProps extends ComponentProps<'div'> {}

export function MessageHeader({ className, ...props }: MessageHeaderProps) {
  return (
    <div
      className={cx(styles['message-header'], className)}
      data-slot='message-header'
      {...props}
    />
  );
}

MessageHeader.displayName = 'Message.Header';

export interface MessageContentProps extends ComponentProps<'div'> {}

export function MessageContent({ className, ...props }: MessageContentProps) {
  return (
    <div
      className={cx(styles['message-content'], className)}
      data-slot='message-content'
      {...props}
    />
  );
}

MessageContent.displayName = 'Message.Content';

export interface MessageFooterProps extends ComponentProps<'div'> {}

export function MessageFooter({ className, ...props }: MessageFooterProps) {
  return (
    <div
      className={cx(styles['message-footer'], className)}
      data-slot='message-footer'
      {...props}
    />
  );
}

MessageFooter.displayName = 'Message.Footer';

export interface MessageActionsProps extends ComponentProps<'div'> {}

export function MessageActions({ className, ...props }: MessageActionsProps) {
  return (
    <div
      className={cx(styles['message-actions'], className)}
      data-slot='message-actions'
      {...props}
    />
  );
}

MessageActions.displayName = 'Message.Actions';

export const Message = Object.assign(MessageRoot, {
  Group: MessageGroup,
  Avatar: MessageAvatar,
  Header: MessageHeader,
  Content: MessageContent,
  Footer: MessageFooter,
  Actions: MessageActions,
  Bubble: MessageBubble
});
