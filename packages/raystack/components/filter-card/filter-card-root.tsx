'use client';

import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import styles from './filter-card.module.css';

export interface FilterCardRootProps extends HTMLAttributes<HTMLDivElement> {}

export const FilterCardRoot = forwardRef<HTMLDivElement, FilterCardRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx(styles.filterCard, className)} {...props}>
        {children}
      </div>
    );
  }
);

FilterCardRoot.displayName = 'FilterCard';
