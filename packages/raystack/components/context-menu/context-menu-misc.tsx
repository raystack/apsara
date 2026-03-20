'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, Fragment, HTMLAttributes, ReactNode } from 'react';
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
    <ContextMenuPrimitive.Group className={cx(className)} {...props}>
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
      className={cx(styles.label, className)}
      {...props}
    />
  );
};
ContextMenuLabel.displayName = 'ContextMenu.Label';

export const ContextMenuSeparator = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
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
};
ContextMenuSeparator.displayName = 'ContextMenu.Separator';

export const ContextMenuEmptyState = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => (
  <div className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
);
ContextMenuEmptyState.displayName = 'ContextMenu.EmptyState';
