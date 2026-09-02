'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { XIcon } from '~/icons';
import { IconButton } from '../icon-button';
import {
  type PortalContainer,
  useThemeInjection
} from '../theme-preview/portal';
import { radiusClass } from '../theme-preview/radius';
import type { Radius } from '../theme-preview/settings';
import styles from './drawer.module.css';

const drawerPopup = cva(styles.drawerPopup, {
  variants: {
    side: {
      top: styles['drawerPopup-top'],
      bottom: styles['drawerPopup-bottom'],
      left: styles['drawerPopup-left'],
      right: styles['drawerPopup-right']
    }
  },
  defaultVariants: {
    side: 'right'
  }
});

export interface DrawerContentProps
  extends Omit<DrawerPrimitive.Popup.Props, 'children'>,
    VariantProps<typeof drawerPopup> {
  showCloseButton?: boolean;
  overlayProps?: DrawerPrimitive.Backdrop.Props;
  children?: ReactNode;
  /** Portals into this element instead of `document.body`. */
  container?: PortalContainer;
  /** Corner radius for this drawer only. Overrides the theme's `radius`. */
  radius?: Radius;
}

export function DrawerContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  overlayProps,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  closeLabel = 'Close',
  container,
  radius,
  ...props
}: DrawerContentProps & { closeLabel?: string }) {
  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy ? undefined : 'Drawer');
  const theme = useThemeInjection();
  return (
    <DrawerPrimitive.Portal container={container}>
      <DrawerPrimitive.Backdrop
        data-slot='drawer-backdrop'
        {...overlayProps}
        className={cx(styles.backdrop, overlayProps?.className)}
      />
      <DrawerPrimitive.Viewport
        className={styles.viewport}
        data-slot='drawer-viewport'
      >
        <DrawerPrimitive.Popup
          {...theme}
          className={drawerPopup({
            side,
            className: cx(theme?.className, radiusClass(radius), className)
          })}
          aria-label={resolvedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          data-slot='drawer-content'
          {...props}
        >
          <DrawerPrimitive.Content
            className={styles.content}
            data-slot='drawer-content-body'
          >
            {children}
            {showCloseButton && (
              <DrawerPrimitive.Close
                className={styles.close}
                aria-label={closeLabel}
                render={<IconButton size={3} />}
                data-slot='drawer-close'
              >
                <XIcon aria-hidden='true' />
              </DrawerPrimitive.Close>
            )}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  );
}
DrawerContent.displayName = 'Drawer.Content';
