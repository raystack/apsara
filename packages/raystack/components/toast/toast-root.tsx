'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import {
  CheckCircledIcon,
  Cross1Icon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon
} from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { Button } from '../button';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import { Spinner } from '../spinner';
import styles from './toast.module.css';
import type { ToastData } from './toast-manager';
import type { ToastPosition } from './toast-provider';

const TOAST_ICONS: Record<string, ReactNode> = {
  default: <InfoCircledIcon />,
  success: <CheckCircledIcon />,
  error: <CrossCircledIcon />,
  warning: <ExclamationTriangleIcon />,
  info: <InfoCircledIcon />,
  loading: <Spinner size={2} color='default' />
};

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
  const explicitLeadingIcon = (toast.data as ToastData | undefined)
    ?.leadingIcon;
  const leadingIcon =
    explicitLeadingIcon ??
    (toast.type ? TOAST_ICONS[toast.type] : null) ??
    TOAST_ICONS.default;

  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cx(styles.root, className)}
      swipeDirection={swipeDirection}
      data-position={position}
      {...props}
    >
      <ToastPrimitive.Content className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {leadingIcon && (
              <span className={styles.leadingIcon} aria-hidden='true'>
                {leadingIcon}
              </span>
            )}
            {toast.title && (
              <ToastPrimitive.Title className={styles.title}>
                {toast.title}
              </ToastPrimitive.Title>
            )}
          </div>
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
        </div>
        {hasDescription && (
          <div className={styles.descriptionRow}>
            <ToastPrimitive.Description className={styles.description}>
              {toast.description}
            </ToastPrimitive.Description>
          </div>
        )}
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  );
}

ToastRoot.displayName = 'Toast';
