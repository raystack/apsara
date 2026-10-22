'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type Radius, radiusStyle } from '../../shared/radius';
import { useThemeInjection } from '../theme/portal';
import styles from './dialog.module.css';
import { CloseButton } from './dialog-misc';

export interface DialogContentProps extends DialogPrimitive.Popup.Props {
  /**
   * Hides the close button.
   * @default false
   */
  hideCloseButton?: boolean;
  overlay?: DialogPrimitive.Backdrop.Props & { blur?: boolean };
  /**
   * Turns off the scale and offset of a dialog that has a nested dialog open.
   * @default false
   */
  disableNestedAnimation?: boolean;
  /** Corner radius for this dialog only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function DialogContent({
  className,
  children,
  hideCloseButton = false,
  overlay,
  disableNestedAnimation = false,
  radius,
  ...props
}: DialogContentProps) {
  const theme = useThemeInjection();
  return (
    <DialogPrimitive.Portal {...theme}>
      <DialogPrimitive.Backdrop
        data-slot='dialog-backdrop'
        {...overlay}
        className={cx(
          styles.dialogOverlay,
          overlay?.blur && styles.overlayBlur,
          overlay?.className
        )}
      />
      <DialogPrimitive.Viewport
        className={styles.viewport}
        data-slot='dialog-viewport'
      >
        <DialogPrimitive.Popup
          {...theme}
          className={cx(
            styles.dialogContent,
            !disableNestedAnimation && styles.nestedAnimation,
            theme?.className,
            radiusStyle({ radius }),
            className
          )}
          data-slot='dialog-content'
          {...props}
        >
          {children}
          {!hideCloseButton && <CloseButton className={styles.closeButton} />}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

DialogContent.displayName = 'Dialog.Content';
