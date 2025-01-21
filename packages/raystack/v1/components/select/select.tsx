import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text } from "../text";
import styles from "./select.module.css";
import { TextProps } from "../text/text";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

const trigger = cva(styles.trigger, {
  variants: {
    size: {
      small: styles["trigger-sm"],
      medium: styles["trigger-md"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    React.PropsWithChildren<VariantProps<typeof trigger>> & {
      iconProps?: IconProps;
    }
>(({ size, className, children, iconProps = {}, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={trigger({ size, className })}
    {...props}
  >
    {children}

    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className={styles.triggerIcon} {...iconProps} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const content = cva(styles.content);
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
    React.PropsWithChildren<VariantProps<typeof content>>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={content({ className })}
      position={position}
      {...props}
    >
      {children}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const menuitem = cva(styles.menuitem);
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    textProps?: TextProps;
  }
>(({ className, textProps = {}, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={menuitem({ className })}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <Text {...textProps}>{children}</Text>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const separator = cva(styles.separator);
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={separator({ className })}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export const Select = Object.assign(SelectPrimitive.Root, {
  Group: SelectPrimitive.Group,
  Value: SelectPrimitive.Value,
  ScrollUpButton: SelectPrimitive.ScrollDownButton,
  ScrollDownButton: SelectPrimitive.ScrollDownButton,
  Viewport: SelectPrimitive.Viewport,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Separator: SelectSeparator,
});
