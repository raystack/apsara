'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import styles from './dialog.module.css';

export function DialogHeader({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      justify='between'
      align='center'
      className={cx(styles.header, className)}
      {...props}
    />
  );
}

DialogHeader.displayName = 'Dialog.Header';

export function DialogFooter({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      gap={5}
      justify='end'
      className={cx(styles.footer, className)}
      {...props}
    />
  );
}

DialogFooter.displayName = 'Dialog.Footer';

export function DialogBody({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      direction='column'
      gap={3}
      className={cx(styles.body, className)}
      {...props}
    />
  );
}

DialogBody.displayName = 'Dialog.Body';

export function CloseButton(props: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      aria-label='Close dialog'
      render={<IconButton size={3} />}
      {...props}
    >
      <Cross1Icon aria-hidden='true' />
    </DialogPrimitive.Close>
  );
}

CloseButton.displayName = 'Dialog.CloseButton';

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title className={cx(styles.title, className)} {...props} />
  );
}

DialogTitle.displayName = 'Dialog.Title';

export function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cx(styles.description, className)}
      {...props}
    />
  );
}

DialogDescription.displayName = 'Dialog.Description';
