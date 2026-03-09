'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './dialog.module.css';

export const DialogHeader = forwardRef<
  ElementRef<typeof Flex>,
  ComponentPropsWithoutRef<typeof Flex>
>(({ className, ...props }, ref) => (
  <Flex
    justify='between'
    align='center'
    className={cx(styles.header, className)}
    ref={ref}
    {...props}
  />
));

DialogHeader.displayName = 'Dialog.Header';

export const DialogFooter = forwardRef<
  ElementRef<typeof Flex>,
  ComponentPropsWithoutRef<typeof Flex>
>(({ className, ...props }, ref) => (
  <Flex
    gap={5}
    justify='end'
    className={cx(styles.footer, className)}
    ref={ref}
    {...props}
  />
));

DialogFooter.displayName = 'Dialog.Footer';

export const DialogBody = forwardRef<
  ElementRef<typeof Flex>,
  ComponentPropsWithoutRef<typeof Flex>
>(({ className, ...props }, ref) => (
  <Flex
    direction='column'
    gap={3}
    className={cx(styles.body, className)}
    ref={ref}
    {...props}
  />
));

DialogBody.displayName = 'Dialog.Body';

export const CloseButton = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DialogPrimitive.Close.Props
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Close
      ref={ref}
      className={cx(styles.close, className)}
      aria-label='Close dialog'
      {...props}
    >
      <Cross1Icon aria-hidden='true' />
    </DialogPrimitive.Close>
  );
});

CloseButton.displayName = 'Dialog.CloseButton';

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogPrimitive.Title.Props
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cx(styles.title, className)}
      {...props}
    />
  );
});

DialogTitle.displayName = 'Dialog.Title';

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogPrimitive.Description.Props
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      {...props}
    />
  );
});

DialogDescription.displayName = 'Dialog.Description';
