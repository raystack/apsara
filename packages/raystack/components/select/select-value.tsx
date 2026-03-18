'use client';

import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode, useMemo } from 'react';
import styles from './select.module.css';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import { ItemType } from './types';

type ValueType = Omit<ItemType, 'children'>;

type SelectValueProps = {
  placeholder?: string;
  children?: ((value?: ValueType | ValueType[]) => ReactNode) | ReactNode;
  className?: string;
};

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ children, placeholder, className, ...props }, ref) => {
    const { value, items, multiple } = useSelectContext();

    const hasValue = multiple
      ? Array.isArray(value) && value.length > 0
      : !!value;

    const item = useMemo(() => {
      if (!value) return undefined;
      if (multiple && Array.isArray(value)) {
        const itemValues = value.map(v => items[v]);
        if (itemValues.length === 1) return itemValues[0];
        return itemValues;
      }
      return items[value as string];
    }, [value, items, multiple]);

    if (!hasValue) {
      return (
        <span
          ref={ref}
          data-placeholder=''
          className={cx(styles.placeholder, className)}
          {...props}
        >
          {placeholder}
        </span>
      );
    }

    if (typeof children === 'function') {
      return (
        <span ref={ref} className={className} {...props}>
          {children(item)}
        </span>
      );
    }

    if (children) {
      return (
        <span ref={ref} className={className} {...props}>
          {children}
        </span>
      );
    }

    if (Array.isArray(item)) {
      return <SelectMultipleValue data={item} />;
    }

    return (
      <span ref={ref} className={className} {...props}>
        <div className={cx(styles.valueContent)}>
          {typeof item?.children === 'string' && item?.leadingIcon && (
            <div className={styles.itemIcon}>{item.leadingIcon}</div>
          )}
          {item?.children ?? value}
        </div>
      </span>
    );
  }
);
SelectValue.displayName = 'Select.Value';
