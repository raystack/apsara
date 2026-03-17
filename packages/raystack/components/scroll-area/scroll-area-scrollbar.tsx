'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { cx } from 'class-variance-authority';
import type { ScrollAreaType } from './scroll-area';
import styles from './scroll-area.module.css';

export interface ScrollAreaScrollbarProps
  extends ScrollAreaPrimitive.Scrollbar.Props {
  type?: ScrollAreaType;
}

export function ScrollAreaScrollbar({
  className,
  orientation = 'vertical',
  type = 'hover',
  ...props
}: ScrollAreaScrollbarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cx(styles.scrollbar, styles[`scrollbar-${type}`], className)}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className={styles.thumb} />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';
