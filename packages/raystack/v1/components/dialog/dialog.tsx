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
    VariantProps<typeof dialogContent> {
  ariaLabel?: string;
  ariaDescription?: string;
}

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, ariaLabel, ariaDescription, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay 
      className={styles.dialogOverlay}
      aria-hidden="true"
    />
    <DialogPrimitive.Content
      ref={ref}
      className={dialogContent({ className })}
      aria-label={ariaLabel}
      aria-describedby={ariaDescription ? 'dialog-description' : undefined}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
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
    <DialogPrimitive.Close 
      className={styles.close} 
      aria-label="Close dialog"
      {...props}
    >
      {children}
    </DialogPrimitive.Close>
  );
}

interface DialogTitleProps extends ComponentProps<typeof DialogPrimitive.Title> {
  children: React.ReactNode;
}

function DialogTitle({ children, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title 
      {...props}
      role="heading"
      aria-level={1}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

function DialogDescription({ children, ...props }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Description 
      {...props}
      id="dialog-description"
      role="document"
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Close: CloseButton,
  Title: DialogTitle,
  Description: DialogDescription,
}); 