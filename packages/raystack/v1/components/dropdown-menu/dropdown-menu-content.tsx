import { ElementRef, forwardRef } from "react";
import { Menu, MenuProps, useMenuContext } from "@ariakit/react";
import { cx } from "class-variance-authority";
import styles from "./dropdown-menu.module.css";
import { WithAsChild } from "./types";
import { Slot } from "@radix-ui/react-slot";

export interface MenuContentProps
  extends Omit<WithAsChild<MenuProps>, "portal"> {}

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof Menu>,
  MenuContentProps
>(({ className, children, asChild, ...props }, ref) => {
  const menu = useMenuContext();
  const isSubMenu = !!menu?.parent;

  return (
    <Menu
      ref={ref}
      modal
      portal
      portalElement={
        typeof window === "undefined" ? null : window?.document?.body
      }
      unmountOnHide
      gutter={isSubMenu ? 2 : 4}
      className={cx(styles.content, className)}
      render={asChild ? <Slot /> : undefined}
      {...props}>
      {children}
    </Menu>
  );
});
