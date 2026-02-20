'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';
import { Checkbox } from '../checkbox';
import { getMatch } from '../menu/utils';
import { Text } from '../text';
import styles from './combobox.module.css';
import { useComboboxContext } from './combobox-root';

export interface ComboboxItemProps extends ComboboxPrimitive.Item.Props {
  leadingIcon?: ReactNode;
}

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    {
      className,
      children,
      value: providedValue,
      leadingIcon,
      disabled,
      render,
      ...props
    },
    ref
  ) => {
    const value = providedValue
      ? providedValue
      : typeof children === 'string'
        ? children
        : undefined;

    const { multiple, inputValue, hasItems } = useComboboxContext();

    // When items prop is not provided on Root, use custom filtering
    if (!hasItems && inputValue?.length) {
      const isMatched = getMatch(value, children, inputValue);
      if (!isMatched) return null;
    }

    const element =
      typeof children === 'string' ? (
        <>
          {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
          <Text>{children}</Text>
        </>
      ) : (
        children
      );

    return (
      <ComboboxPrimitive.Item
        ref={ref}
        value={value}
        className={cx(styles.menuitem, className)}
        disabled={disabled}
        {...props}
        render={
          render
            ? render
            : (renderProps, state) => (
                <div {...renderProps}>
                  {multiple && <Checkbox checked={state.selected} />}
                  {element}
                </div>
              )
        }
      />
    );
  }
);
ComboboxItem.displayName = 'Combobox.Item';
