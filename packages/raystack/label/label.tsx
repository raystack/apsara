import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./label.module.css";

const label = cva(styles.label, {
  variants: {
    size: {
      small: styles["label-small"],
      medium: styles["label-medium"],
      large: styles["label-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type LabelProps = PropsWithChildren<VariantProps<typeof label>> &
  HTMLAttributes<HTMLLabelElement>;

export function Label({ children, className, size, ...props }: LabelProps) {
  return (
    <label className={label({ size, className })} {...props}>
      {children}
    </label>
  );
}
