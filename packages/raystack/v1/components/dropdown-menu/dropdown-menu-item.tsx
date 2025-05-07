import { forwardRef } from "react";
import { MenuItem, MenuItemProps, useMenuContext } from "@ariakit/react";
import { ComboboxItem, ComboboxItemProps } from "@ariakit/react";
import { Cell, CellBaseProps } from "./cell";
import { WithAsChild } from "./types";
import { Slot } from "@radix-ui/react-slot";
import { useDropdownContext } from "./dropdown-menu-root";
import { getMatch } from "./utils";

export interface DropdownMenuItemProps
  extends WithAsChild<MenuItemProps>,
    CellBaseProps {
  forceRender?: "combobox" | "auto";
  value?: string;
}

export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ children, asChild, forceRender, value, ...props }, ref) => {
  const { autocomplete, searchValue, shouldFilter } = useDropdownContext();
  const menu = useMenuContext();

  const defaultProps: MenuItemProps = {
    ref,
    focusOnHover: true,
    blurOnHoverEnd: false,
    render: asChild ? <Slot /> : <Cell />,
    ...props,
  };

  // In auto mode, hide items that don't match the search value
  if (!forceRender && shouldFilter && !getMatch(value, children, searchValue)) {
    return null;
  }

  if (forceRender === "combobox" || autocomplete) {
    const comboboxProps = defaultProps as ComboboxItemProps;
    return (
      <ComboboxItem
        {...comboboxProps}
        value={value}
        setValueOnClick={false}
        selectValueOnClick={false}
        hideOnClick={event => {
          // Make sure that clicking on a combobox item that opens a nested
          // menu/dialog does not close the menu.
          const expandable = event.currentTarget.hasAttribute("aria-expanded");
          if (expandable) return false;
          // By default, clicking on a ComboboxItem only closes its own popover.
          // However, since we're in a menu context, we also close all parent
          // menus.
          menu?.hideAll();
          return true;
        }}>
        {children}
      </ComboboxItem>
    );
  }

  return <MenuItem {...defaultProps}>{children}</MenuItem>;
});
