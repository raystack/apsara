'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import React, { ComponentProps, ReactNode } from 'react';
import { ChevronDownIcon } from '~/icons';
import { Menu } from '../menu';
import styles from './breadcrumb.module.css';

/**
 * Each entry maps to `<Menu.Item>`. Use `children`, `render`, `onClick`,
 * `disabled`, etc. - whatever `Menu.Item` supports.
 */
export type BreadcrumbDropdownItem = ComponentProps<typeof Menu.Item> & {
  /** Optional stable key for React list reconciliation (not passed to `Menu.Item`). */
  key?: string;
};

export interface BreadcrumbItemProps extends useRender.ComponentProps<'a'> {
  /** Icon shown before the label. */
  leadingIcon?: ReactNode;
  /** Icon shown after the label. */
  trailingIcon?: ReactNode;
  /**
   * Whether the item is the current page. An active item renders as text, not a link.
   * @default false
   */
  active?: boolean;
  /**
   * Whether the item is disabled. A disabled item is not clickable and looks muted.
   * @default false
   */
  disabled?: boolean;
  /** Entries of a dropdown menu. Each entry takes the `Menu.Item` props and an optional `key`. The item then ignores `render` and `href`. */
  dropdownItems?: BreadcrumbDropdownItem[];
  /** CSS class applied to the `<li>` that wraps the item. */
  className?: string;
}

export const BreadcrumbItem = ({
  ref,
  render,
  children,
  className,
  leadingIcon,
  trailingIcon,
  active,
  disabled,
  href,
  dropdownItems,
  ...props
}: BreadcrumbItemProps) => {
  const label =
    leadingIcon || trailingIcon ? (
      <>
        {leadingIcon && (
          <span
            className={styles['breadcrumb-icon']}
            data-slot='breadcrumb-leading-icon'
          >
            {leadingIcon}
          </span>
        )}
        {children != null && (
          <span data-slot='breadcrumb-item-text'>{children}</span>
        )}
        {trailingIcon && (
          <span
            className={styles['breadcrumb-icon']}
            data-slot='breadcrumb-trailing-icon'
          >
            {trailingIcon}
          </span>
        )}
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

  const linkElement = useRender({
    defaultTagName: 'a',
    ref,
    render,
    props: mergeProps<'a'>(
      {
        className: cx(styles['breadcrumb-link']),
        href,
        children: label,
        'data-slot': 'breadcrumb-link'
      } as useRender.ComponentProps<'a'>,
      props
    )
  });

  if (dropdownItems && !disabled) {
    return (
      <li
        className={cx(styles['breadcrumb-item'], className)}
        data-slot='breadcrumb-item'
      >
        <Menu>
          <Menu.Trigger
            ref={ref as React.Ref<HTMLButtonElement>}
            className={styles['breadcrumb-dropdown-trigger']}
            data-slot='breadcrumb-dropdown-trigger'
            id={id}
            title={title}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
          >
            {label}
            <ChevronDownIcon
              className={styles['breadcrumb-dropdown-icon']}
              data-slot='breadcrumb-dropdown-icon'
            />
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
                  data-slot='breadcrumb-dropdown-item'
                  {...menuItemProps}
                />
              );
            })}
          </Menu.Content>
        </Menu>
      </li>
    );
  }

  if (disabled || active) {
    return (
      <li
        className={cx(styles['breadcrumb-item'], className)}
        data-slot='breadcrumb-item'
      >
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className={cx(
            styles['breadcrumb-link'],
            disabled && styles['breadcrumb-link-disabled'],
            active && styles['breadcrumb-link-active']
          )}
          data-slot='breadcrumb-link'
          {...(disabled && {
            'aria-disabled': 'true',
            'data-disabled': 'true'
          })}
          {...(active && { 'aria-current': 'page', 'data-active': 'true' })}
        >
          {label}
        </span>
      </li>
    );
  }

  return (
    <li
      className={cx(styles['breadcrumb-item'], className)}
      data-slot='breadcrumb-item'
    >
      {linkElement}
    </li>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
