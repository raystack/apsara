'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
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
  ...props
}: DrawerContentProps & { closeLabel?: string }) {
  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy ? undefined : 'Drawer');
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        {...overlayProps}
        className={cx(styles.backdrop, overlayProps?.className)}
      />
      <DrawerPrimitive.Viewport className={styles.viewport}>
        <DrawerPrimitive.Popup
          className={drawerPopup({ side, className })}
          aria-label={resolvedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          {...props}
        >
          <DrawerPrimitive.Content className={styles.content}>
            {children}
            {showCloseButton && (
              <DrawerPrimitive.Close
                className={styles.close}
                aria-label={closeLabel}
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
DrawerContent.displayName = 'Drawer.Content';
