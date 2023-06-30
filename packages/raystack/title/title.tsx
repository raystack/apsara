import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./title.module.css";

const title = cva(styles.title, {
  variants: {
    size: {
      small: styles["title-small"],
      medium: styles["title-medium"],
      large: styles["title-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type TitleProps = PropsWithChildren<VariantProps<typeof title>> &
  HTMLAttributes<HTMLSpanElement>;

export function Title({ children, className, size, ...props }: TitleProps) {
  return (
    <span className={title({ size, className })} {...props}>
      {children}
    </span>
  );
}
