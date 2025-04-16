import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useRef,
} from "react";
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
    const {
      autocomplete,
      searchValue,
      parentHasAutocomplete,
      parentSearchValue,
    } = useDropdownContext();
    const movedMouse = useRef(false);
    const menuLevel = useMenuLevel();
    console.log({
      children,
      autocomplete,
      parentHasAutocomplete,
      menuLevel,
      searchValue,
    });
    const item = (
      <DropdownMenuPrimitive.SubTrigger ref={ref} {...props} asChild>
        <Cell
          trailingIcon={trailingIcon}
          isComboboxCell={parentHasAutocomplete}>
          {children}
        </Cell>
      </DropdownMenuPrimitive.SubTrigger>
    );

    const computedValue = getValue(value, children);

    if (parentHasAutocomplete && !getMatch(computedValue, parentSearchValue))
      return null;
    if (parentHasAutocomplete)
      return <ComboboxItem value={value} render={item} />;
    return item;
  },
);
DropdownMenuSubMenuTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;
