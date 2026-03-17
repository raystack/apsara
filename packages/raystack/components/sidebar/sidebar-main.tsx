'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export function SidebarMain({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <Flex
      className={cx(styles.main, className)}
      direction='column'
      role='group'
      aria-label='Main navigation'
      {...props}
    >
      {children}
    </Flex>
  );
}

SidebarMain.displayName = 'Sidebar.Main';
