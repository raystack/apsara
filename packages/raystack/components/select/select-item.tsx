'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode, useLayoutEffect } from 'react';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

const CheckMarkIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.9005 4.9671C12.0894 4.6782 12.0083 4.29086 11.7194 4.10197C11.4305 3.91307 11.0432 3.99414 10.8543 4.28304L7.15577 9.93961L5.04542 8.02112C4.79001 7.78893 4.39473 7.80775 4.16254 8.06316C3.93035 8.31857 3.94917 8.71385 4.20458 8.94605L6.85731 11.3576C6.99274 11.4807 7.17532 11.5383 7.35686 11.5151C7.53841 11.492 7.70068 11.3904 7.80084 11.2372L11.9005 4.9671Z'
      fill='currentColor'
    />
  </svg>
);

export interface SelectItemProps extends SelectPrimitive.Item.Props {
  leadingIcon?: ReactNode;
}

export function SelectItem({
  className,
  children,
  value: providedValue,
  leadingIcon,
  disabled,
  ...props
}: SelectItemProps) {
  const value = String(providedValue);
  const {
    registerItem,
    unregisterItem,
    autocomplete,
    searchValue,
    value: selectValue,
    shouldFilter,
    hasItems,
    multiple
  } = useSelectContext();

  const isSelected = multiple
    ? selectValue?.includes(value)
    : value === selectValue;
  const isMatched = getMatch(value, children, searchValue);
  const isHidden = shouldFilter && !hasItems && isSelected && !isMatched;

  const element =
    typeof children === 'string' ? (
      <>
        {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
        <Text>{children}</Text>
      </>
    ) : (
      children
    );

  useLayoutEffect(() => {
    registerItem({ leadingIcon, children, value });
    return () => {
      unregisterItem(value);
    };
  }, [value, children, registerItem, unregisterItem, leadingIcon]);

  if (shouldFilter && !hasItems && !isMatched && !isSelected) {
    return null;
  }

  const ItemPrimitive = autocomplete
    ? ComboboxPrimitive.Item
    : SelectPrimitive.Item;

  return (
    <ItemPrimitive
      value={value}
      className={cx(styles.menuitem, className, isHidden && styles.hidden)}
      data-hidden={isHidden || undefined}
      disabled={disabled || isHidden}
      {...props}
      render={(renderProps, state) => (
        <div {...renderProps}>
          {multiple && (
            <span
              className={styles.checkIndicator}
              data-checked={state.selected || undefined}
              aria-hidden='true'
            >
              {state.selected && <CheckMarkIcon />}
            </span>
          )}
          {element}
        </div>
      )}
    />
  );
}
SelectItem.displayName = 'Select.Item';
