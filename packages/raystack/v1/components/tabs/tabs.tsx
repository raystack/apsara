import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";

import styles from "./tabs.module.css";

const root = cva(styles.root);
const list = cva(styles.list);
const trigger = cva(styles.trigger);
const content = cva(styles.content);

interface TabsRootProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof root> {
  defaultValue?: string;
  'aria-label'?: string;
}

interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: ReactNode;
}

const TabsRoot = ({ 
  className,
  'aria-label': ariaLabel,
  ref,
  ...props 
}: TabsRootProps & { ref?: React.Ref<ComponentRef<typeof TabsPrimitive.Root>> }) => (
  <TabsPrimitive.Root
    ref={ref}
    className={root({ className })}
    aria-label={ariaLabel || "Tabs"}
    {...props}
  />
);

const TabsList = ({ 
  className,
  ref,
  ...props 
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List> & 
   { ref?: React.Ref<ComponentRef<typeof TabsPrimitive.List>> }) => (
  <TabsPrimitive.List
    ref={ref}
    role="tablist"
    className={list({ className })}
    {...props}
  />
);

const TabsTrigger = ({ 
  className,
  icon,
  children,
  disabled,
  ref,
  ...props 
}: TabsTriggerProps & { ref?: React.Ref<ComponentRef<typeof TabsPrimitive.Trigger>> }) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={trigger({ className })}
    disabled={disabled}
    aria-disabled={disabled}
    {...props}
  >
    {icon && <span className={styles["trigger-icon"]}>{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
);

const TabsContent = ({ 
  className,
  ref,
  ...props 
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & 
   { ref?: React.Ref<ComponentRef<typeof TabsPrimitive.Content>> }) => (
  <TabsPrimitive.Content
    ref={ref}
    role="tabpanel"
    className={content({ className })}
    {...props}
  />
);

TabsRoot.displayName = TabsPrimitive.Root.displayName;
TabsList.displayName = TabsPrimitive.List.displayName;
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsContent.displayName = TabsPrimitive.Content.displayName;

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}; 