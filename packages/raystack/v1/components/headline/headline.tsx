import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

import styles from "./headline.module.css";

const headline = cva(styles.headline, {
  variants: {
    size: {
      t1: styles["headline-t1"],
      t2: styles["headline-t2"],
      t3: styles["headline-t3"],
      t4: styles["headline-t4"],
    },
    align: {
      left: styles["headline-align-left"],
      center: styles["headline-align-center"],
      right: styles["headline-align-right"],
    },
    truncate: {
      true: styles["headline-truncate"],
    },
  },
  defaultVariants: {
    size: "t1",
    align: "left",
    truncate: false,
  },
});

export type HeadlineBaseProps = VariantProps<typeof headline>;

type HeadlineProps = HeadlineBaseProps &
  HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };

export const Headline = forwardRef<HTMLHeadingElement, HeadlineProps>(
  (
    { className, size, align, truncate, as: Component = "h2", ...props },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={headline({ size, align, truncate, className })}
        {...props}
      />
    );
  },
);

Headline.displayName = "Headline";
