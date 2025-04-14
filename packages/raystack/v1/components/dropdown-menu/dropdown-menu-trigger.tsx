import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComboboxItem } from "@ariakit/react";
import { useDropdownContext, useMenuLevel } from "./dropdown-menu-root";
import { TriangleRightIcon } from "~/v1/icons";
import { Cell, CellBaseProps } from "./cell";
import { getMatch, getValue } from "./utils";

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuSubMenuTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> &
    Omit<CellBaseProps, "type"> & {
      value?: string;
    }
>(
  (
    { children, value, trailingIcon = <TriangleRightIcon />, ...props },
    ref,
  ) => {
    const { autocomplete, searchValue } = useDropdownContext();
    const menuLevel = useMenuLevel();

    const item = (
      <DropdownMenuPrimitive.SubTrigger ref={ref} {...props} asChild>
        <Cell trailingIcon={trailingIcon} isComboboxCell={autocomplete}>
          {children}
        </Cell>
      </DropdownMenuPrimitive.SubTrigger>
    );
    if ((autocomplete && menuLevel >= 3) || (!autocomplete && menuLevel >= 2))
      return item;

    const computedValue = getValue(value, children);

    if (autocomplete && !getMatch(computedValue, searchValue)) return null;
    if (autocomplete) return <ComboboxItem value={value} render={item} />;
    return item;
  },
);
DropdownMenuSubMenuTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;
