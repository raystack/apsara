import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

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

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, ...props }, forwardedRef) => (
    <SwitchPrimitive.Root
      {...props}
      ref={forwardedRef}
      className={switchVariants({ size, className })}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  )
);

Switch.displayName = 'Switch';
