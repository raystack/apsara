import { ElementRef, forwardRef } from "react";
import { MenuItem, MenuItemProps } from "@ariakit/react";
import { Cell, CellBaseProps } from "./cell";
import { WithAsChild } from "./types";
import { Slot } from "@radix-ui/react-slot";

export interface DropdownMenuItemProps
  extends WithAsChild<MenuItemProps>,
    CellBaseProps {}

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof MenuItem>,
  DropdownMenuItemProps
>(({ children, asChild, ...props }, ref) => {
  return (
    <MenuItem ref={ref} {...props} render={asChild ? <Slot /> : <Cell />}>
      {children}
    </MenuItem>
  );
});
