'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './dialog.module.css';
import { CloseButton } from './dialog-misc';

export interface DialogContentProps extends DialogPrimitive.Popup.Props {
  showCloseButton?: boolean;
  overlay?: DialogPrimitive.Backdrop.Props & { blur?: boolean };
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

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlay,
  showNestedAnimation = true,
  container,
  radius,
  ...props
}: DialogContentProps) {
  const theme = useThemeInjection();
  return (
    <DialogPrimitive.Portal container={container}>
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
            showNestedAnimation && styles.showNestedAnimation,
            theme?.className,
            radiusClass(radius),
            className
          )}
          data-slot='dialog-content'
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
