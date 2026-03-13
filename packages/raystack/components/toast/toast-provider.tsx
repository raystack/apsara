'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './toast.module.css';
import { toastManager } from './toast-manager';
import { ToastRoot } from './toast-root';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastProviderProps
  extends Omit<ToastPrimitive.Provider.Props, 'toastManager'> {
  /**
   * Position of the toast viewport on screen.
   * @default "bottom-right"
   */
  position?: ToastPosition;
}

function ToastList({ position }: { position: ToastPosition }) {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map(toast => (
    <ToastRoot key={toast.id} toast={toast} position={position} />
  ));
}

export const ToastProvider = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ToastProviderProps
>(({ position = 'bottom-right', children, ...props }, ref) => {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} {...props}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          ref={ref}
          className={cx(styles.viewport, styles[`viewport-${position}`])}
        >
          <ToastList position={position} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
});

ToastProvider.displayName = 'Toast.Provider';
