'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
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
  /** Portals the viewport into this element instead of `document.body`. */
  container?: PortalContainer;
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
  container,
  children,
  ...props
}: ToastProviderProps) {
  const theme = useThemeInjection();
  return (
    <ToastPrimitive.Provider toastManager={toastManager} {...props}>
      {children}
      <ToastPrimitive.Portal container={container}>
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
