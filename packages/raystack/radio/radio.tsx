import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from "./radio.module.css";

/**
 * @deprecated Use RadioRootProps from '@raystack/apsara/v1' instead.
 */
const RedioRoot = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={styles.radio} {...props} />
));

const radioItem = cva(styles.radioitem, {
  variants: {
    size: {
      small: styles["radioitem-small"],
      medium: styles["radioitem-medium"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

/**
 * @deprecated Use RadioItemProps from '@raystack/apsara/v1' instead.
 */
export interface RadioItemProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItem> {}

/**
 * @deprecated Use RadioItem from '@raystack/apsara/v1' instead.
 */
export const RadioItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(({ className, size, ...props }, forwardedRef) => (
  <RadioGroupPrimitive.Item
    {...props}
    ref={forwardedRef}
    className={radioItem({ size, className })}
  >
    <Indicator />
  </RadioGroupPrimitive.Item>
));

const indicator = cva(styles.indicator);

/**
 * @deprecated Use thumbProps from '@raystack/apsara/v1' instead.
 */
export interface thumbProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>,
    VariantProps<typeof indicator> {}

const Indicator = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Indicator>,
  thumbProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    className={indicator({ className })}
    {...props}
  />
));

Indicator.displayName = RadioGroupPrimitive.Indicator.displayName;

/**
 * @deprecated Use Radio from '@raystack/apsara/v1' instead.
 */
export const Radio = Object.assign(RedioRoot, {
  Indicator: Indicator,
  Item: RadioItem,
});
