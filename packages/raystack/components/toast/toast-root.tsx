'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import { Button } from '../button';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import styles from './toast.module.css';
import type { ToastPosition } from './toast-provider';

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

function getSwipeDirection(position: ToastPosition): SwipeDirection[] {
  const verticalDirection: SwipeDirection = position.startsWith('top')
    ? 'up'
    : 'down';

  if (position.includes('center')) {
    return [verticalDirection];
  }

  if (position.includes('left')) {
    return ['left', verticalDirection];
  }

  return ['right', verticalDirection];
}

export interface ToastRootProps
  extends Omit<ToastPrimitive.Root.Props, 'toast'> {
  toast: ToastPrimitive.Root.Props['toast'];
  position?: ToastPosition;
}

export const ToastRoot = forwardRef<
  ElementRef<typeof ToastPrimitive.Root>,
  ToastRootProps
>(({ toast, className, position = 'bottom-right', ...props }, ref) => {
  const swipeDirection = getSwipeDirection(position);
  const hasDescription = !!toast.description;

  return (
    <ToastPrimitive.Root
      ref={ref}
      toast={toast}
      className={cx(styles.root, className)}
      swipeDirection={swipeDirection}
      data-position={position}
      {...props}
    >
      <ToastPrimitive.Content className={styles.content}>
        <Flex direction='column' gap={1} className={styles.textContainer}>
          {toast.title && (
            <ToastPrimitive.Title
              className={hasDescription ? styles.title : styles.description}
            >
              {toast.title}
            </ToastPrimitive.Title>
          )}
          {hasDescription && (
            <ToastPrimitive.Description className={styles.description}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
        </Flex>
        <Flex align='center' gap={3}>
          {toast.actionProps && (
            <ToastPrimitive.Action
              {...toast.actionProps}
              render={<Button variant='text' color='neutral' size='small' />}
            />
          )}
          <ToastPrimitive.Close
            aria-label='Close toast'
            render={<IconButton size={2} />}
          >
            <Cross1Icon />
          </ToastPrimitive.Close>
        </Flex>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  );
});

ToastRoot.displayName = 'Toast';
