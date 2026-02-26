'use client';

import { Toast as ToastPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './toast.module.css';

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ToastPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cx(styles.title, className)}
    {...props}
  />
));

ToastTitle.displayName = 'Toast.Title';

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ToastPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cx(styles.description, className)}
    {...props}
  />
));

ToastDescription.displayName = 'Toast.Description';

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ToastPrimitive.Action.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cx(styles.action, className)}
    {...props}
  />
));

ToastAction.displayName = 'Toast.Action';

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ToastPrimitive.Close.Props
>(({ className, children, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cx(styles.close, className)}
    aria-label='Close toast'
    {...props}
  >
    {children ?? <Cross1Icon aria-hidden='true' />}
  </ToastPrimitive.Close>
));

ToastClose.displayName = 'Toast.Close';

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ToastPrimitive.Viewport.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cx(styles.viewport, className)}
    {...props}
  />
));

ToastViewport.displayName = 'Toast.Viewport';
