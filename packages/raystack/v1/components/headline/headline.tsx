import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

import styles from "./headline.module.css";

const headline = cva(styles.headline, {
  variants: {
    size: {
      small: styles["headline-small"],
      medium: styles["headline-medium"],
      large: styles["headline-large"],
    },
    align: {
      left: styles["headline-align-left"],
      center: styles["headline-align-center"],
      right: styles["headline-align-right"],
    },
    truncate: {
      true: styles["headline-truncate"],
    }
  },
  defaultVariants: {
    size: "small",
    align: "left",
    truncate: false,
  },
});

type HeadlineProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headline> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    "aria-label"?: string;
  };

export const Headline = forwardRef<HTMLHeadingElement, HeadlineProps>(
  ({ className, size, align, truncate, as: Component = "h2", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={headline({ size, align, truncate, className })}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Headline.displayName = "Headline"; 