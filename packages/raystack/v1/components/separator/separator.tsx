import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef } from "react";
import styles from "./separator.module.css";

const separator = cva(styles.separator, {
  variants: {
    size: {
      small: styles["separator-small"],
      half: styles["separator-half"],
      full: styles["separator-full"],
    },
  },
  defaultVariants: {
    size: "full",
  },
});

interface SeparatorProps 
  extends ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separator> {}

export function Separator({
  className,
  orientation = "horizontal",
  size,
  "aria-label": ariaLabel,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative
      orientation={orientation}
      className={separator({ size, className })}
      aria-orientation={orientation}
      aria-label={ariaLabel || `${orientation} separator`}
      role="separator"
      {...props}
    />
  );
}

Separator.displayName = "Separator"; 