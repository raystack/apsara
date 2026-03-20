'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export interface NavbarStartProps
  extends ComponentPropsWithoutRef<typeof Flex> {}

export const NavbarStart = forwardRef<HTMLDivElement, NavbarStartProps>(
  (
    {
      className,
      children,
      'aria-label': ariaLabel,
      align = 'center',
      gap = 5,
      ...props
    },
    ref
  ) => (
    <Flex
      ref={ref}
      align={align}
      gap={gap}
      className={cx(styles.start, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  )
);

NavbarStart.displayName = 'Navbar.Start';

export interface NavbarCenterProps
  extends ComponentPropsWithoutRef<typeof Flex> {}

export const NavbarCenter = forwardRef<HTMLDivElement, NavbarCenterProps>(
  (
    {
      className,
      children,
      'aria-label': ariaLabel,
      align = 'center',
      gap = 5,
      ...props
    },
    ref
  ) => (
    <Flex
      ref={ref}
      align={align}
      gap={gap}
      className={cx(styles.center, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  )
);

NavbarCenter.displayName = 'Navbar.Center';

export interface NavbarEndProps extends ComponentPropsWithoutRef<typeof Flex> {}

export const NavbarEnd = forwardRef<HTMLDivElement, NavbarEndProps>(
  (
    {
      className,
      children,
      'aria-label': ariaLabel,
      align = 'center',
      gap = 5,
      ...props
    },
    ref
  ) => (
    <Flex
      ref={ref}
      align={align}
      gap={gap}
      className={cx(styles.end, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  )
);

NavbarEnd.displayName = 'Navbar.End';
