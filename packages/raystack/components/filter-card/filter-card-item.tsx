'use client';

import { cx } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { Text } from '../text';
import styles from './filter-card.module.css';

export interface FilterCardItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const FilterCardItem = forwardRef<HTMLDivElement, FilterCardItemProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx(styles.item, className)} {...props}>
        <Text size={1}>{label}</Text>
        {children}
      </div>
    );
  }
);

FilterCardItem.displayName = 'FilterCard.Item';
