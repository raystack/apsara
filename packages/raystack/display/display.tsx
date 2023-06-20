import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./display.module.css";

const display = cva(styles.display, {
  variants: {
    size: {
      small: styles["display-small"],
      medium: styles["display-medium"],
      large: styles["display-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type DisplayProps = PropsWithChildren<VariantProps<typeof display>> &
  HTMLAttributes<HTMLSpanElement>;

export function Display({ children, className, size, ...props }: DisplayProps) {
  return (
    <span className={display({ size, className })} {...props}>
      {children}
    </span>
  );
}
