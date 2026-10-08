'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode, useLayoutEffect } from 'react';
import { CheckIcon } from '~/icons';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

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
        {leadingIcon && (
          <div className={styles.itemIcon} data-slot='select-item-icon'>
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
  const IndicatorPrimitive = autocomplete
    ? ComboboxPrimitive.ItemIndicator
    : SelectPrimitive.ItemIndicator;

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
          {multiple && <Checkbox checked={state.selected} />}
          {element}
          {!multiple && (
            <IndicatorPrimitive
              className={styles.itemIndicator}
              data-slot='select-item-indicator'
            >
              <CheckIcon aria-hidden='true' />
            </IndicatorPrimitive>
          )}
        </div>
      )}
    />
  );
}
SelectItem.displayName = 'Select.Item';
