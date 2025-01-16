import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef } from "react";

import styles from "./radio.module.css";

const RadioRoot = ({ 
  className,
  ref,
  ...props 
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & 
   { ref?: React.Ref<ComponentRef<typeof RadioGroupPrimitive.Root>> }) => (
  <RadioGroupPrimitive.Root ref={ref} className={styles.radio} {...props} />
);

const radioItem = cva(styles.radioitem);

export interface RadioItemProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

export const RadioItem = ({ 
  className,
  ref,
  ...props 
}: RadioItemProps & 
   { ref?: React.Ref<ComponentRef<typeof RadioGroupPrimitive.Item>> }) => (
  <RadioGroupPrimitive.Item
    {...props}
    ref={ref}
    className={radioItem({ className })}
  >
    <Indicator />
  </RadioGroupPrimitive.Item>
);

const indicator = cva(styles.indicator);
export interface thumbProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>,
    VariantProps<typeof indicator> {}

const Indicator = ({ 
  className,
  ref,
  ...props 
}: thumbProps & 
   { ref?: React.Ref<ComponentRef<typeof RadioGroupPrimitive.Indicator>> }) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    className={indicator({ className })}
    {...props}
  />
);

Indicator.displayName = RadioGroupPrimitive.Indicator.displayName;

export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: Indicator,
  Item: RadioItem,
});
