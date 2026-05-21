'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './drawer.module.css';

export const DrawerHeader = ({
  className,
  ...props
}: ComponentProps<'div'>) => (
  <div className={cx(styles.header, className)} {...props} />
);
DrawerHeader.displayName = 'Drawer.Header';

export function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title className={cx(styles.title, className)} {...props} />
  );
}
DrawerTitle.displayName = 'Drawer.Title';

export function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      className={cx(styles.description, className)}
      {...props}
    />
  );
}
DrawerDescription.displayName = 'Drawer.Description';

export function DrawerBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.body, className)} {...props} />;
}
DrawerBody.displayName = 'Drawer.Body';

export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}
DrawerFooter.displayName = 'Drawer.Footer';
