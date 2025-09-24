'use client';

import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';
import styles from './breadcrumb.module.css';

export interface BreadcrumbEllipsisProps
  extends HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbEllipsis = forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(
  (
    {
      className,
      children = <DotsHorizontalIcon width={20} height={20} />,
      ...props
    },
    ref
  ) => {
    return (
      <span
        className={cx(styles['breadcrumb-ellipsis'], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export interface BreadcrumbSeparatorProps
  extends HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(
  (
    {
      children = <ChevronRightIcon width={12} height={12} />,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <span
        className={cx(styles['breadcrumb-separator'], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
