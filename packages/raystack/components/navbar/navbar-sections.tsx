'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export interface NavbarStartProps extends ComponentProps<typeof Flex> {}

export function NavbarStart({
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: NavbarStartProps) {
  return (
    <Flex
      align='center'
      gap={5}
      className={cx(styles.start, className)}
      role={ariaLabel ? 'group' : undefined}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Flex>
  );
}

NavbarStart.displayName = 'Navbar.Start';

export interface NavbarEndProps extends ComponentProps<typeof Flex> {}

export function NavbarEnd({
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: NavbarEndProps) {
  return (
    <Flex
      align='center'
      gap={5}
      className={cx(styles.end, className)}
      role={ariaLabel ? 'group' : undefined}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Flex>
  );
}

NavbarEnd.displayName = 'Navbar.End';
