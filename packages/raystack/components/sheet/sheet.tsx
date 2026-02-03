'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  type ComponentProps,
  type ElementRef,
  forwardRef,
  HTMLAttributes,
  type ReactNode
} from 'react';
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

const SheetHeader = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cx(styles.header, className)}>{children}</div>;
SheetHeader.displayName = 'Sheet.Header';

const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cx(styles.title, className)}
    {...props}
  />
));
SheetTitle.displayName = 'Sheet.Title';

const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cx(styles.description, className)}
    {...props}
  />
));
SheetDescription.displayName = 'Sheet.Description';

const SheetBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx(styles.body, className)} {...props} />
  )
);
SheetBody.displayName = 'Sheet.Body';

const SheetFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx(styles.footer, className)} {...props} />
  )
);
SheetFooter.displayName = 'Sheet.Footer';

export type SheetProps = ComponentProps<typeof DialogPrimitive.Root>;

export const Sheet = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: DialogPrimitive.Close
});
