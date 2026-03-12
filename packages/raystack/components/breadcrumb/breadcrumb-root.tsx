'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef, HTMLAttributes } from 'react';
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

/**
 * Breadcrumb root: renders a nav with an ordered list of items and separators.
 */
export interface BreadcrumbProps
  extends VariantProps<typeof breadcrumbVariants>,
    HTMLAttributes<HTMLDivElement> {}

export const BreadcrumbRoot = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ className, children, size = 'medium', ...props }, ref) => {
    const { children: _propsChildren, ...restProps } = props as typeof props & {
      children?: React.ReactNode;
    };

    return (
      <nav
        className={breadcrumbVariants({ size, className })}
        ref={ref}
        aria-label='Breadcrumb'
        {...restProps}
      >
        <ol className={styles['breadcrumb-list']}>{children}</ol>
      </nav>
    );
  }
);

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
