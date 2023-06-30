import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentPropsWithoutRef } from "react";
import styles from "./tabs.module.css";

const root = cva(styles.root);
export interface TabsRootProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof root> {}

const TabsRoot = ({ className, ...props }: TabsRootProps) => (
  <TabsPrimitive.Root className={root({ className })} {...props} />
);

TabsRoot.displayName = TabsPrimitive.Root.displayName;

const tablist = cva(styles.tablist, {
  variants: {
    underline: {
      true: styles["tablist-underline"],
    },
    elevated: {
      true: styles["tablist-elevated"],
    },
  },
});
export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tablist> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, underline, elevated, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={tablist({ underline, elevated, className })}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const content = cva(styles.content);
export interface ContentProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof content> {}

const TabsContent = ({ className, ...props }: ContentProps) => (
  <TabsPrimitive.Content className={content({ className })} {...props} />
);

TabsContent.displayName = TabsPrimitive.Content.displayName;

const trigger = cva(styles.trigger);
export interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof trigger> {}

const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => (
  <TabsPrimitive.Trigger className={trigger({ className })} {...props} />
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const Tabs = Object.assign(TabsRoot, {
  Trigger: TabsTrigger,
  Content: TabsContent,
  List: TabsList,
});
