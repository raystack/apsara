'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode, useLayoutEffect } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectItemProps extends SelectPrimitive.Item.Props {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function SelectItem({
  className,
  children,
  value: providedValue,
  leadingIcon,
  trailingIcon,
  disabled,
  ...props
}: SelectItemProps) {
  const value = String(providedValue);
  const {
    registerItem,
    unregisterItem,
    autocomplete,
    inputValue,
    value: selectValue,
    shouldFilter,
    hasItems,
    multiple
  } = useSelectContext();

  const isSelected = multiple
    ? selectValue?.includes(value)
    : value === selectValue;
  const isMatched = getMatch(value, children, inputValue);
  const isHidden = shouldFilter && !hasItems && isSelected && !isMatched;

  const element =
    typeof children === 'string' ? (
      <>
        {leadingIcon && (
          <div className={styles.itemIcon} data-slot='select-item-leading-icon'>
            {leadingIcon}
          </div>
        )}
        {autocomplete ? (
          <Text className={styles.itemText} data-slot='select-item-text'>
            {children}
          </Text>
        ) : (
          <SelectPrimitive.ItemText
            render={<Text />}
            className={styles.itemText}
            data-slot='select-item-text'
          >
            {children}
          </SelectPrimitive.ItemText>
        )}
        {trailingIcon && (
          <div
            className={cx(styles.itemIcon, styles.itemTrailingIcon)}
            data-slot='select-item-trailing-icon'
          >
            {trailingIcon}
          </div>
        )}
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
      data-slot='select-item'
      disabled={disabled || isHidden}
      {...props}
      render={(renderProps, state) => (
        <div {...renderProps}>
          {multiple && <Checkbox checked={state.selected} tabIndex={-1} />}
          {element}
        </div>
      )}
    />
  );
}
SelectItem.displayName = 'Select.Item';
