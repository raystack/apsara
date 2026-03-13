'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Menu } from '../menu';
import styles from './breadcrumb.module.css';

export interface BreadcrumbDropdownItem {
  label: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLAnchorElement> {
  leadingIcon?: ReactNode;
  current?: boolean;
  dropdownItems?: BreadcrumbDropdownItem[];
  href?: string;
  /** Component to render as (e.g. NextLink). Receives our props (href, className, ref, etc.). Defaults to "a". */
  as?: React.ElementType;
}

export const BreadcrumbItem = forwardRef<
  HTMLAnchorElement,
  BreadcrumbItemProps
>(
  (
    {
      as,
      children,
      className,
      leadingIcon,
      current,
      href,
      dropdownItems,
      ...props
    },
    ref
  ) => {
    const Component = as ?? 'a';
    // Only wrap in spans when needed for layout (leading icon); otherwise keep link content as plain text so DOM shows <a>Home</a> not <a><span>Home</span></a>
    const label = leadingIcon ? (
      <>
        <span className={styles['breadcrumb-icon']}>{leadingIcon}</span>
        {children != null && <span>{children}</span>}
      </>
    ) : (
      children
    );

    if (dropdownItems) {
      return (
        <Menu>
          <Menu.Trigger className={styles['breadcrumb-dropdown-trigger']}>
            {label}
            <ChevronDownIcon className={styles['breadcrumb-dropdown-icon']} />
          </Menu.Trigger>
          <Menu.Content className={styles['breadcrumb-dropdown-content']}>
            {dropdownItems.map((dropdownItem, dropdownIndex) => (
              <Menu.Item
                key={dropdownIndex}
                className={styles['breadcrumb-dropdown-item']}
                onClick={dropdownItem?.onClick}
              >
                {dropdownItem.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu>
      );
    }
    // Current page: render as non-link <span> (semantic; no href)
    if (current) {
      return (
        <li className={cx(styles['breadcrumb-item'], className)}>
          <span
            ref={ref as React.RefObject<HTMLSpanElement>}
            className={cx(
              styles['breadcrumb-link'],
              styles['breadcrumb-link-active']
            )}
            aria-current='page'
            {...props}
          >
            {label}
          </span>
        </li>
      );
    }
    // Link: render as <a> or custom Component (e.g. NextLink → <a> in DOM)
    return (
      <li className={cx(styles['breadcrumb-item'], className)}>
        <Component
          ref={ref}
          className={cx(styles['breadcrumb-link'])}
          href={href}
          {...props}
        >
          {label}
        </Component>
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
