'use client';

import { useDraggable } from '@dnd-kit/core';
import { cx } from 'class-variance-authority';
import {
  ComponentProps,
  MouseEvent,
  PointerEvent,
  useEffect,
  useRef
} from 'react';
import { CoPilotIcon } from '~/icons/generated';
import styles from './chat-panel.module.css';
import { useChatPanelContext } from './chat-panel-context';

export interface ChatPanelTriggerProps extends ComponentProps<'button'> {
  /**
   * Whether the minimized bubble can be dragged around the viewport. The
   * dropped position is kept across minimize/restore cycles. Shadows the
   * (useless here) native `draggable` attribute.
   * @defaultValue false
   */
  draggable?: boolean;
}

export function ChatPanelTrigger({
  className,
  children,
  onClick,
  onPointerDown,
  style,
  draggable = false,
  'aria-label': ariaLabel = 'Open chat',
  ref,
  ...props
}: ChatPanelTriggerProps) {
  const { mode, restore, bubbleDraggableId, bubbleElementRef } =
    useChatPanelContext('Trigger');

  const dragEnabled = mode === 'minimized' && draggable;
  const { setNodeRef, listeners, transform, isDragging } = useDraggable({
    id: bubbleDraggableId,
    disabled: !dragEnabled
  });

  // A completed drag must not restore the panel. dnd-kit swallows the click
  // right after a drag ends; this ref backs that up (jsdom, slow frames).
  const wasDraggedRef = useRef(false);
  const prevDraggingRef = useRef(false);
  useEffect(() => {
    const wasDragging = prevDraggingRef.current;
    prevDraggingRef.current = isDragging;
    if (wasDragging && !isDragging) {
      wasDraggedRef.current = true;
      const timer = setTimeout(() => {
        wasDraggedRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  if (mode !== 'minimized') return null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    restore();
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented) return;
    listeners?.onPointerDown?.(event);
  };

  return (
    <button
      type='button'
      ref={node => {
        bubbleElementRef.current = node;
        setNodeRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx(styles.trigger, className)}
      data-slot='chat-panel-trigger'
      data-chat-panel-trigger=''
      data-draggable={dragEnabled || undefined}
      data-dragging={isDragging || undefined}
      aria-label={ariaLabel}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      style={{
        // The committed position lands on the panel frame; the live movement
        // is the dnd-kit transform.
        ...(transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : null),
        ...style
      }}
      {...props}
    >
      {children ?? <CoPilotIcon aria-hidden='true' />}
    </button>
  );
}

ChatPanelTrigger.displayName = 'ChatPanel.Trigger';
