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

interface SelectValueProps extends SelectPrimitive.SelectValueProps {
  leadingIcon?: React.ReactNode;
  placeholder?: string;
  selectedIcon?: React.ReactNode;
}

const trigger = cva(styles.trigger, {
  variants: {
    size: {
      small: styles["trigger-small"],
      medium: styles["trigger-medium"],
    },
    variant: {
      default: styles["trigger-default"],
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
      selectedIcon?: React.ReactNode;
    } &
    AriaProps &
    TriggerStyleProps
>(({ 
  size, 
  variant, 
  className, 
  children, 
  iconProps = {}, 
  selectedIcon,
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
    style={{
      ...style,
      display: 'flex',
      justifyContent: 'space-between'
    }}
    onPointerDown={(e) => {
      if (stopPropagation) {
        e.stopPropagation();
      }
    }}
    {...props}
  >
    <div className={styles.triggerContent}>
      {selectedIcon && (
        <div className={styles[`selectedIcon-${size || 'medium'}`]}>
          {selectedIcon}
        </div>
      )}
      {children}
    </div>
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon 
        className={styles.triggerIcon} 
        aria-hidden="true"
        {...iconProps} 
      />
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

const SelectIconContext = React.createContext<{
  icons: Record<string, React.ReactNode>;
  registerIcon: (value: string, icon: React.ReactNode) => void;
}>({
  icons: {},
  registerIcon: () => {}
});

const SelectRoot = ({ children, ...props }: SelectPrimitive.SelectProps) => {
  const [icons, setIcons] = React.useState<Record<string, React.ReactNode>>({});
  
  const registerIcon = React.useCallback((value: string, icon: React.ReactNode) => {
    setIcons(prev => ({ ...prev, [value]: icon }));
  }, []);
  
  return (
    <SelectIconContext.Provider value={{ icons, registerIcon }}>
      <SelectPrimitive.Root {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectIconContext.Provider>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    textProps?: TextProps;
    leadingIcon?: React.ReactNode;
  }
>(({ className, textProps = {}, children, leadingIcon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={menuitem({ className })}
    role="option"
    {...props}
  >
    {leadingIcon && <div className={styles.itemIcon}>{leadingIcon}</div>}
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

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  SelectValueProps
>(({ leadingIcon, children, placeholder, ...props }, ref) => (
  <SelectPrimitive.Value 
    ref={ref} 
    placeholder={placeholder}
    {...props}
  >
    <div 
      className={styles.valueContent}
      title={typeof children === 'string' ? children : undefined}
    >
      {leadingIcon && <div className={styles.leadingIcon}>{leadingIcon}</div>}
      {children}
    </div>
  </SelectPrimitive.Value>
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

export const Select = Object.assign(SelectRoot, {
  Group: SelectPrimitive.Group,
  Value: SelectValue,
  ScrollUpButton: SelectPrimitive.ScrollDownButton,
  ScrollDownButton: SelectPrimitive.ScrollDownButton,
  Viewport: SelectPrimitive.Viewport,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Separator: SelectSeparator,
});
