'use client';

import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import { ComponentProps, MouseEvent, PointerEvent, ReactNode } from 'react';
import { ExpandIcon, ShrinkIcon } from '~/icons';
import { IconButton, type IconButtonProps } from '../icon-button/icon-button';
import styles from './chat-panel.module.css';
import { useChatPanelContext } from './chat-panel-context';

export interface ChatPanelHeaderProps extends ComponentProps<'header'> {}

export function ChatPanelHeader({
  className,
  onPointerDown,
  ref,
  ...props
}: ChatPanelHeaderProps) {
  const { dragHandleRef, dragListeners } = useChatPanelContext('Header');
  const mergedRef = useMergedRefs(dragHandleRef, ref);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented) return;
    dragListeners?.onPointerDown?.(event);
  };

  return (
    <header
      ref={mergedRef}
      className={cx(styles.header, className)}
      onPointerDown={handlePointerDown}
      data-slot='chat-panel-header'
      {...props}
    />
  );
}

ChatPanelHeader.displayName = 'ChatPanel.Header';

export interface ChatPanelTitleProps extends ComponentProps<'h2'> {}

export function ChatPanelTitle({ className, ...props }: ChatPanelTitleProps) {
  return (
    <h2
      className={cx(styles.title, className)}
      data-slot='chat-panel-title'
      {...props}
    />
  );
}

ChatPanelTitle.displayName = 'ChatPanel.Title';

export interface ChatPanelActionsProps extends ComponentProps<'div'> {}

export function ChatPanelActions({
  className,
  ...props
}: ChatPanelActionsProps) {
  return (
    <div
      className={cx(styles.actions, className)}
      data-slot='chat-panel-actions'
      {...props}
    />
  );
}

ChatPanelActions.displayName = 'ChatPanel.Actions';

export interface ChatPanelContentProps extends ComponentProps<'div'> {}

export function ChatPanelContent({
  className,
  ...props
}: ChatPanelContentProps) {
  return (
    <div
      className={cx(styles.content, className)}
      data-slot='chat-panel-content'
      {...props}
    />
  );
}

ChatPanelContent.displayName = 'ChatPanel.Content';

export interface ChatPanelMinimizeTriggerProps extends IconButtonProps {}

export function ChatPanelMinimizeTrigger({
  children,
  onClick,
  'aria-label': ariaLabel = 'Minimize chat panel',
  ...props
}: ChatPanelMinimizeTriggerProps) {
  const { minimize } = useChatPanelContext('MinimizeTrigger');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    minimize();
  };

  return (
    <IconButton
      size={2}
      aria-label={ariaLabel}
      onClick={handleClick}
      data-slot='chat-panel-minimize-trigger'
      {...props}
    >
      {children ?? <ShrinkIcon />}
    </IconButton>
  );
}

ChatPanelMinimizeTrigger.displayName = 'ChatPanel.MinimizeTrigger';

export interface ChatPanelExpandTriggerState {
  /** Whether the panel is currently floating (true) or docked (false). */
  floating: boolean;
}

export interface ChatPanelExpandTriggerProps
  extends Omit<IconButtonProps, 'children'> {
  /**
   * The icon. Defaults to a size icon in both states; pass a render
   * function to swap icons based on the current state.
   */
  children?: ReactNode | ((state: ChatPanelExpandTriggerState) => ReactNode);
}

export function ChatPanelExpandTrigger({
  children,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ChatPanelExpandTriggerProps) {
  const { mode, toggleFloating } = useChatPanelContext('ExpandTrigger');
  const floating = mode === 'floating';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggleFloating();
  };

  const resolvedChildren =
    typeof children === 'function' ? children({ floating }) : children;

  return (
    <IconButton
      size={2}
      aria-label={
        ariaLabel ?? (floating ? 'Dock chat panel' : 'Pop out chat panel')
      }
      onClick={handleClick}
      data-slot='chat-panel-expand-trigger'
      {...props}
    >
      {resolvedChildren ?? <ExpandIcon />}
    </IconButton>
  );
}

ChatPanelExpandTrigger.displayName = 'ChatPanel.ExpandTrigger';
