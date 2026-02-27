'use client';

import { DrawerPreview as DrawerPrimitive } from '@base-ui/react/drawer';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './drawer.module.css';

type Side = 'top' | 'right' | 'bottom' | 'left';

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
  children?: React.ReactNode;
}

export const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Popup>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      side = 'right',
      showCloseButton = true,
      overlayProps,
      ...props
    },
    ref
  ) => {
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Backdrop
          {...overlayProps}
          className={cx(styles.backdrop, overlayProps?.className)}
        />
        <DrawerPrimitive.Viewport className={styles.viewport}>
          <DrawerPrimitive.Popup
            ref={ref}
            className={drawerPopup({ side, className })}
            aria-label='Drawer'
            {...props}
          >
            <DrawerPrimitive.Content className={styles.content}>
              {children}
              {showCloseButton && (
                <DrawerPrimitive.Close
                  className={styles.close}
                  aria-label='Close Drawer'
                >
                  <Cross1Icon aria-hidden='true' />
                </DrawerPrimitive.Close>
              )}
            </DrawerPrimitive.Content>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    );
  }
);
DrawerContent.displayName = 'Drawer.Content';
