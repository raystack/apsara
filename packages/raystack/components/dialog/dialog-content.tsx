'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './dialog.module.css';
import { CloseButton } from './dialog-misc';

export interface DialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean;
  overlay?: DialogPrimitive.Backdrop.Props & { blur?: boolean };
  width?: string | number;
  /**
   * Toggles nested dialog animation (scaling and translation)
   * `@default` true
   */
  showNestedAnimation?: boolean;
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlay,
  width,
  style,
  showNestedAnimation = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        {...overlay}
        className={cx(
          styles.dialogOverlay,
          overlay?.blur && styles.overlayBlur,
          overlay?.className
        )}
      />
      <DialogPrimitive.Viewport className={styles.viewport}>
        <DialogPrimitive.Popup
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
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

DialogContent.displayName = 'Dialog.Content';
