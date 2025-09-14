import { VariantProps, cva, cx } from 'class-variance-authority';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';

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
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    { className, disabled, required, size, name, value, ...props },
    forwardedRef
  ) => (
    <>
      <SwitchPrimitive.Root
        {...props}
        ref={forwardedRef}
        disabled={disabled}
        required={required}
        className={switchVariants({ size, className })}
        data-disabled={disabled}
      >
        <SwitchThumb />
      </SwitchPrimitive.Root>
      {name && (
        <input
          type='hidden'
          name={name}
          value={value || 'on'}
          disabled={disabled}
        />
      )}
    </>
  )
);

interface ThumbProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb> {}

const SwitchThumb = forwardRef<
  ElementRef<typeof SwitchPrimitive.Thumb>,
  ThumbProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={cx(styles.thumb, className)}
    {...props}
  />
));

Switch.displayName = 'Switch';
