'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cx } from 'class-variance-authority';
import { Fragment, forwardRef, HTMLAttributes, ReactNode } from 'react';
import styles from './menu.module.css';
import { useMenuContext } from './menu-root';

export const MenuGroup = forwardRef<HTMLDivElement, MenuPrimitive.Group.Props>(
  ({ className, children, ...props }, ref) => {
    const { shouldFilter } = useMenuContext();

    if (shouldFilter) {
      return <Fragment>{children}</Fragment>;
    }

    return (
      <MenuPrimitive.Group ref={ref} className={cx(className)} {...props}>
        {children}
      </MenuPrimitive.Group>
    );
  }
);
MenuGroup.displayName = 'Menu.Group';

export const MenuLabel = forwardRef<
  HTMLDivElement,
  MenuPrimitive.GroupLabel.Props
>(({ className, ...props }, ref) => {
  const { shouldFilter } = useMenuContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuPrimitive.GroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
MenuLabel.displayName = 'Menu.Label';

export const MenuSeparator = forwardRef<
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
MenuSeparator.displayName = 'Menu.Separator';

export const MenuEmptyState = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
));
MenuEmptyState.displayName = 'Menu.EmptyState';
