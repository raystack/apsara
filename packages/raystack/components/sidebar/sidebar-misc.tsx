'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export function SidebarHeader({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      align='center'
      className={cx(styles.header, className)}
      role='banner'
      {...props}
    />
  );
}
SidebarHeader.displayName = 'Sidebar.Header';

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
      {...props}
    />
  );
}
SidebarFooter.displayName = 'Sidebar.Footer';

export interface SidebarNavigationGroupProps extends ComponentProps<'section'> {
  label: string;
  leadingIcon?: ReactNode;
  classNames?: {
    header?: string;
    items?: string;
    label?: string;
    icon?: string;
  };
}

export function SidebarNavigationGroup({
  className,
  label,
  leadingIcon,
  classNames,
  children,
  ...props
}: SidebarNavigationGroupProps) {
  return (
    <section
      className={cx(styles['nav-group'], className)}
      aria-label={label}
      {...props}
    >
      <Flex
        align='center'
        gap={3}
        className={cx(styles['nav-group-header'], classNames?.header)}
      >
        {leadingIcon && (
          <span className={cx(styles['nav-leading-icon'], classNames?.icon)}>
            {leadingIcon}
          </span>
        )}
        <span className={cx(styles['nav-group-label'], classNames?.label)}>
          {label}
        </span>
      </Flex>
      <Flex
        direction='column'
        className={cx(styles['nav-group-items'], classNames?.items)}
        role='list'
      >
        {children}
      </Flex>
    </section>
  );
}

SidebarNavigationGroup.displayName = 'Sidebar.Group';
