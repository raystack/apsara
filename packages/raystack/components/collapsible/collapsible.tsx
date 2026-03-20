'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './collapsible.module.css';

function CollapsibleRoot(props: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root {...props} />;
}

CollapsibleRoot.displayName = 'Collapsible';

function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cx(styles.trigger, className)}
      {...props}
    />
  );
}

CollapsibleTrigger.displayName = 'Collapsible.Trigger';

function CollapsiblePanel({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      className={cx(styles.panel, className)}
      {...props}
    />
  );
}

CollapsiblePanel.displayName = 'Collapsible.Panel';

export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel
});
