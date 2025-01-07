import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import styles from "./dropdown-menu.module.css";

const content = cva(styles.content);
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
    React.PropsWithChildren<VariantProps<typeof content>>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={content({ className })}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const menuitem = cva(styles.menuitem);
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  } & React.PropsWithChildren<VariantProps<typeof menuitem>>
>(({ className, children, leadingIcon, trailingIcon, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={menuitem({ className })}
    {...props}
  >
    {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
    {children}
    {trailingIcon && <span className={styles.trailingIcon}>{trailingIcon}</span>}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const label = cva(styles.label);
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> &
    React.PropsWithChildren<VariantProps<typeof label>>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={label({ className })}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const separator = cva(styles.separator);
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> &
    React.PropsWithChildren<VariantProps<typeof separator>>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={separator({ className })}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const menugroup = cva(styles.menugroup);
const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group> &
    React.PropsWithChildren<VariantProps<typeof menugroup>>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={menugroup({ className })}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

const emptystate = cva(styles.empty);
const DropdownMenuEmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={emptystate({ className })} {...props}>
    {children}
  </div>
));
DropdownMenuEmptyState.displayName = "DropdownMenuEmptyState";

type DropdownMenuProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Root
>;
export function RootDropdownMenu({ children, ...props }: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
}

export const DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger: DropdownMenuPrimitive.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  EmptyState: DropdownMenuEmptyState
});
