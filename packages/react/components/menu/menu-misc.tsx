'use client';

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

export interface MenuEmptyStateProps extends ComponentProps<'div'> {
  /** Content to show when no item matches the search. */
  children: ReactNode;
}

export function MenuEmptyState({
  className,
  children,
  ...props
}: MenuEmptyStateProps) {
  const { autocomplete } = useMenuContext();
  const Component = autocomplete ? MenuPrimitive.Empty : 'div';

  return (
    <Component
      data-slot='menu-empty-state'
      // The search list is a menu, which allows only items, groups and
      // separators, so the empty state is a plain element and not a live region.
      role={undefined}
      aria-live={undefined}
      aria-atomic={undefined}
      className={cx(styles.empty, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
MenuEmptyState.displayName = 'Menu.EmptyState';
