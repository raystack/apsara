'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export function SidebarMain({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      className={cx(styles.main, className)}
      direction='column'
      role='group'
      gap={2}
      aria-label='Main navigation'
      {...props}
    />
  );
}

SidebarMain.displayName = 'Sidebar.Main';
