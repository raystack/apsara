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

interface SelectItemProps extends SelectPrimitive.SelectItemProps {
  leadingIcon?: React.ReactNode;
  textProps?: TextProps;
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
    {variant !== "filter" && (
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

// We need to make sure our context properly tracks the selected value and icon
const SelectIconContext = React.createContext<{
  icons: Record<string, React.ReactNode>;
  registerIcon: (value: string, icon: React.ReactNode) => void;
}>({
  icons: {},
  registerIcon: () => {}
});

// Updated Root component that manages the icon mapping
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

// Updated Item component that registers its icon on mount
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, textProps = {}, leadingIcon, children, value, ...props }, ref) => {
  const { registerIcon } = React.useContext(SelectIconContext);
  
  // Register this item's icon when the component mounts
  React.useEffect(() => {
    if (leadingIcon && value) {
      registerIcon(value, leadingIcon);
    }
  }, [leadingIcon, value, registerIcon]);
  
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={menuitem({ className })}
      role="option"
      value={value}
      {...props}
    >
      {leadingIcon && (
        <span className={styles['menuitem-icon']}>
          {leadingIcon}
        </span>
      )}
      <SelectPrimitive.ItemText>
        <Text {...textProps}>{children}</Text>
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  SelectValueProps
>(({ leadingIcon, children, placeholder, ...props }, ref) => {
  const { icons } = React.useContext(SelectIconContext);
  const currentValue = String(children || '');
  const selectedIcon = currentValue ? icons[currentValue] : null;
  
  return (
    <SelectPrimitive.Value ref={ref} placeholder={placeholder} {...props}>
      <span className={styles.valueContent} data-placeholder={!children}>
        {selectedIcon && (
          <span className={styles.leadingIcon}>
            {selectedIcon}
          </span>
        )}
        {children || placeholder}
      </span>
    </SelectPrimitive.Value>
  );
});

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

// Export the component with updated subcomponents
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
