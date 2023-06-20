import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./headline.module.css";

const headline = cva(styles.headline, {
  variants: {
    size: {
      small: styles["headline-small"],
      medium: styles["headline-medium"],
      large: styles["headline-large"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type HeadlineProps = PropsWithChildren<VariantProps<typeof headline>> &
  HTMLAttributes<HTMLSpanElement>;

export function Headline({
  children,
  className,
  size,
  ...props
}: HeadlineProps) {
  return (
    <span className={headline({ size, className })} {...props}>
      {children}
    </span>
  );
}
