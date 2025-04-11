import { ElementRef, forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import styles from "./select.module.css";
import { useSelectContext } from "./select-root";
import { cx } from "class-variance-authority";

export const SelectValue = forwardRef<
  ElementRef<typeof SelectPrimitive.Value>,
  SelectPrimitive.SelectValueProps
>(({ children, ...props }, ref) => {
  const { value } = useSelectContext();
  const leadingIcon = value?.icon;

  return (
    <div className={cx(styles.valueContent)}>
      {leadingIcon && <div className={styles.leadingIcon}>{leadingIcon}</div>}
      <SelectPrimitive.Value ref={ref} {...props}>
        {children}
      </SelectPrimitive.Value>
    </div>
  );
});
SelectValue.displayName = SelectPrimitive.Value.displayName;
