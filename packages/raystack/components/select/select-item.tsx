'use client';

import {
  Combobox as ComboboxPrimitive,
  Select as SelectPrimitive
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode, useLayoutEffect } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../dropdown-menu/utils';
import { Text } from '../text';
import styles from './select.module.css';
import { useSelectContext } from './select-root';

export interface SelectItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  leadingIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
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
    const registryKey = String(providedValue);
    const {
      mode,
      registerItem,
      unregisterItem,
      inputValue,
      hasItems,
      multiple
    } = useSelectContext();

    useLayoutEffect(() => {
      registerItem({ leadingIcon, children, value: providedValue });
      return () => {
        unregisterItem(registryKey);
      };
    }, [
      registryKey,
      providedValue,
      children,
      registerItem,
      unregisterItem,
      leadingIcon
    ]);

    const element =
      typeof children === 'string' ? (
        <>
          {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
          <Text>{children}</Text>
        </>
      ) : (
        children
      );

    if (mode === 'combobox') {
      // Client-side filtering when items prop not provided
      if (!hasItems && inputValue?.length) {
        const isMatched = getMatch(registryKey, children, inputValue);
        if (!isMatched) return null;
      }

      return (
        <ComboboxPrimitive.Item
          ref={ref}
          value={providedValue}
          className={cx(styles.menuitem, className)}
          disabled={disabled}
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

    return (
      <SelectPrimitive.Item
        ref={ref as React.Ref<HTMLDivElement>}
        value={providedValue}
        className={cx(styles.menuitem, className)}
        disabled={disabled}
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
