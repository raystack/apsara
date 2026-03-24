'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cx } from 'class-variance-authority';
import { ComponentProps, Fragment, ReactNode } from 'react';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export function MenuGroup({
  className,
  children,
  ...props
}: MenuPrimitive.Group.Props) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <MenuPrimitive.Group className={cx(className)} {...props}>
      {children}
    </MenuPrimitive.Group>
  );
}
MenuGroup.displayName = 'Menu.Group';

export function MenuLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuPrimitive.GroupLabel
      className={cx(styles.label, className)}
      {...props}
    />
  );
}
MenuLabel.displayName = 'Menu.Label';

export function MenuSeparator({ className, ...props }: ComponentProps<'div'>) {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <div
      role='separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
}
MenuSeparator.displayName = 'Menu.Separator';

export function MenuEmptyState({
  className,
  children,
  ...props
}: ComponentProps<'div'> & { children: ReactNode }) {
  return (
    <div className={cx(styles.empty, className)} {...props}>
      {children}
    </div>
  );
}
MenuEmptyState.displayName = 'Menu.EmptyState';
