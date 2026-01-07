'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, VariantProps } from 'class-variance-authority';
import { Dialog as DialogPrimitive } from 'radix-ui';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef
} from 'react';
import { DialogDescription, DialogTitle } from '../dialog/dialog';
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

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContent> {
  ariaLabel?: string;
  ariaDescription?: string;
}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps & { close?: boolean; children?: React.ReactNode }
>(
  (
    { className, children, close, side, ariaLabel, ariaDescription, ...props },
    forwardedRef
  ) => {
    return (
      <DialogPrimitive.Portal>
        <Overlay>
          <DialogPrimitive.Content
            {...props}
            ref={forwardedRef}
            className={sheetContent({ side, className })}
            aria-label={ariaLabel || 'Sheet with overlay'}
            aria-describedby={
              ariaDescription ? 'sheet with overlay' : undefined
            }
            role='dialog'
            tabIndex={-1}
          >
            {children}
            {close && (
              <CloseButton aria-label='Close sheet'>
                <Cross1Icon aria-hidden='true' />
              </CloseButton>
            )}
            {ariaDescription && (
              <div id='sheet-description' className='sr-only'>
                {ariaDescription}
              </div>
            )}
          </DialogPrimitive.Content>
        </Overlay>
      </DialogPrimitive.Portal>
    );
  }
);

const overlay = cva(styles.overlay);
export interface OverlayProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof overlay> {}

const Overlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  OverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={overlay({ className })}
    aria-hidden='true'
    role='presentation'
    {...props}
  />
));

Overlay.displayName = DialogPrimitive.Overlay.displayName;

const close = cva(styles.close);
type CloseButtonProps = ComponentProps<typeof DialogPrimitive.Close>;

export function CloseButton({
  children,
  className,
  ...props
}: CloseButtonProps) {
  return (
    <DialogPrimitive.Close
      className={close({ className })}
      {...props}
      aria-label='Close'
    >
      {children}
    </DialogPrimitive.Close>
  );
}

export type SheetProps = ComponentProps<typeof DialogPrimitive.Root> & {
  ariaLabel?: string;
};

export function RootSheet({ children, ariaLabel, ...props }: SheetProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export const Sheet = Object.assign(RootSheet, {
  Trigger: DialogPrimitive.Trigger,
  Content: SheetContent,
  Close: DialogPrimitive.Close,
  Title: DialogTitle,
  Description: DialogDescription
});
