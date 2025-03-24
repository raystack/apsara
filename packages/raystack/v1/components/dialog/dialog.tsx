import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";
import { Flex } from "../flex";

import styles from "./dialog.module.css";

const dialogContent = cva(styles.dialogContent);

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContent> {
  ariaLabel?: string;
  ariaDescription?: string;
  overlayBlur?: boolean;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  width?: string | number;
}

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      ariaLabel,
      ariaDescription,
      overlayBlur = false,
      overlayClassName,
      overlayStyle,
      width,
      ...props
    },
    ref
  ) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={clsx(
          styles.dialogOverlay,
          overlayClassName,
          overlayBlur && styles.overlayBlur
        )}
        style={overlayStyle}
        aria-hidden="true"
        role="presentation"
      />
      <DialogPrimitive.Content
        ref={ref}
        className={dialogContent({ className })}
        style={{ width, ...props.style }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? "dialog-description" : undefined}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex
    justify={"between"}
    align={"center"}
    className={clsx(styles.header, className)}
  >
    {children}
  </Flex>
);

const DialogFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex gap={5} justify="end" className={clsx(styles.footer, className)}>
    {children}
  </Flex>
);

const DialogBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex direction="column" gap={3} className={clsx(styles.body, className)}>
    {children}
  </Flex>
);

type CloseButtonProps = ComponentProps<typeof DialogPrimitive.Close>;
export function CloseButton({ className, ...props }: CloseButtonProps) {
  return (
    <DialogPrimitive.Close
      className={clsx(styles.close, className)}
      aria-label="Close dialog"
      {...props}
    >
      <Cross1Icon />
    </DialogPrimitive.Close>
  );
}

interface DialogTitleProps
  extends ComponentProps<typeof DialogPrimitive.Title> {
  children: React.ReactNode;
}

function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...props}
      role="heading"
      aria-level={1}
      className={clsx(styles.title, className)}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

interface DialogDescriptionProps
  extends ComponentProps<typeof DialogPrimitive.Description> {
  children: React.ReactNode;
  className?: string;
}

function DialogDescription({
  children,
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={clsx(styles.description, className)}
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
  Header: DialogHeader,
  Footer: DialogFooter,
  Body: DialogBody,
  Close: DialogPrimitive.Close,
  CloseButton: CloseButton,
  Title: DialogTitle,
  Description: DialogDescription,
});
