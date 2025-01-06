import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from "./switch.module.css";

const switchVariants = cva(styles.switch);

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  disabled?: boolean;
  required?: boolean;
}

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, disabled, required, ...props }, forwardedRef) => (
  <SwitchPrimitive.Root
    {...props}
    ref={forwardedRef}
    disabled={disabled}
    required={required}
    className={switchVariants({ className })}
    data-disabled={disabled}
  >
    <SwitchThumb />
  </SwitchPrimitive.Root>
));

const thumbVariants = cva(styles.thumb);

interface ThumbProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb> {}

const SwitchThumb = forwardRef<
  ElementRef<typeof SwitchPrimitive.Thumb>,
  ThumbProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={thumbVariants({ className })}
    {...props}
  />
));

Switch.displayName = "Switch";
