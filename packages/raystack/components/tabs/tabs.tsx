'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from './tabs.module.css';

const tabsRoot = cva(styles.root, {
  variants: {
    variant: {
      segmented: styles['variant-segmented'],
      standalone: styles['variant-standalone'],
      plain: styles['variant-plain']
    },
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large']
    }
  },
  defaultVariants: {
    variant: 'segmented',
    size: 'large'
  }
});

type TabsRootProps = TabsPrimitive.Root.Props & VariantProps<typeof tabsRoot>;

function TabsRoot({ className, variant, size, ...props }: TabsRootProps) {
  return (
    <TabsPrimitive.Root
      className={cx(tabsRoot({ variant, size }), className)}
      {...props}
    />
  );
}
TabsRoot.displayName = 'Tabs.Root';

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List className={cx(styles.list, className)} {...props}>
      {children}
      <TabsPrimitive.Indicator className={styles.indicator} />
    </TabsPrimitive.List>
  );
}
TabsList.displayName = 'Tabs.List';

interface TabsTabProps extends TabsPrimitive.Tab.Props {
  leadingIcon?: ReactNode;
}

function TabsTab({ className, leadingIcon, children, ...props }: TabsTabProps) {
  return (
    <TabsPrimitive.Tab className={cx(styles.trigger, className)} {...props}>
      {leadingIcon && (
        <span className={styles['trigger-icon']} aria-hidden>
          {leadingIcon}
        </span>
      )}
      {children}
    </TabsPrimitive.Tab>
  );
}
TabsTab.displayName = 'Tabs.Tab';

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel className={cx(styles.content, className)} {...props} />
  );
}
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent
});
