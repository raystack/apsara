import React, { ComponentPropsWithoutRef } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styles from "./togglegroup.module.css";
import { cva, VariantProps } from "class-variance-authority";

const root = cva(styles.root);

export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof root>;

/*
 *  @deprecated Use Tabs from @raystack/apsara/v1 instead.
 */
export const ToggleGroupRoot = ({ className, ...props }: ToggleGroupProps) => {
  return (
    <ToggleGroupPrimitive.Root className={root({ className })} {...props} />
  );
};

ToggleGroupRoot.defaultProps = { type: "single" };

const item = cva(styles.item);

/*
 *  @deprecated Use Tabs from @raystack/apsara/v1 instead.
 */
export interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof item> {}

/*
 *  @deprecated Use Tabs from @raystack/apsara/v1 instead.
 */
export const ToggleGroupItem = ({
  className,
  ...props
}: ToggleGroupItemProps) => {
  return (
    <ToggleGroupPrimitive.Item className={item({ className })} {...props} />
  );
};

/*
 *  @deprecated Use Tabs from @raystack/apsara/v1 instead.
 */
export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
