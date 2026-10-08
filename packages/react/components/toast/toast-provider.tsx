'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useThemeInjection } from '../theme/portal';
import styles from './toast.module.css';
import {
  toastManager as defaultToastManager,
  getAnchoredManager,
  type ToastManager,
  ToastManagerContext
} from './toast-manager';
import { AnchoredToastRoot, ToastRoot } from './toast-root';

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

function AnchoredToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map(toast => (
    <AnchoredToastRoot key={toast.id} toast={toast} />
  ));
}

export function ToastProvider({
  position = 'bottom-right',
  toastManager = defaultToastManager,
  children,
  ...props
}: ToastProviderProps) {
  const theme = useThemeInjection();
  const anchoredManager = getAnchoredManager(toastManager);
  return (
    <ToastManagerContext.Provider value={toastManager}>
      <ToastPrimitive.Provider toastManager={toastManager} {...props}>
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
      {anchoredManager && (
        <ToastPrimitive.Provider toastManager={anchoredManager} {...props}>
          <ToastPrimitive.Portal {...theme}>
            <ToastPrimitive.Viewport
              {...theme}
              className={cx(styles.anchoredViewport, theme?.className)}
              data-slot='toast-anchored-viewport'
            >
              <AnchoredToastList />
            </ToastPrimitive.Viewport>
          </ToastPrimitive.Portal>
        </ToastPrimitive.Provider>
      )}
    </ToastManagerContext.Provider>
  );
}

ToastProvider.displayName = 'Toast.Provider';
