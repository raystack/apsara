'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useThemeInjection } from '../theme/portal';
import styles from './toast.module.css';
import {
  toastManager as defaultToastManager,
  getAnchoredManager,
  linkAnchoredManager,
  type ToastManager
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

function StackedToasts({
  position,
  anchoredManager
}: {
  position: ToastPosition;
  anchoredManager: ReturnType<typeof getAnchoredManager>;
}) {
  const theme = useThemeInjection();
  const { toasts, add } = ToastPrimitive.useToastManager();
  // Runs before `children` render, so their `useToastManager` finds the link.
  linkAnchoredManager(add, anchoredManager);
  return (
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
        {toasts.map(toast => (
          <ToastRoot key={toast.id} toast={toast} position={position} />
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

function AnchoredToasts() {
  const theme = useThemeInjection();
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <ToastPrimitive.Portal {...theme}>
      <ToastPrimitive.Viewport
        {...theme}
        aria-label='Anchored notifications'
        className={cx(styles.anchoredViewport, theme?.className)}
        data-slot='toast-anchored-viewport'
      >
        {toasts.map(toast => (
          <AnchoredToastRoot key={toast.id} toast={toast} />
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

export function ToastProvider({
  position = 'bottom-right',
  toastManager = defaultToastManager,
  children,
  ...props
}: ToastProviderProps) {
  const anchoredManager = getAnchoredManager(toastManager);
  return (
    <>
      {/* Comes first so it subscribes before effects in `children` run. */}
      {anchoredManager && (
        <ToastPrimitive.Provider toastManager={anchoredManager} {...props}>
          <AnchoredToasts />
        </ToastPrimitive.Provider>
      )}
      <ToastPrimitive.Provider
        // The Provider only reads the subscribe channel, which our manager keeps from
        // Base UI's. The cast is needed because Base UI's `update` is generic over toast data.
        toastManager={
          toastManager as unknown as ToastPrimitive.Provider.Props['toastManager']
        }
        {...props}
      >
        <StackedToasts position={position} anchoredManager={anchoredManager} />
        {children}
      </ToastPrimitive.Provider>
    </>
  );
}

ToastProvider.displayName = 'Toast.Provider';
