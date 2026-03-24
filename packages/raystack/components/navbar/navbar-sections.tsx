'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export interface NavbarStartProps extends ComponentProps<typeof Flex> {}

export const NavbarStart = ({
  className,
  children,
  'aria-label': ariaLabel,
  align = 'center',
  gap = 5,
  ...props
}: NavbarStartProps) => {
  return (
    <Flex
      align={align}
      gap={gap}
      className={cx(styles.start, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  );
};

NavbarStart.displayName = 'Navbar.Start';

export interface NavbarCenterProps extends ComponentProps<typeof Flex> {}

export const NavbarCenter = ({
  className,
  children,
  'aria-label': ariaLabel,
  align = 'center',
  gap = 5,
  ...props
}: NavbarCenterProps) => {
  return (
    <Flex
      align={align}
      gap={gap}
      className={cx(styles.center, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  );
};

NavbarCenter.displayName = 'Navbar.Center';

export interface NavbarEndProps extends ComponentProps<typeof Flex> {}

export const NavbarEnd = ({
  className,
  children,
  'aria-label': ariaLabel,
  align = 'center',
  gap = 5,
  ...props
}: NavbarEndProps) => {
  return (
    <Flex
      align={align}
      gap={gap}
      className={cx(styles.end, className)}
      aria-label={ariaLabel}
      {...props}
      role='group'
    >
      {children}
    </Flex>
  );
};

NavbarEnd.displayName = 'Navbar.End';
