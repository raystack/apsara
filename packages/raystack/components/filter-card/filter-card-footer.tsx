'use client';

import { cx } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { Flex } from '../flex';
import styles from './filter-card.module.css';

export interface FilterCardFooterProps
  extends ComponentPropsWithoutRef<typeof Flex> {}

export const FilterCardFooter = forwardRef<
  HTMLDivElement,
  FilterCardFooterProps
>(({ className, children, ...props }, ref) => {
  return (
    <Flex
      ref={ref}
      justify='end'
      className={cx(styles.footer, className)}
      {...props}
    >
      {children}
    </Flex>
  );
});

FilterCardFooter.displayName = 'FilterCard.Footer';
