'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes } from 'react';
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
    HTMLAttributes<HTMLDivElement> {}

export const BreadcrumbRoot = forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    { className, children, size = 'medium', 'aria-label': ariaLabel, ...props },
    ref
  ) => {
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
  }
);

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
