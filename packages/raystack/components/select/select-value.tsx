'use client';

import { Select as SelectPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode, useMemo } from 'react';
import styles from './select.module.css';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import { ItemType } from './types';

type ValueType = Omit<ItemType, 'children'>;

interface SelectValueProps {
  placeholder?: string;
  children?: ((value?: ValueType | ValueType[]) => ReactNode) | ReactNode;
  className?: string;
}

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ children, placeholder, ...props }, ref) => {
    const { value, items, multiple, mode } = useSelectContext();

    const item = useMemo(() => {
      if (!value) return undefined;
      if (multiple && Array.isArray(value)) {
        const itemValues = value.map(v => items[v]).filter(Boolean);
        if (itemValues.length === 1) return itemValues[0];
        return itemValues;
      }
      return items[value as string];
    }, [value, items, multiple]);

    // Combobox mode: render value display directly (no Select.Value primitive)
    if (mode === 'combobox') {
      if (children) {
        return (
          <span ref={ref} {...props}>
            {typeof children === 'function' ? children(item) : children}
          </span>
        );
      }

      if (Array.isArray(item)) {
        return <SelectMultipleValue data={item} ref={ref} {...props} />;
      }

      if (!value || (Array.isArray(value) && value.length === 0)) {
        return (
          <span ref={ref} className={styles.placeholder} {...props}>
            {placeholder}
          </span>
        );
      }

      return (
        <span ref={ref} {...props}>
          <div className={cx(styles.valueContent)}>
            {typeof item?.children === 'string' && item?.leadingIcon && (
              <div className={styles.itemIcon}>{item.leadingIcon}</div>
            )}
            {item?.children ?? value}
          </div>
        </span>
      );
    }

    // Select mode: use Base UI Select.Value
    if (children) {
      return (
        <SelectPrimitive.Value ref={ref} placeholder={placeholder} {...props}>
          {typeof children === 'function' ? children(item) : children}
        </SelectPrimitive.Value>
      );
    }

    if (Array.isArray(item)) {
      return <SelectMultipleValue data={item} ref={ref} {...props} />;
    }

    return (
      <SelectPrimitive.Value ref={ref} placeholder={placeholder} {...props}>
        {item ? (
          <div className={cx(styles.valueContent)}>
            {typeof item.children === 'string' && item.leadingIcon && (
              <div className={styles.itemIcon}>{item.leadingIcon}</div>
            )}
            {item.children ?? value}
          </div>
        ) : null}
      </SelectPrimitive.Value>
    );
  }
);
SelectValue.displayName = 'Select.Value';
