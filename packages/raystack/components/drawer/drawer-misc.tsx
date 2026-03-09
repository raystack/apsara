'use client';

import { DrawerPreview as DrawerPrimitive } from '@base-ui/react/drawer';
import { cx } from 'class-variance-authority';
import {
  type ElementRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import styles from './drawer.module.css';

export const DrawerHeader = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cx(styles.header, className)}>{children}</div>;
DrawerHeader.displayName = 'Drawer.Header';

export const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  DrawerPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cx(styles.title, className)}
    {...props}
  />
));
DrawerTitle.displayName = 'Drawer.Title';

export const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  DrawerPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cx(styles.description, className)}
    {...props}
  />
));
DrawerDescription.displayName = 'Drawer.Description';

export const DrawerBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(styles.body, className)} {...props} />
));
DrawerBody.displayName = 'Drawer.Body';

export const DrawerFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(styles.footer, className)} {...props} />
));
DrawerFooter.displayName = 'Drawer.Footer';
