import * as SelectPrimitive from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

export const SelectValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  SelectPrimitive.SelectValueProps
>(({ children, ...props }, ref) => {
  const { value } = useSelectContext();
  // console.log('value', value.item);

  // return (
  //   <SelectPrimitive.Value ref={ref} {...props}>
  //     {children}
  //   </SelectPrimitive.Value>
  // );

  // if (value?.item?.children) {
  //   return value.item.children;
  // }

  return (
    <div className={cx(styles.valueContent)}>
      {/* {value.item?.leadingIcon && (
        <div className={styles.leadingIcon}>{value.item.leadingIcon}</div>
      )} */}
      <SelectPrimitive.Value ref={ref} {...props}>
        {JSON.stringify(value) ?? children}
        {/* {value ?? children} */}
      </SelectPrimitive.Value>
    </div>
  );
});
SelectValue.displayName = SelectPrimitive.Value.displayName;
