'use client';

import {
  MinusIcon,
  PinLeftIcon,
  PinRightIcon,
  SizeIcon
} from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, MouseEvent, PointerEvent } from 'react';
import { IconButton, type IconButtonProps } from '../icon-button/icon-button';
import styles from './chat-panel.module.css';
import { useChatPanelContext } from './chat-panel-context';

export interface ChatPanelHeaderProps extends ComponentProps<'header'> {}

export function ChatPanelHeader({
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: ChatPanelHeaderProps) {
  const { dragHandlers } = useChatPanelContext('Header');

  const compose =
    (
      theirs: ((event: PointerEvent<HTMLElement>) => void) | undefined,
      ours: (event: PointerEvent<HTMLElement>) => void
    ) =>
    (event: PointerEvent<HTMLElement>) => {
      theirs?.(event);
      if (!event.defaultPrevented) ours(event);
    };

  return (
    <header
      className={cx(styles.header, className)}
      onPointerDown={compose(onPointerDown, dragHandlers.onPointerDown)}
      onPointerMove={compose(onPointerMove, dragHandlers.onPointerMove)}
      onPointerUp={compose(onPointerUp, dragHandlers.onPointerUp)}
      onPointerCancel={compose(onPointerCancel, dragHandlers.onPointerCancel)}
      {...props}
    />
  );
}

ChatPanelHeader.displayName = 'ChatPanel.Header';

export interface ChatPanelTitleProps extends ComponentProps<'h2'> {}

export function ChatPanelTitle({ className, ...props }: ChatPanelTitleProps) {
  return <h2 className={cx(styles.title, className)} {...props} />;
}

ChatPanelTitle.displayName = 'ChatPanel.Title';

export interface ChatPanelActionsProps extends ComponentProps<'div'> {}

export function ChatPanelActions({
  className,
  ...props
}: ChatPanelActionsProps) {
  return <div className={cx(styles.actions, className)} {...props} />;
}

ChatPanelActions.displayName = 'ChatPanel.Actions';

export interface ChatPanelContentProps extends ComponentProps<'div'> {}

export function ChatPanelContent({
  className,
  ...props
}: ChatPanelContentProps) {
  return <div className={cx(styles.content, className)} {...props} />;
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
      {...props}
    >
      {children ?? <MinusIcon />}
    </IconButton>
  );
}

ChatPanelMinimizeTrigger.displayName = 'ChatPanel.MinimizeTrigger';

export interface ChatPanelExpandTriggerProps extends IconButtonProps {}

export function ChatPanelExpandTrigger({
  children,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ChatPanelExpandTriggerProps) {
  const { mode, side, toggleFloating } = useChatPanelContext('ExpandTrigger');
  const floating = mode === 'floating';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggleFloating();
  };

  return (
    <IconButton
      size={2}
      aria-label={
        ariaLabel ?? (floating ? 'Dock chat panel' : 'Pop out chat panel')
      }
      onClick={handleClick}
      {...props}
    >
      {children ??
        (floating ? (
          side === 'left' ? (
            <PinLeftIcon />
          ) : (
            <PinRightIcon />
          )
        ) : (
          <SizeIcon />
        ))}
    </IconButton>
  );
}

ChatPanelExpandTrigger.displayName = 'ChatPanel.ExpandTrigger';
