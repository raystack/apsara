import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import styles from "./dropdown-menu.module.css";
import { ComponentRef } from "react";

const content = cva(styles.content);
const DropdownMenuContent = ({ 
  className, 
  sideOffset = 4, 
  ref, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & 
   React.PropsWithChildren<VariantProps<typeof content>> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Content>> }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={content({ className })}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const menuitem = cva(styles.menuitem);
const DropdownMenuItem = ({ 
  className, 
  children, 
  leadingIcon, 
  trailingIcon, 
  ref, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & 
   { leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode; } & 
   React.PropsWithChildren<VariantProps<typeof menuitem>> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Item>> }) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={menuitem({ className })}
    {...props}
  >
    {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
    {children}
    {trailingIcon && <span className={styles.trailingIcon}>{trailingIcon}</span>}
  </DropdownMenuPrimitive.Item>
);

const label = cva(styles.label);
const DropdownMenuLabel = ({ 
  className, 
  ref, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & 
   React.PropsWithChildren<VariantProps<typeof label>> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Label>> }) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={label({ className })}
    {...props}
  />
);

const separator = cva(styles.separator);
const DropdownMenuSeparator = ({ 
  className, 
  ref, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & 
   React.PropsWithChildren<VariantProps<typeof separator>> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Separator>> }) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={separator({ className })}
    {...props}
  />
);

const menugroup = cva(styles.menugroup);
const DropdownMenuGroup = ({ 
  className, 
  ref, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group> & 
   React.PropsWithChildren<VariantProps<typeof menugroup>> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Group>> }) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={menugroup({ className })}
    {...props}
  />
);

const emptystate = cva(styles.empty);
const DropdownMenuEmptyState = ({ 
  className, 
  children, 
  ref,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  ref?: React.Ref<ComponentRef<"div">>;
}) => (
  <div ref={ref} className={emptystate({ className })} {...props}>
    {children}
  </div>
);
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