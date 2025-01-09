import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from "react";

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
  disabled?: boolean;
}

const TabsRoot = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsRootProps>(
  ({ className, 'aria-label': ariaLabel, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={root({ className })}
      aria-label={ariaLabel || "Tabs"}
      {...props}
    />
  )
);

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    role="tablist"
    className={list({ className })}
    {...props}
  />
));

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, icon, children, disabled, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={trigger({ className })}
    aria-disabled={disabled}
    {...props}
  >
    {icon && <span className={styles["trigger-icon"]}>{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
));

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    role="tabpanel"
    className={content({ className })}
    {...props}
  />
));

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