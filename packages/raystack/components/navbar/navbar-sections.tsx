'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './navbar.module.css';

export const NavbarStart = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    ref={ref}
    align='center'
    gap={3}
    className={cx(styles.start, className)}
    {...props}
  >
    {children}
  </Flex>
));

NavbarStart.displayName = 'Navbar.Start';

export const NavbarEnd = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    ref={ref}
    align='center'
    gap={3}
    className={cx(styles.end, className)}
    {...props}
  >
    {children}
  </Flex>
));

NavbarEnd.displayName = 'Navbar.End';
