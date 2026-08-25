'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { ChevronRightIcon, EllipsisIcon } from '~/icons';
import styles from './breadcrumb.module.css';

export interface BreadcrumbEllipsisProps extends ComponentProps<'span'> {}

export const BreadcrumbEllipsis = ({
  ref,
  className,
  children = <EllipsisIcon width={20} height={20} />,
  ...props
}: BreadcrumbEllipsisProps) => {
  return (
    <li
      className={styles['breadcrumb-item']}
      role='presentation'
      aria-hidden='true'
      data-slot='breadcrumb-item'
    >
      <span
        className={cx(styles['breadcrumb-ellipsis'], className)}
        ref={ref}
        data-slot='breadcrumb-ellipsis'
        {...props}
      >
        {children}
      </span>
    </li>
  );
};

BreadcrumbEllipsis.displayName = 'Breadcrumb.Ellipsis';

export interface BreadcrumbSeparatorProps extends ComponentProps<'span'> {}

export const BreadcrumbSeparator = ({
  ref,
  children = <ChevronRightIcon width={12} height={12} />,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <li
      className={styles['breadcrumb-item']}
      role='presentation'
      aria-hidden='true'
      data-slot='breadcrumb-item'
    >
      <span
        className={cx(styles['breadcrumb-separator'], className)}
        ref={ref}
        role='presentation'
        aria-hidden='true'
        data-slot='breadcrumb-separator'
        {...props}
      >
        {children}
      </span>
    </li>
  );
};

BreadcrumbSeparator.displayName = 'Breadcrumb.Separator';
