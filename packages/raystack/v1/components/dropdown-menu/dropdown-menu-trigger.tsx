import { forwardRef } from "react";
import { MenuButton, MenuButtonProps } from "@ariakit/react";
import { Slot } from "@radix-ui/react-slot";
import { DropdownMenuItem, DropdownMenuItemProps } from "./dropdown-menu-item";
import { WithAsChild } from "./types";
import { TriangleRightIcon } from "@raystack/apsara/icons";
import { useDropdownContext } from "./dropdown-menu-root";
import { getMatch } from "./utils";

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

export interface DropdownMenuTriggerItemProps extends DropdownMenuItemProps {}

/**
 * `TriggerItem` is a helper component that renders a `Trigger` as a `MenuItem`.
 */
export const DropdownMenuTriggerItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerItemProps
>(
  (
    { children, value, trailingIcon = <TriangleRightIcon />, ...props },
    ref,
  ) => {
    const { parent } = useDropdownContext();

    if (
      parent?.shouldFilter &&
      !getMatch(value, children, parent?.searchValue)
    ) {
      return null;
    }

    return (
      <MenuButton
        ref={ref}
        render={
          <DropdownMenuItem
            value={value}
            trailingIcon={trailingIcon}
            {...props}
            forceRender={parent?.autocomplete ? "combobox" : "auto"}
          />
        }>
        {children}
      </MenuButton>
    );
  },
);
