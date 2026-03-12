'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';

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

const ToggleRoot = forwardRef<ElementRef<typeof TogglePrimitive>, ToggleProps>(
  ({ className, children, size, ...props }, ref) => (
    <TogglePrimitive
      ref={ref}
      className={toggleVariants({ size, className })}
      {...props}
    >
      <span className={styles.toggleContent}>{children}</span>
    </TogglePrimitive>
  )
);

ToggleRoot.displayName = 'Toggle';

const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive>,
  ToggleGroupPrimitive.Props
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cx(styles.group, className)}
    {...props}
  />
));

ToggleGroup.displayName = 'Toggle.Group';

export const Toggle = Object.assign(ToggleRoot, {
  Group: ToggleGroup
});
