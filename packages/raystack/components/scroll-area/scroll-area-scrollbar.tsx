'use client';

import { cx } from 'class-variance-authority';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import styles from './scroll-area.module.css';

export interface ScrollAreaScrollbarProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  orientation?: 'vertical' | 'horizontal';
  thumbVisibility?: 'always' | 'hover' | 'hidden';
  className?: string;
}

export const ScrollAreaScrollbar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollAreaScrollbarProps
>(
  (
    {
      className,
      orientation = 'vertical',
      thumbVisibility = 'always',
      ...props
    },
    ref
  ) => {
    return (
      <ScrollAreaPrimitive.Scrollbar
        ref={ref}
        orientation={orientation}
        className={cx(
          styles.scrollbar,
          thumbVisibility === 'always' && styles['thumb-always-visible'],
          thumbVisibility === 'hidden' && styles['thumb-hidden'],
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Thumb className={styles.thumb} />
      </ScrollAreaPrimitive.Scrollbar>
    );
  }
);

ScrollAreaScrollbar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;
