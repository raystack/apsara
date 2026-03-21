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

/**
 * Each entry maps to `<Menu.Item>`. Use `children`, `render`, `onClick`,
 * `disabled`, etc. — whatever `Menu.Item` supports.
 */
export type BreadcrumbDropdownItem = ComponentProps<typeof Menu.Item> & {
  /** Optional stable key for React list reconciliation (not passed to `Menu.Item`). */
  key?: string;
};

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
          {dropdownItems.map((dropdownItem, dropdownIndex) => {
            const {
              key,
              className: itemClassName,
              ...menuItemProps
            } = dropdownItem;
            return (
              <Menu.Item
                key={key ?? dropdownIndex}
                className={cx(
                  styles['breadcrumb-dropdown-item'],
                  itemClassName
                )}
                {...menuItemProps}
              />
            );
          })}
        </Menu.Content>
      </Menu>
    );
  }
  if (disabled || current) {
    return (
      <li className={cx(styles['breadcrumb-item'], className)}>
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className={cx(
            styles['breadcrumb-link'],
            disabled && styles['breadcrumb-link-disabled'],
            current && styles['breadcrumb-link-active']
          )}
          {...(disabled && {
            'aria-disabled': 'true',
            'data-disabled': 'true'
          })}
          {...(current && { 'aria-current': 'page', 'data-current': 'true' })}
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
          className: styles['breadcrumb-link'],
          href,
          ...props,
          ...renderedElement.props,
          ref
        },
        label
      )}
    </li>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
