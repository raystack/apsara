'use client';

import { cx } from 'class-variance-authority';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import {
  Children,
  ComponentPropsWithoutRef,
  ComponentRef,
  PropsWithChildren,
  forwardRef,
  isValidElement
} from 'react';
import { ScrollAreaCorner } from './scroll-area-corner';
import { ScrollAreaScrollbar } from './scroll-area-scrollbar';
import styles from './scroll-area.module.css';

export interface ScrollAreaRootProps
  extends PropsWithChildren<
    ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
  > {
  type?: 'auto' | 'always' | 'scroll' | 'hover';
}

export const ScrollAreaRoot = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaRootProps
>(({ className, type = 'auto', children, ...props }, ref) => {
  // Check if both vertical and horizontal scrollbars are present
  const childrenArray = Children.toArray(children);

  const hasVerticalScrollbar = childrenArray.some(child => {
    if (!isValidElement(child) || child.type !== ScrollAreaScrollbar) {
      return false;
    }
    const props = child.props as { orientation?: 'vertical' | 'horizontal' };
    return props.orientation === 'vertical' || !props.orientation;
  });

  const hasHorizontalScrollbar = childrenArray.some(child => {
    if (!isValidElement(child) || child.type !== ScrollAreaScrollbar) {
      return false;
    }
    const props = child.props as { orientation?: 'vertical' | 'horizontal' };
    return props.orientation === 'horizontal';
  });

  const hasCorner = childrenArray.some(
    child => isValidElement(child) && child.type === ScrollAreaCorner
  );

  // Automatically add Corner if both scrollbars are present and Corner is not already included
  const shouldAddCorner =
    hasVerticalScrollbar && hasHorizontalScrollbar && !hasCorner;

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      type={type}
      className={cx(styles.root, className)}
      {...props}
    >
      {children}
      {shouldAddCorner && <ScrollAreaCorner />}
    </ScrollAreaPrimitive.Root>
  );
});

ScrollAreaRoot.displayName = ScrollAreaPrimitive.Root.displayName;
