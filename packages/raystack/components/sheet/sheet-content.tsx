'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './sheet.module.css';

const sheetContent = cva(styles.sheetContent, {
  variants: {
    side: {
      top: styles['sheetContent-top'],
      bottom: styles['sheetContent-bottom'],
      left: styles['sheetContent-left'],
      right: styles['sheetContent-right']
    }
  },
  defaultVariants: {
    side: 'right'
  }
});

export interface SheetContentProps
  extends DialogPrimitive.Popup.Props,
    VariantProps<typeof sheetContent> {
  showCloseButton?: boolean;
  overlayProps?: DialogPrimitive.Backdrop.Props;
}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Popup>,
  SheetContentProps
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
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          {...overlayProps}
          className={cx(styles.overlay, overlayProps?.className)}
        />
        <DialogPrimitive.Viewport>
          <DialogPrimitive.Popup
            ref={ref}
            className={sheetContent({ side, className })}
            aria-label='Sheet'
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                className={styles.close}
                aria-label='Close Sheet'
              >
                <Cross1Icon aria-hidden='true' />
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    );
  }
);
SheetContent.displayName = 'Sheet.Content';
