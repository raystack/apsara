import { ComboboxItem } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef, useLayoutEffect } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../dropdown-menu/utils';
import { Text } from '../text';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  Omit<SelectPrimitive.SelectItemProps, 'asChild'> & {
    leadingIcon?: React.ReactNode;
  }
>(({ className, children, value, leadingIcon, disabled, ...props }, ref) => {
  const {
    registerItem,
    unregisterItem,
    autocomplete,
    searchValue,
    value: selectValue,
    shouldFilter,
    multiple
  } = useSelectContext();

  const isSelected = multiple
    ? selectValue?.includes(value)
    : value === selectValue;
  const isMatched = getMatch(value, children, searchValue);
  const isHidden = shouldFilter && isSelected && !isMatched;

  const element =
    typeof children === 'string' ? (
      <>
        {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
        <Text>{children}</Text>
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

  if (shouldFilter && !isMatched && !isSelected) {
    // Not selected and doesn't match search, so don't render at all
    return null;
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cx(styles.menuitem, className, isHidden && styles.hidden)}
      data-hidden={isHidden}
      disabled={disabled || isHidden}
      asChild={autocomplete}
      aria-selected={isSelected}
      data-checked={isSelected}
      {...props}
    >
      {autocomplete ? (
        <ComboboxItem
          clickOnEnter={false}
          clickOnSpace={false}
          onBlurCapture={event => {
            event.preventDefault();
          }}
        >
          {multiple && <Checkbox checked={isSelected} />}
          {element}
        </ComboboxItem>
      ) : (
        <>
          {multiple && <Checkbox checked={isSelected} />}
          {element}
        </>
      )}
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
