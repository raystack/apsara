'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { Button } from '../button';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import styles from './toast.module.css';
import type { ToastData } from './toast-manager';
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

export interface ToastRootProps extends ToastPrimitive.Root.Props {
  position?: ToastPosition;
}

export function ToastRoot({
  toast,
  className,
  position = 'bottom-right',
  ...props
}: ToastRootProps) {
  const swipeDirection = getSwipeDirection(position);
  const hasDescription = !!toast.description;
  const leadingIcon = (toast.data as ToastData | undefined)?.leadingIcon;

  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cx(styles.root, className)}
      swipeDirection={swipeDirection}
      data-position={position}
      {...props}
    >
      <ToastPrimitive.Content
        className={styles.content}
        data-has-description={hasDescription ? '' : undefined}
      >
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden='true'>
            {leadingIcon}
          </span>
        )}
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
        <Flex align='center' gap={3} className={styles.actions}>
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
}

ToastRoot.displayName = 'Toast';
