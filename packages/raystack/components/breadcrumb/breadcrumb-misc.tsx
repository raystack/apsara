'use client';

import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './breadcrumb.module.css';

export interface BreadcrumbEllipsisProps extends ComponentProps<'span'> {}

export const BreadcrumbEllipsis = ({
  className,
  children = <DotsHorizontalIcon width={20} height={20} />,
  ...props
}: BreadcrumbEllipsisProps) => {
  return (
    <span className={cx(styles['breadcrumb-ellipsis'], className)} {...props}>
      {children}
    </span>
  );
};

BreadcrumbEllipsis.displayName = 'Breadcrumb.Ellipsis';

export interface BreadcrumbSeparatorProps extends ComponentProps<'span'> {}

export const BreadcrumbSeparator = ({
  children = <ChevronRightIcon width={12} height={12} />,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <span className={cx(styles['breadcrumb-separator'], className)} {...props}>
      {children}
    </span>
  );
};

BreadcrumbSeparator.displayName = 'Breadcrumb.Separator';
