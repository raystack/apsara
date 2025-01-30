import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, PropsWithChildren } from "react";
import styles from "./separator.module.css";

const separator = cva(styles.separator, {
  variants: {
    size: {
      small: styles["separator-half"],
      half: styles["separator-half"],
      full: styles["separator-full"],
    },
  },
  defaultVariants: {
    size: "full",
  },
});

type SeparatorProps = PropsWithChildren<VariantProps<typeof separator>> &
  ComponentProps<typeof SeparatorPrimitive.Root>;

/**
 * @deprecated Use the new Separator from packages/raystack/v1 instead.
 */
export function Separator({
  children,
  size,
  className,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative
      className={separator({ size, className })}
      {...props}
    />
  );
}
