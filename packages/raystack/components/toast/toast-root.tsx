'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './toast.module.css';

export interface ToastRootProps
  extends Omit<ToastPrimitive.Root.Props, 'toast'> {
  toast: ToastPrimitive.Root.Props['toast'];
}

export const ToastRoot = forwardRef<
  ElementRef<typeof ToastPrimitive.Root>,
  ToastRootProps
>(({ toast, className, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      toast={toast}
      className={cx(styles.root, className)}
      {...props}
    >
      <ToastPrimitive.Content className={styles.content}>
        <div className={styles.textContainer}>
          {toast.title && (
            <ToastPrimitive.Title className={styles.title}>
              {toast.title}
            </ToastPrimitive.Title>
          )}
          {toast.description && (
            <ToastPrimitive.Description className={styles.description}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
        </div>
        <div className={styles.actions}>
          {toast.actionProps && (
            <ToastPrimitive.Action className={styles.action}>
              {toast.actionProps.children}
            </ToastPrimitive.Action>
          )}
          <ToastPrimitive.Close
            className={styles.close}
            aria-label='Close toast'
          >
            <Cross1Icon aria-hidden='true' />
          </ToastPrimitive.Close>
        </div>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  );
});

ToastRoot.displayName = 'Toast';
