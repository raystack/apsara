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
  current?: boolean;
  dropdownItems?: BreadcrumbDropdownItem[];
  as?: ReactElement;
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
  const {
    id,
    title,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby
  } = props;

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
          ...renderedElement.props,
          ref
        },
        label
      )}
    </li>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
