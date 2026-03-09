'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './collapsible.module.css';

const CollapsibleRoot = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsiblePrimitive.Root.Props
>((props, ref) => <CollapsiblePrimitive.Root ref={ref} {...props} />);

CollapsibleRoot.displayName = 'Collapsible';

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsiblePrimitive.Trigger.Props
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cx(styles.trigger, className)}
    {...props}
  />
));

CollapsibleTrigger.displayName = 'Collapsible.Trigger';

const CollapsiblePanel = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Panel>,
  CollapsiblePrimitive.Panel.Props
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={cx(styles.panel, className)}
    {...props}
  />
));

CollapsiblePanel.displayName = 'Collapsible.Panel';

export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel
});
