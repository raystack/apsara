'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { cva, cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import { XIcon } from '~/icons';
import { type Radius, radiusVariants } from '../../shared/radius';
import { IconButton } from '../icon-button';
import { useThemeInjection } from '../theme/portal';
import styles from './drawer.module.css';
import { useDrawerSide } from './drawer-root';

const drawerPopup = cva(styles.drawerPopup, {
  variants: {
    ...radiusVariants,
    side: {
      top: styles['drawerPopup-top'],
      bottom: styles['drawerPopup-bottom'],
      left: styles['drawerPopup-left'],
      right: styles['drawerPopup-right']
    }
  }
});

export interface DrawerContentProps
  extends Omit<DrawerPrimitive.Popup.Props, 'children'> {
  /**
   * Hides the close button.
   * @default false
   */
  hideCloseButton?: boolean;
  overlayProps?: DrawerPrimitive.Backdrop.Props;
  children?: ReactNode;
  /** Corner radius for this drawer only. Overrides the theme's `radius`. */
  radius?: Radius;
  /**
   * Accessible label for the close button.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Keeps a focused input above the on-screen keyboard on phones.
   * @default false
   */
  enableVirtualKeyboard?: boolean;
  /** Element to render the drawer into. Defaults to `document.body`. */
  container?: DrawerPrimitive.Portal.Props['container'];
}

export function DrawerContent({
  className,
  children,
  hideCloseButton = false,
  overlayProps,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  closeLabel = 'Close',
  radius,
  enableVirtualKeyboard = false,
  container,
  ...props
}: DrawerContentProps) {
  const side = useDrawerSide();
  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy ? undefined : 'Drawer');
  const theme = useThemeInjection();
  const portal = (
    <DrawerPrimitive.Portal {...theme} container={container}>
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
            radius,
            className: cx(theme?.className, className)
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
            {!hideCloseButton && (
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
  return enableVirtualKeyboard ? (
    <DrawerPrimitive.VirtualKeyboardProvider>
      {portal}
    </DrawerPrimitive.VirtualKeyboardProvider>
  ) : (
    portal
  );
}
DrawerContent.displayName = 'Drawer.Content';
