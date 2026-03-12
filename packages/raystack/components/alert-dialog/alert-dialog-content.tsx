'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from '../dialog/dialog.module.css';
import { CloseButton } from './alert-dialog-misc';

export interface AlertDialogContentProps
  extends AlertDialogPrimitive.Popup.Props {
  showCloseButton?: boolean;
  overlay?: AlertDialogPrimitive.Backdrop.Props & { blur?: boolean };
  width?: string | number;
  /**
   * Toggles nested dialog animation (scaling and translation)
   * `@default` true
   */
  showNestedAnimation?: boolean;
}

export const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Popup>,
  AlertDialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      overlay,
      width,
      style,
      showNestedAnimation = true,
      ...props
    },
    ref
  ) => {
    return (
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Backdrop
          {...overlay}
          className={cx(
            styles.dialogOverlay,
            overlay?.blur && styles.overlayBlur,
            overlay?.className
          )}
        />
        <AlertDialogPrimitive.Viewport className={styles.viewport}>
          <AlertDialogPrimitive.Popup
            ref={ref}
            className={cx(
              styles.dialogContent,
              showNestedAnimation && styles.showNestedAnimation,
              className
            )}
            style={{ width, ...style }}
            {...props}
          >
            {children}
            {showCloseButton && <CloseButton className={styles.closeButton} />}
          </AlertDialogPrimitive.Popup>
        </AlertDialogPrimitive.Viewport>
      </AlertDialogPrimitive.Portal>
    );
  }
);

AlertDialogContent.displayName = 'AlertDialog.Content';
