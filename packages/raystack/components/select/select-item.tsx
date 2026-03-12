'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode, useLayoutEffect } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectItemProps {
  className?: string;
  children?: ReactNode;
  value: string;
  leadingIcon?: ReactNode;
  disabled?: boolean;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      className,
      children,
      value: providedValue,
      leadingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const value = String(providedValue);
    const {
      registerItem,
      unregisterItem,
      autocomplete,
      searchValue,
      value: selectValue,
      shouldFilter,
      hasItems,
      multiple
    } = useSelectContext();

    const isSelected = multiple
      ? selectValue?.includes(value)
      : value === selectValue;
    const isMatched = getMatch(value, children, searchValue);
    const isHidden = shouldFilter && !hasItems && isSelected && !isMatched;

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

    if (shouldFilter && !hasItems && !isMatched && !isSelected) {
      return null;
    }

    const ItemPrimitive = autocomplete
      ? ComboboxPrimitive.Item
      : SelectPrimitive.Item;

    return (
      <ItemPrimitive
        ref={ref}
        value={value}
        className={cx(styles.menuitem, className, isHidden && styles.hidden)}
        data-hidden={isHidden || undefined}
        disabled={disabled || isHidden}
        {...props}
        render={(renderProps, state) => (
          <div {...renderProps}>
            {multiple && <Checkbox checked={state.selected} />}
            {element}
          </div>
        )}
      />
    );
  }
);
SelectItem.displayName = 'Select.Item';
