'use client';

import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useCallback, useMemo } from 'react';
import styles from './select.module.css';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import { ItemType } from './types';

type ValueType = Omit<ItemType, 'children'>;

export type SelectValueProps = ComponentProps<'span'> & {
  placeholder?: string;
  children?: ((value?: ValueType | ValueType[]) => ReactNode) | ReactNode;
  className?: string;
};

export function SelectValue({
  children,
  placeholder,
  className,
  ...props
}: SelectValueProps) {
  const { value, items, multiple } = useSelectContext();

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : !!value;

  const getItem = useCallback(
    (v: string): ItemType =>
      items[v]?.value === v ? items[v] : { value: v, children: v },
    [items]
  );

  const item = useMemo(() => {
    if (!value) return undefined;
    if (multiple && Array.isArray(value)) {
      const itemValues = value.map(getItem);
      if (itemValues.length === 1) return itemValues[0];
      return itemValues;
    }
    return getItem(value as string);
  }, [value, multiple, getItem]);

  if (!hasValue) {
    return (
      <span
        data-placeholder=''
        data-slot='select-value'
        className={cx(styles.placeholder, className)}
        {...props}
      >
        {placeholder}
      </span>
    );
  }

  if (typeof children === 'function') {
    return (
      <span data-slot='select-value' className={className} {...props}>
        {children(item)}
      </span>
    );
  }

  if (children) {
    return (
      <span data-slot='select-value' className={className} {...props}>
        {children}
      </span>
    );
  }

  if (Array.isArray(item)) {
    return <SelectMultipleValue data={item} />;
  }

  return (
    <span data-slot='select-value' className={className} {...props}>
      <div className={cx(styles.valueContent)} data-slot='select-value-content'>
        {typeof item?.children === 'string' && item?.leadingIcon && (
          <div
            className={styles.itemIcon}
            data-slot='select-value-leading-icon'
          >
            {item.leadingIcon}
          </div>
        )}
        {item?.children ?? value}
      </div>
    </span>
  );
}
SelectValue.displayName = 'Select.Value';
