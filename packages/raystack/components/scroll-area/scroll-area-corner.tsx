'use client';

import { cx } from 'class-variance-authority';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import styles from './scroll-area.module.css';

export interface ScrollAreaCornerProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner> {}

export const ScrollAreaCorner = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Corner>,
  ScrollAreaCornerProps
>(({ className, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Corner
      ref={ref}
      className={cx(styles.corner, className)}
      {...props}
    />
  );
});

ScrollAreaCorner.displayName = ScrollAreaPrimitive.Corner.displayName;
