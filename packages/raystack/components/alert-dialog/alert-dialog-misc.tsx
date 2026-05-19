'use client';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import styles from '../dialog/dialog.module.css';
import { Flex } from '../flex';
import alertDialogStyles from './alert-dialog.module.css';

export const AlertDialogHeader = ({
  className,
  ...props
}: ComponentProps<typeof Flex>) => (
  <Flex
    direction='column'
    gap={3}
    className={cx(styles.header, alertDialogStyles.header, className)}
    {...props}
  />
);

AlertDialogHeader.displayName = 'AlertDialog.Header';

export const AlertDialogFooter = ({
  className,
  ...props
}: ComponentProps<typeof Flex>) => (
  <Flex
    gap={5}
    justify='end'
    className={cx(styles.footer, alertDialogStyles.footer, className)}
    {...props}
  />
);

AlertDialogFooter.displayName = 'AlertDialog.Footer';

export const AlertDialogBody = ({
  className,
  ...props
}: ComponentProps<typeof Flex>) => (
  <Flex
    direction='column'
    gap={3}
    className={cx(styles.body, alertDialogStyles.body, className)}
    {...props}
  />
);

AlertDialogBody.displayName = 'AlertDialog.Body';

export const AlertDialogTitle = ({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) => {
  return (
    <AlertDialogPrimitive.Title
      className={cx(styles.title, className)}
      {...props}
    />
  );
};

AlertDialogTitle.displayName = 'AlertDialog.Title';

export const AlertDialogDescription = ({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) => {
  return (
    <AlertDialogPrimitive.Description
      className={cx(styles.description, className)}
      {...props}
    />
  );
};

AlertDialogDescription.displayName = 'AlertDialog.Description';
