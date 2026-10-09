'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import styles from './select.module.css';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import { ItemType } from './types';

type SelectValueRenderer = (item: ItemType | ItemType[]) => ReactNode;

export interface SelectValueProps
  extends Omit<ComponentProps<'span'>, 'children' | 'placeholder'> {
  /** Shown when nothing is selected. */
  placeholder?: ReactNode;
  /** Replaces the label. A function receives the selected item, or items in multiple mode. */
  children?: ReactNode | SelectValueRenderer;
}

const isEmpty = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && !value.length);

export function SelectValue({
  children,
  placeholder,
  className,
  ...props
}: SelectValueProps) {
  const { autocomplete, getItem, value } = useSelectContext();

  const renderSelected = (selected: string | string[]) => {
    const item = Array.isArray(selected)
      ? selected.map(getItem)
      : getItem(selected);
    if (typeof children === 'function') return children(item);
    if (children != null) return children;
    if (Array.isArray(item)) {
      return (
        <SelectMultipleValue
          data={item.map(i => ({ value: i.value, label: i.children }))}
        />
      );
    }
    return (
      <span className={styles.valueContent} data-slot='select-value-content'>
        {typeof item.children === 'string' && item.leadingIcon && (
          <span className={styles.itemIcon} data-slot='select-value-icon'>
            {item.leadingIcon}
          </span>
        )}
        {item.children}
      </span>
    );
  };

  const renderValue = (selected: string | string[] | null) =>
    isEmpty(selected)
      ? placeholder
      : renderSelected(selected as string | string[]);

  if (autocomplete) {
    return (
      <span
        data-placeholder={isEmpty(value) ? '' : undefined}
        data-slot='select-value'
        className={cx(styles.value, className)}
        {...props}
      >
        <ComboboxPrimitive.Value>{renderValue}</ComboboxPrimitive.Value>
      </span>
    );
  }

  return (
    <SelectPrimitive.Value
      placeholder={placeholder}
      data-slot='select-value'
      className={cx(styles.value, className)}
      {...props}
    >
      {renderValue}
    </SelectPrimitive.Value>
  );
}
SelectValue.displayName = 'Select.Value';
