import { ElementRef, forwardRef, Fragment } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cx } from "class-variance-authority";
import { useSelectContext } from "./select-root";
import styles from "./select.module.css";

export const SelectGroup = forwardRef<
  ElementRef<typeof SelectPrimitive.Group>,
  SelectPrimitive.SelectGroupProps
>(({ className, children, ...props }, ref) => {
  const { shouldFilter } = useSelectContext();

  if (shouldFilter) return <Fragment>{children}</Fragment>;

  return (
    <SelectPrimitive.Group
      ref={ref}
      className={cx(styles.menugroup, className)}
      {...props}>
      {children}
    </SelectPrimitive.Group>
  );
});
SelectGroup.displayName = SelectPrimitive.Group.displayName;

export const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  SelectPrimitive.SelectLabelProps
>(({ className, ...props }, ref) => {
  const { shouldFilter } = useSelectContext();

  if (shouldFilter) return null;

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  SelectPrimitive.SelectSeparatorProps
>(({ className, ...props }, ref) => {
  const { shouldFilter } = useSelectContext();

  if (shouldFilter) return null;
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cx(styles.separator, className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
