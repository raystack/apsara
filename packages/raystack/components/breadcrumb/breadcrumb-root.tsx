'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import styles from './breadcrumb.module.css';

const breadcrumbVariants = cva(styles['breadcrumb'], {
  variants: {
    size: {
      small: styles['breadcrumb-small'],
      medium: styles['breadcrumb-medium']
    }
  },
  defaultVariants: {
    size: 'medium'
  }
});

export interface BreadcrumbProps
  extends VariantProps<typeof breadcrumbVariants>,
    ComponentProps<'nav'> {}

export const BreadcrumbRoot = ({
  className,
  children,
  ref,
  size = 'medium',
  'aria-label': ariaLabel,
  ...props
}: BreadcrumbProps) => {
  return (
    <nav
      className={breadcrumbVariants({ size, className })}
      ref={ref}
      aria-label={ariaLabel ?? 'Breadcrumb'}
      {...props}
    >
      <ol className={styles['breadcrumb-list']}>{children}</ol>
    </nav>
  );
};

BreadcrumbRoot.displayName = 'Breadcrumb';
