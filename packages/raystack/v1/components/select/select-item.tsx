import { ElementRef, forwardRef, useEffect } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ComboboxItem } from "@ariakit/react";
import { cx } from "class-variance-authority";
import styles from "./select.module.css";
import { Text, TextProps } from "../text";
import { useSelectContext } from "./select-root";
import { getMatch } from "../dropdown-menu/utils";

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  Omit<SelectPrimitive.SelectItemProps, "asChild"> & {
    textProps?: TextProps;
    leadingIcon?: React.ReactNode;
  }
>(
  (
    {
      className,
      textProps = {},
      children,
      value,
      leadingIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const {
      registerIcon,
      unregisterIcon,
      autocomplete,
      autocompleteMode,
      searchValue,
      value: selectValue,
    } = useSelectContext();

    useEffect(() => {
      if (!leadingIcon) return;

      registerIcon(value, leadingIcon);
      return () => {
        unregisterIcon(value);
      };
    }, [value, leadingIcon]);

    const shouldFilter = !!(
      autocomplete &&
      autocompleteMode === "auto" &&
      searchValue?.length
    );

    const isSelected = value === selectValue.value;
    const isMatched = getMatch(value, children, searchValue);
    const isHidden = shouldFilter && isSelected && !isMatched;

    if (shouldFilter && !isMatched && !isSelected) {
      // Not selected and doesn't match search, so don't render at all
      return null;
    }

    const element = (
      <>
        {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
        <SelectPrimitive.ItemText>
          <Text {...textProps}>{children}</Text>
        </SelectPrimitive.ItemText>
      </>
    );

    return (
      <SelectPrimitive.Item
        ref={ref}
        value={value}
        className={cx(styles.menuitem, className, isHidden && styles.hidden)}
        data-hidden={isHidden}
        disabled={disabled || isHidden}
        asChild={autocomplete}
        {...props}>
        {autocomplete ? (
          <ComboboxItem
            onBlurCapture={event => {
              event.preventDefault();
            }}>
            {element}
          </ComboboxItem>
        ) : (
          element
        )}
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
