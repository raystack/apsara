'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import React, { ComponentProps, ElementType, ReactNode } from 'react';
import { Menu } from '../menu';
import styles from './breadcrumb.module.css';

export interface BreadcrumbDropdownItem {
  key?: string;
  label: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface BreadcrumbItemProps extends ComponentProps<'a'> {
  leadingIcon?: ReactNode;
  current?: boolean;
  dropdownItems?: BreadcrumbDropdownItem[];
  /** Component to render as (e.g. NextLink). Receives our props (href, className, ref, etc.). Defaults to "a". */
  as?: ElementType;
}

export const BreadcrumbItem = ({
  ref,
  as,
  children,
  className,
  leadingIcon,
  current,
  href,
  dropdownItems,
  ...props
}: BreadcrumbItemProps) => {
  const Component = (as ?? 'a') as ElementType;
  const label = leadingIcon ? (
    <>
      <span className={styles['breadcrumb-icon']}>{leadingIcon}</span>
      {children != null && <span>{children}</span>}
    </>
  ) : (
    children
  );

  const {
    id,
    title,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby
  } = props;

  if (dropdownItems) {
    return (
      <li className={cx(styles['breadcrumb-item'], className)}>
        <Menu>
          <Menu.Trigger
            ref={ref as React.Ref<HTMLButtonElement>}
            className={styles['breadcrumb-dropdown-trigger']}
            id={id}
            title={title}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
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
          {...props}
        >
          {label}
        </span>
      </li>
    );
  }
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
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
