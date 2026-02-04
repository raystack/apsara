import { Tabs as TabsPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import styles from './tabs.module.css';

const TabsRoot = forwardRef<HTMLDivElement, TabsPrimitive.Root.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={cx(styles.root, className)}
      {...props}
    />
  )
);
TabsRoot.displayName = 'Tabs.Root';

const TabsList = forwardRef<HTMLDivElement, TabsPrimitive.List.Props>(
  ({ className, children, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cx(styles.list, className)}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator className={styles.indicator} />
    </TabsPrimitive.List>
  )
);
TabsList.displayName = 'Tabs.List';

interface TabsTabProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Tab> {
  leadingIcon?: ReactNode;
}

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ className, leadingIcon, children, ...props }, ref) => (
    <TabsPrimitive.Tab
      ref={ref}
      className={cx(styles.trigger, className)}
      {...props}
    >
      {leadingIcon && (
        <span className={styles['trigger-icon']}>{leadingIcon}</span>
      )}
      {children}
    </TabsPrimitive.Tab>
  )
);
TabsTab.displayName = 'Tabs.Tab';

const TabsContent = forwardRef<HTMLDivElement, TabsPrimitive.Panel.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      className={cx(styles.content, className)}
      {...props}
    />
  )
);
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent
});
