'use client';

import { ComboboxItem as AriakitComboboxItem } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxItemProps
  extends ComponentPropsWithoutRef<typeof AriakitComboboxItem> {
  leadingIcon?: React.ReactNode;
}

export const ComboboxItem = forwardRef<
  ElementRef<typeof AriakitComboboxItem>,
  ComboboxItemProps
>(
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
    const value = providedValue
      ? String(providedValue)
      : typeof children === 'string'
        ? children
        : undefined;
    const { multiple, value: comboboxValue, inputValue } = useComboboxContext();

    const isSelected = multiple
      ? comboboxValue?.includes(value ?? '')
      : value === comboboxValue;
    const isMatched = getMatch(value, children, inputValue);

    const element =
      typeof children === 'string' ? (
        <>
          {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
          <Text>{children}</Text>
        </>
      ) : (
        children
      );

    if (inputValue?.length && !isMatched) {
      // Doesn't match search, so don't render at all
      return null;
    }

    return (
      <AriakitComboboxItem
        ref={ref}
        value={value}
        className={cx(styles.menuitem, className)}
        focusOnHover
        aria-selected={isSelected}
        data-selected={isSelected}
        resetValueOnSelect={multiple}
        {...props}
      >
        {multiple && <Checkbox checked={isSelected} />}
        {element}
      </AriakitComboboxItem>
    );
  }
);
ComboboxItem.displayName = 'ComboboxItem';
