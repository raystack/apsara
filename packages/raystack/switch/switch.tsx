import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from "./switch.module.css";

const switchVariants = cva(styles.switch);

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants>,
    SwitchPrimitive.SwitchProps {}

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, ...props }, forwardedRef) => (
  <SwitchPrimitive.Root
    {...props}
    ref={forwardedRef}
    className={switchVariants({ className })}
  >
    <SwitchThumb />
  </SwitchPrimitive.Root>
));

const thumb = cva(styles.thumb);
export interface thumbProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>,
    VariantProps<typeof thumb> {}

const SwitchThumb = forwardRef<
  ElementRef<typeof SwitchPrimitive.Thumb>,
  thumbProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={thumb({ className })}
    {...props}
  />
));

SwitchThumb.displayName = SwitchPrimitive.Thumb.displayName;
