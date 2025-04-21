import { forwardRef } from "react";
import { MenuButton, MenuButtonProps } from "@ariakit/react";
import { Slot } from "@radix-ui/react-slot";
import { DropdownMenuItem } from "./dropdown-menu-item";
import { CellBaseProps } from "./cell";
import { WithAsChild } from "./types";
import { TriangleRightIcon } from "~/v1/icons";

export interface DropdownMenuTriggerProps
  extends WithAsChild<MenuButtonProps> {}

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, asChild, ...props }, ref) => {
  return (
    <MenuButton ref={ref} render={asChild ? <Slot /> : undefined} {...props}>
      {children}
    </MenuButton>
  );
});

export interface DropdownMenuTriggerItemProps
  extends DropdownMenuTriggerProps,
    CellBaseProps {}

/**
 * @remarks
 * `TriggerItem` is a helper component that renders a `Trigger` as a `MenuItem`.
 */
export const DropdownMenuTriggerItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerItemProps
>(
  (
    { children, asChild, trailingIcon = <TriangleRightIcon />, ...props },
    ref,
  ) => {
    if (asChild)
      return (
        <DropdownMenuTrigger {...props} ref={ref} asChild>
          {children}
        </DropdownMenuTrigger>
      );

    return (
      <MenuButton
        ref={ref}
        {...props}
        render={<DropdownMenuItem trailingIcon={trailingIcon} />}>
        {children}
      </MenuButton>
    );
  },
);
