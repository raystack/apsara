import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef } from "react";
import styles from "./switch.module.css";

const switchVariants = cva(styles.switch);

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  disabled?: boolean;
  required?: boolean;
}

export const Switch = ({ 
  className,
  disabled,
  required,
  ref,
  ...props 
}: SwitchProps & { ref?: React.Ref<ComponentRef<typeof SwitchPrimitive.Root>> }) => (
  <SwitchPrimitive.Root
    {...props}
    ref={ref}
    disabled={disabled}
    required={required}
    className={switchVariants({ className })}
    data-disabled={disabled}
  >
    <SwitchThumb />
  </SwitchPrimitive.Root>
);

const thumbVariants = cva(styles.thumb);

interface ThumbProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb> {}

const SwitchThumb = ({ 
  className,
  ref,
  ...props 
}: ThumbProps & { ref?: React.Ref<ComponentRef<typeof SwitchPrimitive.Thumb>> }) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    className={thumbVariants({ className })}
    {...props}
  />
);

Switch.displayName = "Switch";
