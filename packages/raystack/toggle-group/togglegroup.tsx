import React, { ComponentPropsWithoutRef } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styles from "./togglegroup.module.css";
import { cva, VariantProps } from "class-variance-authority";

const root = cva(styles.root);

export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof root>;

export const ToggleGroupRoot = ({ className, ...props }: ToggleGroupProps) => {
  return (
    <ToggleGroupPrimitive.Root className={root({ className })} {...props} />
  );
};

const item = cva(styles.item);

export interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof item> {}

export const ToggleGroupItem = ({
  className,
  ...props
}: ToggleGroupItemProps) => {
  return (
    <ToggleGroupPrimitive.Item className={item({ className })} {...props} />
  );
};

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
