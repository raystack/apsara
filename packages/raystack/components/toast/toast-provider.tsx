'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './toast.module.css';
import {
  _baseManagerRef,
  toastManager as defaultToastManager,
  type ToastManager
} from './toast-manager';
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
  /**
   * Toast manager instance. Defaults to the singleton exported as
   * `toastManager`. Provide a custom one created via
   * `Toast.createToastManager()` to scope toasts to this provider.
   */
  toastManager?: ToastManager;
}

function ToastList({ position }: { position: ToastPosition }) {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map(toast => (
    <ToastRoot key={toast.id} toast={toast} position={position} />
  ));
}

export function ToastProvider({
  position = 'bottom-right',
  toastManager = defaultToastManager,
  children,
  ...props
}: ToastProviderProps) {
  const baseManager = _baseManagerRef.get(toastManager);
  if (!baseManager) {
    throw new Error(
      'ToastProvider: invalid toastManager. Use `Toast.createToastManager()` from @raystack/apsara to create one.'
    );
  }
  return (
    <ToastPrimitive.Provider toastManager={baseManager} {...props}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          className={cx(styles.viewport, styles[`viewport-${position}`])}
        >
          <ToastList position={position} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

ToastProvider.displayName = 'Toast.Provider';
