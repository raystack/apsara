import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Cell, CellBaseProps } from "./cell";
import { useDropdownContext, useMenuLevel } from "./dropdown-menu-root";
import { ComboboxItem } from "@ariakit/react";
import { getMatch, getValue } from "./utils";

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    Omit<CellBaseProps, "type"> & {
      value?: string;
    }
>(({ children, value, disabled, ...props }, ref) => {
  const { autocomplete, searchValue, parentHasAutocomplete } =
    useDropdownContext();
  const menuLevel = useMenuLevel();
  console.log({
    children,
    autocomplete,
    parentHasAutocomplete,
    menuLevel,
    searchValue,
  });

  const item = (
    <DropdownMenuPrimitive.Item
      ref={ref}
      {...props}
      disabled={disabled}
      asChild
      // onPointerMove={event => event.preventDefault()}
      // onPointerLeave={event => event.preventDefault()}
    >
      <Cell isComboboxCell={autocomplete}>{children}</Cell>
    </DropdownMenuPrimitive.Item>
  );

  const computedValue = getValue(value, children);

  if (autocomplete && !getMatch(computedValue, searchValue)) return null;

  if (autocomplete)
    return <ComboboxItem render={item} value={value} disabled={disabled} />;

  return item;
});

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> &
    Omit<CellBaseProps, "type">
>(({ children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} {...props} asChild>
    <Cell type="select">{children}</Cell>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
