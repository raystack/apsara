'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { cx } from 'class-variance-authority';
import styles from './drawer.module.css';

export type DrawerIndentProps = DrawerPrimitive.Indent.Props;

export function DrawerIndent({ className, ...props }: DrawerIndentProps) {
  return (
    <DrawerPrimitive.Indent
      className={cx(styles.indent, className)}
      data-slot='drawer-indent'
      {...props}
    />
  );
}
DrawerIndent.displayName = 'Drawer.Indent';

export type DrawerIndentBackgroundProps =
  DrawerPrimitive.IndentBackground.Props;

export function DrawerIndentBackground({
  className,
  ...props
}: DrawerIndentBackgroundProps) {
  return (
    <DrawerPrimitive.IndentBackground
      className={cx(styles.indentBackground, className)}
      data-slot='drawer-indent-background'
      {...props}
    />
  );
}
DrawerIndentBackground.displayName = 'Drawer.IndentBackground';
