'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { cx } from 'class-variance-authority';
import styles from './drawer.module.css';

export type DrawerSwipeAreaProps = DrawerPrimitive.SwipeArea.Props;

export function DrawerSwipeArea({ className, ...props }: DrawerSwipeAreaProps) {
  return (
    <DrawerPrimitive.SwipeArea
      className={cx(styles.swipeArea, className)}
      data-slot='drawer-swipe-area'
      {...props}
    />
  );
}
DrawerSwipeArea.displayName = 'Drawer.SwipeArea';
