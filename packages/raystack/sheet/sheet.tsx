import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";

import styles from "./sheet.module.css";

const sheetContent = cva(styles.sheetContent, {
  variants: {
    side: {
      top: styles["sheetContent-top"],
      bottom: styles["sheetContent-bottom"],
      left: styles["sheetContent-left"],
      right: styles["sheetContent-right"],
    },
  },

  defaultVariants: {
    side: "right",
  },
});

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContent> {}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps & { close?: boolean }
>(({ className, children, close, side, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        {...props}
        ref={forwardedRef}
        className={sheetContent({ side, className })}
      >
        {children}
        {close && (
          <CloseButton>
            <Cross1Icon />
          </CloseButton>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

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
    <DialogPrimitive.Close className={close({ className })} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}

export const Sheet = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: SheetContent,
  Close: DialogPrimitive.Close,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
});
