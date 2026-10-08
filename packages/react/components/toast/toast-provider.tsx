'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useThemeInjection } from '../theme/portal';
import styles from './toast.module.css';
import {
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
  const theme = useThemeInjection();
  return (
    <ToastPrimitive.Provider
      // The Provider only reads the subscribe channel, which our manager keeps from
      // Base UI's. The cast is needed because Base UI's `update` is generic over toast data.
      toastManager={
        toastManager as unknown as ToastPrimitive.Provider.Props['toastManager']
      }
      {...props}
    >
      {children}
      <ToastPrimitive.Portal {...theme}>
        <ToastPrimitive.Viewport
          {...theme}
          className={cx(
            styles.viewport,
            styles[`viewport-${position}`],
            theme?.className
          )}
          data-slot='toast-viewport'
        >
          <ToastList position={position} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

ToastProvider.displayName = 'Toast.Provider';
