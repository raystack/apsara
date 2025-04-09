import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cx } from "class-variance-authority";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import styles from "./dropdown-menu.module.css";

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cx(styles.label, className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cx(styles.separator, className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export const DropdownMenuGroup = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Group>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={cx(styles.menugroup, className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

export const DropdownMenuEmptyState = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cx(styles.empty, className)} {...props}>
    {children}
  </div>
));
DropdownMenuEmptyState.displayName = "DropdownMenuEmptyState";
