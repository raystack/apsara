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
  // Promote description into the title slot when title is missing so the icon
  // and headline sit on the same row. The second row only renders when both
  // are present.
  const title = toast.title ?? toast.description;
  const hasBoth = !!toast.title && !!toast.description;
  // `leadingIcon: undefined` (omitted) → fall back to the type default.
  // `leadingIcon: null` → explicit opt-out, render nothing.
  // anything else → use what the user provided.
  const userIcon = (toast.data as ToastData | undefined)?.leadingIcon;
  const leadingIcon =
    userIcon !== undefined
      ? userIcon
      : ((toast.type ? TOAST_ICONS[toast.type] : null) ?? TOAST_ICONS.default);

  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cx(styles.root, className)}
      swipeDirection={swipeDirection}
      data-position={position}
      {...props}
    >
      <ToastPrimitive.Content className={styles.content}>
        <Flex align='start' gap={3} style={{ width: '100%' }}>
          {leadingIcon && (
            <span className={styles.leadingIcon} aria-hidden='true'>
              {leadingIcon}
            </span>
          )}
          <Flex direction='column' gap={3} className={styles.contentColumn}>
            <Flex
              align='center'
              justify='between'
              gap={5}
              className={styles.topRow}
            >
              {title && (
                <ToastPrimitive.Title
                  className={hasBoth ? styles.title : styles.description}
                >
                  {title}
                </ToastPrimitive.Title>
              )}
              <Flex align='center' gap={3} className={styles.actions}>
                {toast.actionProps && (
                  <ToastPrimitive.Action
                    {...toast.actionProps}
                    render={
                      <Button variant='text' color='neutral' size='small' />
                    }
                  />
                )}
                <ToastPrimitive.Close
                  aria-label='Close toast'
                  render={<IconButton size={2} />}
                >
                  <Cross1Icon />
                </ToastPrimitive.Close>
              </Flex>
            </Flex>
            {hasBoth && (
              <ToastPrimitive.Description className={styles.description}>
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </Flex>
        </Flex>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  );
}

ToastRoot.displayName = 'Toast';
