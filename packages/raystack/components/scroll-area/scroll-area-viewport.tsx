'use client';

import { cx } from 'class-variance-authority';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';
import styles from './scroll-area.module.css';

export interface ScrollAreaViewportProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport> {
  className?: string;
}

export const ScrollAreaViewport = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Viewport>,
  ScrollAreaViewportProps
>(({ className, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={cx(styles.viewport, className)}
      {...props}
    />
  );
});

ScrollAreaViewport.displayName = ScrollAreaPrimitive.Viewport.displayName;
