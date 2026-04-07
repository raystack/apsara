'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { cx } from 'class-variance-authority';
import styles from './scroll-area.module.css';
import { ScrollAreaScrollbar } from './scroll-area-scrollbar';

export type ScrollAreaType = 'always' | 'hover' | 'scroll';

export interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
  type?: ScrollAreaType;
}

export function ScrollArea({
  className,
  type = 'hover',
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={cx(styles.root, className)} {...props}>
      <ScrollAreaPrimitive.Viewport className={styles.viewport}>
        <ScrollAreaPrimitive.Content>{children}</ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaScrollbar orientation='vertical' type={type} />
      <ScrollAreaScrollbar orientation='horizontal' type={type} />
      <ScrollAreaPrimitive.Corner className={styles.corner} />
    </ScrollAreaPrimitive.Root>
  );
}

ScrollArea.displayName = 'ScrollArea';
