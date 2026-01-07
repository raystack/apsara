import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { Dialog as DialogPrimitive } from 'radix-ui';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef
} from 'react';
import { Flex } from '../flex';
import styles from './dialog.module.css';

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
  scrollableOverlay?: boolean;
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
      scrollableOverlay = false,
      ...props
    },
    ref
  ) => {
    const overlayProps: DialogPrimitive.DialogOverlayProps = {
      className: cx(
        styles.dialogOverlay,
        overlayClassName,
        overlayBlur && styles.overlayBlur
      ),
      style: overlayStyle,
      'aria-hidden': 'true',
      role: 'presentation'
    };

    const content = (
      <DialogPrimitive.Content
        ref={ref}
        className={dialogContent({ className })}
        style={{ width, ...props.style }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? 'dialog-description' : undefined}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    );
    return (
      <DialogPrimitive.Portal>
        {scrollableOverlay ? (
          <DialogPrimitive.Overlay {...overlayProps}>
            {content}
          </DialogPrimitive.Overlay>
        ) : (
          <>
            <DialogPrimitive.Overlay {...overlayProps} />
            {content}
          </>
        )}
      </DialogPrimitive.Portal>
    );
  }
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex
    justify='between'
    align='center'
    className={cx(styles.header, className)}
  >
    {children}
  </Flex>
);

const DialogFooter = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex gap={5} justify='end' className={cx(styles.footer, className)}>
    {children}
  </Flex>
);

const DialogBody = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Flex direction='column' gap={3} className={cx(styles.body, className)}>
    {children}
  </Flex>
);

type CloseButtonProps = ComponentProps<typeof DialogPrimitive.Close>;
export function CloseButton({ className, ...props }: CloseButtonProps) {
  return (
    <DialogPrimitive.Close
      className={cx(styles.close, className)}
      aria-label='Close dialog'
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

export function DialogTitle({
  children,
  className,
  ...props
}: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...props}
      role='heading'
      aria-level={1}
      className={cx(styles.title, className)}
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

export function DialogDescription({
  children,
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cx(styles.description, className)}
      id='dialog-description'
      role='document'
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
  Description: DialogDescription
});
