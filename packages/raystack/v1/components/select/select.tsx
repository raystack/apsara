import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { Text } from "../text";
import { TextProps } from "../text/text";
import styles from "./select.module.css";

interface AriaProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
}

interface TriggerStyleProps {
  style?: React.CSSProperties;
  className?: string;
  stopPropagation?: boolean;
}

export interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never;
  color?: string;
}

const trigger = cva(styles.trigger, {
  variants: {
    size: {
      small: styles["trigger-small"],
      medium: styles["trigger-medium"],
    },
    variant: {
      default: "",
      filter: styles["trigger-filter"],
    }
  },
  defaultVariants: {
    size: "medium",
    variant: "default",
  },
});

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    React.PropsWithChildren<VariantProps<typeof trigger>> & {
      iconProps?: IconProps;
    } &
    AriaProps &
    TriggerStyleProps
>(({ 
  size, 
  variant, 
  className, 
  children, 
  iconProps = {}, 
  'aria-label': ariaLabel,
  style,
  stopPropagation = false,
  ...props 
}, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={trigger({ size, variant, className })}
    aria-label={ariaLabel || 'Select option'}
    role="combobox"
    style={style}
    onPointerDown={(e) => {
      if (stopPropagation) {
        e.stopPropagation();
      }
    }}
    {...props}
  >
    {children}
    {variant !== 'filter' && (
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon 
          className={styles.triggerIcon} 
          aria-hidden="true"
          {...iconProps} 
        />
      </SelectPrimitive.Icon>
    )}
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
      role="listbox"
      onPointerDownOutside={(e) => {
        e.stopPropagation();
      }}
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
    role="option"
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
