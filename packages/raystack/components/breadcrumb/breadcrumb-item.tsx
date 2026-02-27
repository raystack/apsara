'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import React, {
  cloneElement,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode
} from 'react';
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
  as?: ReactElement;
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
    const renderedElement = as ?? <a ref={ref} />;
    const label = (
      <>
        {leadingIcon && (
          <span className={styles['breadcrumb-icon']}>{leadingIcon}</span>
        )}
        {children && <span>{children}</span>}
      </>
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
    return (
      <li className={cx(styles['breadcrumb-item'], className)}>
        {cloneElement(
          renderedElement,
          {
            className: cx(
              styles['breadcrumb-link'],
              current && styles['breadcrumb-link-active']
            ),
            href,
            ...props,
            ...renderedElement.props
          },
          label
        )}
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
