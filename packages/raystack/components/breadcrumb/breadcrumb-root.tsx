'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';
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
  ({ className, children, size = 'medium', ...props }, ref) => {
    return (
      <nav
        className={breadcrumbVariants({ size, className })}
        ref={ref}
        {...props}
      >
        <ol className={styles['breadcrumb-list']}>{children}</ol>
      </nav>
    );
  }
);

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
