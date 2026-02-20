'use client';

import { cx } from 'class-variance-authority';
import { Select as SelectPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef, useMemo } from 'react';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import styles from './select.module.css';
import { ItemType } from './types';

type ValueType = Omit<ItemType, 'children'>;

type SelectValueProps = Omit<SelectPrimitive.SelectValueProps, 'children'> & {
  children?: ((value?: ValueType | ValueType[]) => ReactNode) | ReactNode;
};

export const SelectValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  SelectValueProps
>(({ children, ...props }, ref) => {
  const { value, items, multiple } = useSelectContext();

  const item = useMemo(() => {
    if (!value) return undefined;
    if (multiple && Array.isArray(value)) {
      const itemValues = value.map(v => items[v]);
      if (itemValues.length === 1) return itemValues[0];
      return itemValues;
    }
    return items[value as string];
  }, [value, items, multiple]);

  if (children) {
    return (
      <SelectPrimitive.Value ref={ref} {...props}>
        {typeof children === 'function' ? children(item) : children}
      </SelectPrimitive.Value>
    );
  }

  if (Array.isArray(item))
    return <SelectMultipleValue data={item} ref={ref} {...props} />;

  return (
    <SelectPrimitive.Value ref={ref} {...props}>
      <div className={cx(styles.valueContent)}>
        {typeof item?.children === 'string' && item?.leadingIcon && (
          <div className={styles.itemIcon}>{item.leadingIcon}</div>
        )}
        {item?.children ?? value}
      </div>
    </SelectPrimitive.Value>
  );
});
SelectValue.displayName = SelectPrimitive.Value.displayName;
