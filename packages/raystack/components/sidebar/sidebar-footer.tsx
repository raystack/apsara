'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export function SidebarFooter({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      className={cx(styles.footer, className)}
      direction='column'
      role='list'
      aria-label='Footer navigation'
      data-slot='sidebar-footer'
      {...props}
    />
  );
}

SidebarFooter.displayName = 'Sidebar.Footer';
