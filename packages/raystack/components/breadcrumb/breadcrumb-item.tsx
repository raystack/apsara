'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import React, {
  ComponentProps,
  cloneElement,
  ReactElement,
  ReactNode
} from 'react';
import { Menu } from '../menu';
import styles from './breadcrumb.module.css';

export interface BreadcrumbDropdownItem {
  key?: string;
  label: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface BreadcrumbItemProps extends ComponentProps<'a'> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  current?: boolean;
  /** When true, the item is non-clickable and visually muted (e.g. loading or no access). */
  disabled?: boolean;
  dropdownItems?: BreadcrumbDropdownItem[];
  as?: ReactElement;
}

export const BreadcrumbItem = ({
  ref,
  as,
  children,
  className,
  leadingIcon,
  trailingIcon,
  current,
  disabled,
  href,
  dropdownItems,
  ...props
}: BreadcrumbItemProps) => {
  const renderedElement = as ?? <a ref={ref} />;
  const label = (
    <>
      {leadingIcon && (
        <span className={styles['breadcrumb-icon']}>{leadingIcon}</span>
      )}
      {children && <span>{children}</span>}
      {trailingIcon && (
        <span className={styles['breadcrumb-icon']}>{trailingIcon}</span>
      )}
    </>
  );

  if (dropdownItems && !disabled) {
    return (
      <Menu>
        <Menu.Trigger
          ref={ref as React.Ref<HTMLButtonElement>}
          className={cx(styles['breadcrumb-dropdown-trigger'], className)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {label}
          <ChevronDownIcon className={styles['breadcrumb-dropdown-icon']} />
        </Menu.Trigger>
        <Menu.Content className={styles['breadcrumb-dropdown-content']}>
          {dropdownItems.map((dropdownItem, dropdownIndex) => (
            <Menu.Item
              key={dropdownItem.key ?? dropdownIndex}
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
  if (disabled) {
    return (
      <li className={cx(styles['breadcrumb-item'], className)}>
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className={cx(
            styles['breadcrumb-link'],
            styles['breadcrumb-link-disabled']
          )}
          aria-disabled='true'
        >
          {label}
        </span>
      </li>
    );
  }
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
        >
          {label}
        </span>
      </li>
    );
  }
  return (
    <li className={cx(styles['breadcrumb-item'], className)}>
      {cloneElement(
        renderedElement,
        {
          ref,
          className: styles['breadcrumb-link'],
          href,
          ...props,
          ...renderedElement.props
        },
        label
      )}
    </li>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
