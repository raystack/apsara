'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import { Flex } from '../flex';
import styles from './dialog.module.css';

export interface DialogRootProps extends DialogPrimitive.Root.Props {}

export const DialogRoot = (props: DialogRootProps) => {
  return <DialogPrimitive.Root {...props} />;
};

DialogRoot.displayName = 'Dialog';

export interface DialogTriggerProps extends DialogPrimitive.Trigger.Props {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    return <DialogPrimitive.Trigger ref={ref} {...props} />;
  }
);

DialogTrigger.displayName = 'Dialog.Trigger';

export interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
  ariaLabel?: string;
  ariaDescription?: string;
  overlayBlur?: boolean;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  width?: string | number;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
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
      style,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cx(
            styles.dialogOverlay,
            overlayClassName,
            overlayBlur && styles.overlayBlur
          )}
          style={overlayStyle}
        />
        <DialogPrimitive.Viewport className={styles.viewport}>
          <DialogPrimitive.Popup
            ref={ref}
            className={cx(styles.dialogContent, className)}
            style={{ width, ...style }}
            aria-label={ariaLabel}
            aria-describedby={
              ariaDescription ? 'dialog-description' : undefined
            }
            {...props}
          >
            {children}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    );
  }
);

DialogContent.displayName = 'Dialog.Content';

export interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DialogHeader = ({ children, className }: DialogHeaderProps) => (
  <Flex
    justify='between'
    align='center'
    className={cx(styles.header, className)}
  >
    {children}
  </Flex>
);

DialogHeader.displayName = 'Dialog.Header';

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export const DialogFooter = ({ children, className }: DialogFooterProps) => (
  <Flex gap={5} justify='end' className={cx(styles.footer, className)}>
    {children}
  </Flex>
);

DialogFooter.displayName = 'Dialog.Footer';

export interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

export const DialogBody = ({ children, className }: DialogBodyProps) => (
  <Flex direction='column' gap={3} className={cx(styles.body, className)}>
    {children}
  </Flex>
);

DialogBody.displayName = 'Dialog.Body';

export interface DialogCloseProps extends DialogPrimitive.Close.Props {}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  (props, ref) => {
    return <DialogPrimitive.Close ref={ref} {...props} />;
  }
);

DialogClose.displayName = 'Dialog.Close';

export interface CloseButtonProps extends DialogPrimitive.Close.Props {}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Close
        ref={ref}
        className={cx(styles.close, className)}
        aria-label='Close dialog'
        {...props}
      >
        <Cross1Icon />
      </DialogPrimitive.Close>
    );
  }
);

CloseButton.displayName = 'Dialog.CloseButton';

export interface DialogTitleProps extends DialogPrimitive.Title.Props {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={cx(styles.title, className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Title>
    );
  }
);

DialogTitle.displayName = 'Dialog.Title';

export interface DialogDescriptionProps
  extends DialogPrimitive.Description.Props {}

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      id='dialog-description'
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});

DialogDescription.displayName = 'Dialog.Description';

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Footer: DialogFooter,
  Body: DialogBody,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Close: DialogClose,
  CloseButton: CloseButton,
  Title: DialogTitle,
  Description: DialogDescription
});
