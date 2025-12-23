'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export const SidebarHeader = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    align='center'
    ref={ref}
    className={cx(styles.header, className)}
    role='banner'
    {...props}
  >
    {children}
  </Flex>
));
SidebarHeader.displayName = 'Sidebar.Header';

export const SidebarFooter = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    ref={ref}
    className={cx(styles.footer, className)}
    direction='column'
    role='group'
    aria-label='Footer navigation'
    {...props}
  >
    {children}
  </Flex>
));
SidebarFooter.displayName = 'Sidebar.Footer';

export interface SidebarNavigationGroupProps
  extends ComponentPropsWithoutRef<'div'> {
  label: string;
  leadingIcon?: ReactNode;
  classNames?: {
    header?: string;
    items?: string;
    label?: string;
    icon?: string;
  };
}

export const SidebarNavigationGroup = forwardRef<
  HTMLElement,
  SidebarNavigationGroupProps
>(({ className, label, leadingIcon, classNames, children, ...props }, ref) => (
  <section
    ref={ref}
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
));

SidebarNavigationGroup.displayName = 'Sidebar.Group';
