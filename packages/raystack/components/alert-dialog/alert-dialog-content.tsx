'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from '../dialog/dialog.module.css';

export interface AlertDialogContentProps
  extends AlertDialogPrimitive.Popup.Props {
  overlay?: AlertDialogPrimitive.Backdrop.Props & { blur?: boolean };
  width?: string | number;
  /**
   * Toggles nested dialog animation (scaling and translation)
   * `@default` true
   */
  showNestedAnimation?: boolean;
}

export const AlertDialogContent = ({
  className,
  children,
  overlay,
  width,
  style,
  showNestedAnimation = true,
  ...props
}: AlertDialogContentProps) => {
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
          className={cx(
            styles.dialogContent,
            showNestedAnimation && styles.showNestedAnimation,
            className
          )}
          style={{ width, ...style }}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
};

AlertDialogContent.displayName = 'AlertDialog.Content';
