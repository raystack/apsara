'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cva, type VariantProps } from 'class-variance-authority';

import styles from './switch.module.css';

const switchVariants = cva(styles.switch, {
  variants: {
    size: {
      large: styles.large,
      small: styles.small
    }
  },
  defaultVariants: {
    size: 'large'
  }
});

export interface SwitchProps
  extends SwitchPrimitive.Root.Props,
    VariantProps<typeof switchVariants> {}

export function Switch({ className, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      {...props}
      className={switchVariants({ size, className })}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  );
}

Switch.displayName = 'Switch';
