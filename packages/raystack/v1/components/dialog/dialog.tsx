import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";

import styles from "./dialog.module.css";

const dialogContent = cva(styles.dialogContent);

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContent> {}

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.dialogOverlay} />
    <DialogPrimitive.Content
      ref={ref}
      className={dialogContent({ className })}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

type CloseButtonProps = ComponentProps<typeof DialogPrimitive.Close>;
export function CloseButton({
  children = <Cross1Icon />,
  className,
  ...props
}: CloseButtonProps) {
  return (
    <DialogPrimitive.Close className={styles.close} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}

export const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: CloseButton,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
}); 