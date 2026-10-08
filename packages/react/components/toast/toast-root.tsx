'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon, XIcon } from '~/icons';
import { ArrowSvg, arrowClassName } from '../../shared/arrow';
import { Button } from '../button';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import { Spinner } from '../spinner';
import styles from './toast.module.css';
import type { ToastData } from './toast-manager';
import type { ToastPosition } from './toast-provider';

const TOAST_ICONS: Record<string, ReactNode> = {
  default: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
  loading: <Spinner size={2} color='default' />
};

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

type ToastObject = ToastPrimitive.Root.Props['toast'];

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

function ToastContent({
  toast,
  className
}: {
  toast: ToastObject;
  className?: string;
}) {
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
    <ToastPrimitive.Content className={className} data-slot='toast-content'>
      <Flex
        align='start'
        gap={3}
        style={{ width: '100%' }}
        data-slot='toast-body'
      >
        {leadingIcon && (
          <span
            className={styles.leadingIcon}
            aria-hidden='true'
            data-slot='toast-leading-icon'
          >
            {leadingIcon}
          </span>
        )}
        <Flex
          direction='column'
          gap={3}
          className={styles.main}
          data-slot='toast-main'
        >
          <Flex
            align='center'
            justify='between'
            gap={5}
            className={styles.header}
            data-slot='toast-header'
          >
            {title && (
              <ToastPrimitive.Title
                className={hasBoth ? styles.title : styles.description}
                data-slot='toast-title'
              >
                {title}
              </ToastPrimitive.Title>
            )}
            <Flex
              align='center'
              gap={3}
              className={styles.actions}
              data-slot='toast-actions'
            >
              {toast.actionProps && (
                <ToastPrimitive.Action
                  data-slot='toast-action'
                  {...toast.actionProps}
                  render={
                    <Button variant='text' color='neutral' size='small' />
                  }
                />
              )}
              <ToastPrimitive.Close
                aria-label='Close toast'
                render={<IconButton size={2} />}
                data-slot='toast-close'
              >
                <XIcon />
              </ToastPrimitive.Close>
            </Flex>
          </Flex>
          {hasBoth && (
            <ToastPrimitive.Description
              className={styles.description}
              data-slot='toast-description'
            >
              {toast.description}
            </ToastPrimitive.Description>
          )}
        </Flex>
      </Flex>
    </ToastPrimitive.Content>
  );
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
  return (
    <ToastPrimitive.Root
      toast={toast}
      className={cx(styles.root, className)}
      swipeDirection={getSwipeDirection(position)}
      data-position={position}
      data-slot='toast'
      {...props}
    >
      <ToastContent toast={toast} className={styles.content} />
    </ToastPrimitive.Root>
  );
}

ToastRoot.displayName = 'Toast';

export function AnchoredToastRoot({ toast }: { toast: ToastObject }) {
  return (
    <ToastPrimitive.Positioner
      toast={toast}
      sideOffset={toast.positionerProps?.sideOffset ?? 10}
      className={styles.positioner}
      data-slot='toast-positioner'
    >
      <ToastPrimitive.Root
        toast={toast}
        className={styles.anchored}
        data-slot='toast'
      >
        <ToastPrimitive.Arrow
          className={arrowClassName}
          data-slot='toast-arrow'
        >
          <ArrowSvg />
        </ToastPrimitive.Arrow>
        <ToastContent toast={toast} />
      </ToastPrimitive.Root>
    </ToastPrimitive.Positioner>
  );
}
