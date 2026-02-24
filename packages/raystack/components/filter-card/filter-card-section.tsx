'use client';

import { cx } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { Flex } from '../flex';
import styles from './filter-card.module.css';

export interface FilterCardSectionProps
  extends ComponentPropsWithoutRef<typeof Flex> {
  title?: string;
}

export const FilterCardSection = forwardRef<
  HTMLDivElement,
  FilterCardSectionProps
>(({ className, title, children, ...props }, ref) => {
  return (
    <Flex
      ref={ref}
      direction='column'
      gap={5}
      className={cx(styles.section, className)}
      {...props}
    >
      {title && <div className={styles.sectionTitle}>{title}</div>}
      {children}
    </Flex>
  );
});

FilterCardSection.displayName = 'FilterCard.Section';
