'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export function MenuGroup({
  className,
  children,
  ...props
}: MenuPrimitive.Group.Props) {
  // Stays rendered while filtering. Removing it would remount the items and reset their state.
  return (
    <MenuPrimitive.Group
      data-slot='menu-group'
      className={cx(className)}
      {...props}
    >
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
      data-slot='menu-label'
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
      data-slot='menu-separator'
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
  const { autocomplete } = useMenuContext();
  const Component = autocomplete ? AutocompletePrimitive.Empty : 'div';

  return (
    <Component
      data-slot='menu-empty-state'
      className={cx(styles.empty, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
MenuEmptyState.displayName = 'Menu.EmptyState';
