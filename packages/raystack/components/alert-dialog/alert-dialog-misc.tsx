'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';
import styles from '../dialog/dialog.module.css';
import { Flex } from '../flex';

export const AlertDialogHeader = forwardRef<
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

AlertDialogHeader.displayName = 'AlertDialog.Header';

export const AlertDialogFooter = forwardRef<
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

AlertDialogFooter.displayName = 'AlertDialog.Footer';

export const AlertDialogBody = forwardRef<
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

AlertDialogBody.displayName = 'AlertDialog.Body';

export const CloseButton = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Close>,
  AlertDialogPrimitive.Close.Props
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Close
      ref={ref}
      className={cx(styles.close, className)}
      aria-label='Close dialog'
      {...props}
    >
      <Cross1Icon aria-hidden='true' />
    </AlertDialogPrimitive.Close>
  );
});

CloseButton.displayName = 'AlertDialog.CloseButton';

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogPrimitive.Title.Props
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cx(styles.title, className)}
      {...props}
    />
  );
});

AlertDialogTitle.displayName = 'AlertDialog.Title';

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogPrimitive.Description.Props
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      {...props}
    />
  );
});

AlertDialogDescription.displayName = 'AlertDialog.Description';
