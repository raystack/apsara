import * as SelectPrimitive from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef, useMemo } from 'react';
import { SelectMultipleValue } from './select-multiple-value';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

export const SelectValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  SelectPrimitive.SelectValueProps
>(({ children, ...props }, ref) => {
  const { value, items, multiple } = useSelectContext();

  const item = useMemo(() => {
    if (!value) return;
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
        {children}
      </SelectPrimitive.Value>
    );
  }

  if (Array.isArray(item))
    return <SelectMultipleValue data={item} ref={ref} {...props} />;

  return (
    <div className={cx(styles.valueContent)}>
      {typeof item?.children === 'string' && item?.leadingIcon && (
        <div className={styles.itemIcon}>{item.leadingIcon}</div>
      )}
      <SelectPrimitive.Value ref={ref} {...props}>
        {item?.children ?? value}
      </SelectPrimitive.Value>
    </div>
  );
});
SelectValue.displayName = SelectPrimitive.Value.displayName;
