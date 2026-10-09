'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { cx } from 'class-variance-authority';
import { ReactNode, useContext } from 'react';
import { CheckIcon } from '~/icons';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import {
  SelectRegistrationContext,
  useFilteredValues,
  useSelectContext
} from './select-root';

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
    autocomplete,
    searchValue,
    value: selectValue,
    shouldFilter,
    multiple,
    registerItem
  } = useSelectContext();
  const filteredValues = useFilteredValues();
  const registering = useContext(SelectRegistrationContext);

  useIsoLayoutEffect(
    () => registerItem({ value, children, leadingIcon }),
    [registerItem, value, children, leadingIcon]
  );

  if (registering) return null;

  // With `items`, Base UI filters by label and maps list positions to the
  // filtered items, so every unmatched item must leave the list.
  if (filteredValues && !filteredValues.has(value)) return null;

  const isSelected = multiple
    ? selectValue?.includes(value)
    : value === selectValue;
  const isMatched = getMatch(value, children, searchValue);
  const ownFilter = shouldFilter && !filteredValues;
  const isHidden = ownFilter && isSelected && !isMatched;

  if (ownFilter && !isMatched && !isSelected) {
    return null;
  }

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
