'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export const SidebarMain = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    ref={ref}
    className={cx(styles.main, className)}
    direction='column'
    role='group'
    aria-label='Main navigation'
    {...props}
  >
    {children}
  </Flex>
));

SidebarMain.displayName = 'Sidebar.Main';
