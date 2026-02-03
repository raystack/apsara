'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type ElementRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import styles from './sheet.module.css';

export const SheetHeader = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cx(styles.header, className)}>{children}</div>;
SheetHeader.displayName = 'Sheet.Header';

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cx(styles.title, className)}
    {...props}
  />
));
SheetTitle.displayName = 'Sheet.Title';

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cx(styles.description, className)}
    {...props}
  />
));
SheetDescription.displayName = 'Sheet.Description';

export const SheetBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(styles.body, className)} {...props} />
));
SheetBody.displayName = 'Sheet.Body';

export const SheetFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(styles.footer, className)} {...props} />
));
SheetFooter.displayName = 'Sheet.Footer';
