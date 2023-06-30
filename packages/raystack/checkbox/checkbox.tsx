import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Flex } from "~/flex";
import { Label } from "~/label";
import styles from "./checkbox.module.css";

const checkbox = cva(styles.checkbox, {
  variants: {
    size: {
      small: styles["checkbox-sm"],
      medium: styles["checkbox-md"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkbox> {}

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, children, ...props }, forwardedRef) => (
  <Flex gap="small">
    <CheckboxPrimitive.Root
      {...props}
      ref={forwardedRef}
      className={checkbox({ size, className })}
    >
      <CheckboxIndicator>
        <CheckIcon />
      </CheckboxIndicator>
    </CheckboxPrimitive.Root>
    <Label>{children}</Label>
  </Flex>
));

const indicator = cva(styles.indicator);
export interface IndicatorProps
  extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>,
    VariantProps<typeof indicator> {}

const CheckboxIndicator = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Indicator>,
  IndicatorProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    className={indicator({ className })}
    {...props}
  />
));

CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;
