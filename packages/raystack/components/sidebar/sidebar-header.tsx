'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

/**
 * Free-form slot at the top of the sidebar — an avatar, a workspace switcher,
 * a search box, whatever the header needs to hold. Because its content is
 * arbitrary, it isn't hidden automatically when the sidebar collapses; add
 * `data-collapse-hidden` to any child that should disappear on collapse
 * (e.g. a title next to a leading icon).
 */
export function SidebarHeader({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex align='center' className={cx(styles.header, className)} {...props} />
  );
}

SidebarHeader.displayName = 'Sidebar.Header';
