import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ComponentRef, ElementType, ReactNode } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import styles from "./dropdown-menu.module.css";

export interface DropdownMenuProps extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
  trigger: ReactNode;
}

export const DropdownMenu = ({ 
  children, 
  trigger,
  ref,
  ...props 
}: DropdownMenuProps & { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Root>> }) => {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      <DropdownMenuPrimitive.Trigger className={styles.trigger} asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          className={styles.content}
          sideOffset={5}
          align="start"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  icon?: ReactNode;
  shortcut?: string;
  as?: ElementType;
}

export const DropdownMenuItem = ({ 
  className, 
  children, 
  icon, 
  shortcut, 
  as: Component = "div",
  ref,
  ...props 
}: DropdownMenuItemProps & { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Item>> }) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={styles.item}
      {...props}
      asChild
    >
      <Component className={className}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
        {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
      </Component>
    </DropdownMenuPrimitive.Item>
  );
};

export interface DropdownMenuSubProps extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub> {
  trigger: ReactNode;
}

export const DropdownMenuSub = ({ 
  children, 
  trigger,
  ref,
  ...props 
}: DropdownMenuSubProps & { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Sub>> }) => {
  return (
    <DropdownMenuPrimitive.Sub {...props}>
      <DropdownMenuPrimitive.SubTrigger className={styles.subTrigger}>
        {trigger}
        <ChevronRightIcon className={styles.subTriggerIcon} />
      </DropdownMenuPrimitive.SubTrigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.SubContent
          ref={ref}
          className={styles.subContent}
          sideOffset={2}
          alignOffset={-5}
        >
          {children}
        </DropdownMenuPrimitive.SubContent>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Sub>
  );
};

export const DropdownMenuSeparator = ({ 
  className,
  ref,
  ...props 
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & 
   { ref?: React.Ref<ComponentRef<typeof DropdownMenuPrimitive.Separator>> }) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={styles.separator}
    {...props}
  />
);

DropdownMenu.displayName = "DropdownMenu";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuSub.displayName = "DropdownMenuSub";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
