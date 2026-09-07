'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from '../dialog/dialog.module.css';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';

export interface AlertDialogContentProps
  extends AlertDialogPrimitive.Popup.Props {
  overlay?: AlertDialogPrimitive.Backdrop.Props & { blur?: boolean };
  /**
   * Toggles nested dialog animation (scaling and translation)
   * `@default` true
   */
  showNestedAnimation?: boolean;
  /** Portals into this element instead of `document.body`. */
  container?: PortalContainer;
  /** Corner radius for this dialog only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export const AlertDialogContent = ({
  className,
  children,
  overlay,
  showNestedAnimation = true,
  container,
  radius,
  ...props
}: AlertDialogContentProps) => {
  const theme = useThemeInjection();
  return (
    <AlertDialogPrimitive.Portal container={container}>
      <AlertDialogPrimitive.Backdrop
        data-slot='alert-dialog-backdrop'
        {...overlay}
        className={cx(
          styles.dialogOverlay,
          overlay?.blur && styles.overlayBlur,
          overlay?.className
        )}
      />
      <AlertDialogPrimitive.Viewport
        className={styles.viewport}
        data-slot='alert-dialog-viewport'
      >
        <AlertDialogPrimitive.Popup
          {...theme}
          className={cx(
            styles.dialogContent,
            showNestedAnimation && styles.showNestedAnimation,
            theme?.className,
            radiusClass(radius),
            className
          )}
          data-slot='alert-dialog-content'
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
};

AlertDialogContent.displayName = 'AlertDialog.Content';
