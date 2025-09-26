'use client';

import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';

export const SidebarHeader = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    align='center'
    ref={ref}
    className={styles.header}
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
    className={styles.footer}
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
}

export const SidebarNavigationGroup = forwardRef<
  HTMLElement,
  SidebarNavigationGroupProps
>(({ className, label, leadingIcon, children, ...props }, ref) => (
  <section
    ref={ref}
    className={cx(styles['nav-group'], className)}
    aria-label={label}
    {...props}
  >
    <Flex align='center' gap={3} className={styles['nav-group-header']}>
      {leadingIcon && (
        <span className={styles['nav-leading-icon']}>{leadingIcon}</span>
      )}
      <span className={styles['nav-group-label']}>{label}</span>
    </Flex>
    <Flex direction='column' className={styles['nav-group-items']} role='list'>
      {children}
    </Flex>
  </section>
));

SidebarNavigationGroup.displayName = 'Sidebar.Group';
