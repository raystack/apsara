'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';
import styles from './breadcrumb.module.css';

export interface BreadcrumbEllipsisProps
  extends HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbEllipsis = forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, children = <DotsHorizontalIcon />, ...props }, ref) => {
  return (
    <span
      className={cx(styles['breadcrumb-ellipsis'], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export interface BreadcrumbSeparatorProps
  extends HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(({ children = '/', className, ...props }, ref) => {
  return (
    <span
      className={cx(styles['breadcrumb-separator'], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
