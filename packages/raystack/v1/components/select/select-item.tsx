import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
} from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cx } from "class-variance-authority";
import styles from "./select.module.css";
import { Text, TextBaseProps } from "../text";
import { useSelectContext } from "./select-root";

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    textProps?: TextBaseProps;
    leadingIcon?: React.ReactNode;
  }
>(
  (
    { className, textProps = {}, children, value, leadingIcon, ...props },
    ref,
  ) => {
    const { registerIcon, unregisterIcon } = useSelectContext();

    useEffect(() => {
      if (!leadingIcon) return;

      registerIcon(value, leadingIcon);
      return () => {
        unregisterIcon(value);
      };
    }, [value, leadingIcon]);

    return (
      <SelectPrimitive.Item
        ref={ref}
        value={value}
        className={cx(styles.menuitem, className)}
        {...props}>
        {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
        <SelectPrimitive.ItemText>
          <Text {...textProps}>{children}</Text>
        </SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = SelectPrimitive.Item.displayName;
