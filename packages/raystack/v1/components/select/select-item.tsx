import { ComboboxItem } from '@ariakit/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef, useLayoutEffect, useMemo } from 'react';
import { getMatch } from '../dropdown-menu/utils';
import { Text } from '../text';
import { useSelectContext } from './select-root';
import styles from './select.module.css';

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  Omit<SelectPrimitive.SelectItemProps, 'asChild'> & {
    // textProps?: TextProps;
    leadingIcon?: React.ReactNode;
  }
>(
  (
    {
      className,
      // textProps = {},
      children,
      value,
      leadingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      // registerIcon,
      // unregisterIcon,
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

    const element = useMemo(() => {
      if (typeof children === 'string') {
        return (
          <>
            {leadingIcon && (
              <div className={styles.itemIcon}>{leadingIcon}</div>
            )}
            <Text>{children}</Text>
          </>
        );
      }
      return children;
    }, [leadingIcon, children]);

    useLayoutEffect(() => {
      registerItem({ leadingIcon, children: element, value });
      return () => {
        unregisterItem(value);
      };
      // console.log('item use effect', element);
      // registerIcon(value, leadingIcon, element);
      // return () => {
      //   unregisterIcon(value);
      // };
    }, [value, element, registerItem, unregisterItem, leadingIcon]);

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
        {...props}
      >
        {autocomplete ? (
          <ComboboxItem
            onBlurCapture={event => {
              event.preventDefault();
            }}
          >
            {element}
          </ComboboxItem>
        ) : (
          element
        )}
      </SelectPrimitive.Item>
    );
  }
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
