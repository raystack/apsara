'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, Fragment } from 'react';
import styles from '../menu/menu.module.css';
import { useMenuContext } from '../menu/menu-root';

export type ContextMenuGroupProps = ContextMenuPrimitive.Group.Props;
export const ContextMenuGroup = ({
  className,
  children,
  ...props
}: ContextMenuGroupProps) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <ContextMenuPrimitive.Group
      data-slot='context-menu-group'
      className={cx(className)}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Group>
  );
};
ContextMenuGroup.displayName = 'ContextMenu.Group';

export type ContextMenuLabelProps = ContextMenuPrimitive.GroupLabel.Props;
export const ContextMenuLabel = ({
  className,
  ...props
}: ContextMenuLabelProps) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot='context-menu-label'
      className={cx(styles.label, className)}
      {...props}
    />
  );
};
ContextMenuLabel.displayName = 'ContextMenu.Label';

export const ContextMenuSeparator = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <div
      data-slot='context-menu-separator'
      role='separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
};
ContextMenuSeparator.displayName = 'ContextMenu.Separator';

export const ContextMenuEmptyState = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => (
  <div
    data-slot='context-menu-empty-state'
    className={cx(styles.empty, className)}
    {...props}
  >
    {children}
  </div>
);
ContextMenuEmptyState.displayName = 'ContextMenu.EmptyState';
