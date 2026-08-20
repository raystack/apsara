'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { XIcon } from '~/icons/generated';
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
      data-slot='dialog-header'
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
      data-slot='dialog-footer'
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
      data-slot='dialog-body'
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
      data-slot='dialog-close'
      {...props}
    >
      <XIcon aria-hidden='true' />
    </DialogPrimitive.Close>
  );
}

CloseButton.displayName = 'Dialog.CloseButton';

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cx(styles.title, className)}
      data-slot='dialog-title'
      {...props}
    />
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
      data-slot='dialog-description'
      {...props}
    />
  );
}

DialogDescription.displayName = 'Dialog.Description';
