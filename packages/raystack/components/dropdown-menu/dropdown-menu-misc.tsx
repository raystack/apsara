'use client';

import {
  MenuGroup,
  MenuGroupLabel,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuSeparator,
  MenuSeparatorProps
} from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import {
  ElementRef,
  Fragment,
  HTMLAttributes,
  ReactNode,
  forwardRef
} from 'react';
import { useDropdownContext } from './dropdown-menu-root';
import styles from './dropdown-menu.module.css';
import { WithAsChild } from './types';

export const DropdownMenuGroup = forwardRef<
  ElementRef<typeof MenuGroup>,
  WithAsChild<MenuGroupProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  return (
    <MenuGroup
      ref={ref}
      className={cx(styles.menugroup, className)}
      render={shouldFilter ? <Fragment /> : asChild ? <Slot.Root /> : undefined}
      {...props}
    />
  );
});

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof MenuGroupLabel>,
  WithAsChild<MenuGroupLabelProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuGroupLabel
      ref={ref}
      className={cx(styles.label, className)}
      render={asChild ? <Slot.Root /> : undefined}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof MenuSeparator>,
  WithAsChild<MenuSeparatorProps>
>(({ className, asChild, ...props }, ref) => {
  const { shouldFilter } = useDropdownContext();

  if (shouldFilter) {
    return null;
  }

  return (
    <MenuSeparator
      ref={ref}
      className={cx(styles.separator, className)}
      render={asChild ? <Slot.Root /> : <div />}
      {...props}
    />
  );
});

export const DropdownMenuEmptyState = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
));
