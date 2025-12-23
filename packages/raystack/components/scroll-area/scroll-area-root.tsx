'use client';

import { cx } from 'class-variance-authority';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactNode,
  forwardRef
} from 'react';
import { ScrollAreaScrollbar } from './scroll-area-scrollbar';
import styles from './scroll-area.module.css';

export interface ScrollAreaRootProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  className?: string;
  children?: ReactNode;
}

export const ScrollAreaRoot = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaRootProps
>(({ className, type = 'auto', children, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      type={type}
      className={cx(styles.root, className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className={styles.viewport}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaScrollbar orientation='vertical' />
      <ScrollAreaScrollbar orientation='horizontal' />
      <ScrollAreaPrimitive.Corner className={styles.corner} />
    </ScrollAreaPrimitive.Root>
  );
});

ScrollAreaRoot.displayName = ScrollAreaPrimitive.Root.displayName;
