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

type SelectValueRenderer = (value: string | string[]) => ReactNode;

export interface SelectValueProps
  extends Omit<ComponentProps<'span'>, 'children' | 'placeholder'> {
  /** Shown when nothing is selected. */
  placeholder?: ReactNode;
  /** Replaces the label. A function receives the selected value. */
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
  const { multiple, autocomplete, getLabel, value } = useSelectContext();

  const renderSelected = (selected: string | string[]) => {
    if (typeof children === 'function') return children(selected);
    if (children != null) return children;
    if (Array.isArray(selected)) {
      return (
        <SelectMultipleValue
          data={selected.map(v => ({ value: v, label: getLabel(v) }))}
        />
      );
    }
    return getLabel(selected);
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

  const useDefaultLabel = !multiple && children == null;

  return (
    <SelectPrimitive.Value
      placeholder={placeholder}
      data-slot='select-value'
      className={cx(styles.value, className)}
      {...props}
    >
      {useDefaultLabel ? undefined : renderValue}
    </SelectPrimitive.Value>
  );
}
SelectValue.displayName = 'Select.Value';
