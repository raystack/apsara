'use client';

import { ComboboxItem as AriakitComboboxItem } from '@ariakit/react';
import { cx } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useLayoutEffect
} from 'react';
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
    const value = String(providedValue);
    const {
      registerItem,
      unregisterItem,
      value: selectedValue,
      onValueChange,
      setOpen
    } = useComboboxContext();

    const isSelected = value === selectedValue;

    const handleClick = () => {
      if (disabled) return;
      onValueChange?.(value);
      setOpen(false);
    };

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

    return (
      <AriakitComboboxItem
        ref={ref}
        value={value}
        className={cx(styles.item, className)}
        disabled={disabled}
        aria-selected={isSelected}
        data-selected={isSelected}
        focusOnHover
        onClick={handleClick}
        {...props}
      >
        {element}
      </AriakitComboboxItem>
    );
  }
);
ComboboxItem.displayName = 'ComboboxItem';
