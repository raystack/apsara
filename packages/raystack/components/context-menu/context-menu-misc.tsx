'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Fragment, forwardRef, HTMLAttributes, ReactNode } from 'react';
import styles from '../menu/menu.module.css';
import { useMenuContext } from '../menu/menu-root';

export type ContextMenuGroupProps = ContextMenuPrimitive.Group.Props;
export const ContextMenuGroup = forwardRef<
  HTMLDivElement,
  ContextMenuGroupProps
>(({ className, children, ...props }, ref) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <ContextMenuPrimitive.Group ref={ref} className={cx(className)} {...props}>
      {children}
    </ContextMenuPrimitive.Group>
  );
});
ContextMenuGroup.displayName = 'ContextMenu.Group';

export type ContextMenuLabelProps = ContextMenuPrimitive.GroupLabel.Props;
export const ContextMenuLabel = forwardRef<
  HTMLDivElement,
  ContextMenuLabelProps
>(({ className, ...props }, ref) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <ContextMenuPrimitive.GroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
ContextMenuLabel.displayName = 'ContextMenu.Label';

export const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <div
      ref={ref}
      role='separator'
      className={cx(styles.separator, className)}
      {...props}
    />
  );
});
ContextMenuSeparator.displayName = 'ContextMenu.Separator';

export const ContextMenuEmptyState = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
));
ContextMenuEmptyState.displayName = 'ContextMenu.EmptyState';
