import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import {
  HTMLAttributes,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  cloneElement,
  forwardRef
} from 'react';
import { DropdownMenu } from '../dropdown-menu';
import styles from './breadcrumb.module.css';

export interface BreadcrumbDropdownItem {
  label: string;
  onClick?: ReactEventHandler<HTMLDivElement>;
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
        <span>{children}</span>
      </>
    );

    if (dropdownItems) {
      return (
        <DropdownMenu>
          <DropdownMenu.Trigger
            className={styles['breadcrumb-dropdown-trigger']}
          >
            {label}
            <ChevronDownIcon className={styles['breadcrumb-dropdown-icon']} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className={styles['breadcrumb-dropdown-content']}
          >
            {dropdownItems.map((dropdownItem, dropdownIndex) => (
              <DropdownMenu.Item
                key={dropdownIndex}
                className={styles['breadcrumb-dropdown-item']}
                onSelect={dropdownItem?.onClick}
              >
                {dropdownItem.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
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
