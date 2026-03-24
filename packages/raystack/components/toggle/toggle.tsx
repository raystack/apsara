'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, cx, type VariantProps } from 'class-variance-authority';

import styles from './toggle.module.css';

const toggleVariants = cva(styles.toggle, {
  variants: {
    size: {
      1: styles['size-1'],
      2: styles['size-2'],
      3: styles['size-3'],
      4: styles['size-4']
    }
  },
  defaultVariants: {
    size: 3
  }
});

export interface ToggleProps
  extends TogglePrimitive.Props,
    VariantProps<typeof toggleVariants> {
  size?: 1 | 2 | 3 | 4;
}

function ToggleRoot({ className, children, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive className={toggleVariants({ size, className })} {...props}>
      <span className={styles.toggleContent}>{children}</span>
    </TogglePrimitive>
  );
}

ToggleRoot.displayName = 'Toggle';

function ToggleGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive className={cx(styles.group, className)} {...props} />
  );
}

ToggleGroup.displayName = 'Toggle.Group';

export const Toggle = Object.assign(ToggleRoot, {
  Group: ToggleGroup
});
