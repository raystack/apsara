import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./body.module.css";

const body = cva(styles.body, {
  variants: {
    size: {
      small: styles["body-small"],
      medium: styles["body-medium"],
      large: styles["body-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type BodyProps = PropsWithChildren<VariantProps<typeof body>> &
  HTMLAttributes<HTMLSpanElement>;

export function Body({ children, className, size, ...props }: BodyProps) {
  return (
    <span className={body({ size, className })} {...props}>
      {children}
    </span>
  );
}
