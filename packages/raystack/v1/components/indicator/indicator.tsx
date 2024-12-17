import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from './indicator.module.css';

const indicator = cva(styles.indicator, {
  variants: {
    size: {
      1: styles["indicator-size-1"],
      2: styles["indicator-size-2"],
      3: styles["indicator-size-3"],
      4: styles["indicator-size-4"],
      5: styles["indicator-size-5"],
      6: styles["indicator-size-6"],
    },
    color: {
      default: styles["indicator-color-default"],
      inverted: styles["indicator-color-inverted"],
    }
  },
  defaultVariants: {
    size: 1,
    color: "default",
  },
});

export interface IndicatorProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof indicator> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "default" | "inverted";
}

export const Indicator = forwardRef<ElementRef<"div">, IndicatorProps>(
  ({ className, size, color, ...props }, ref) => (
    <div
      ref={ref}
      className={indicator({ size, color, className })}
      role="status"
      aria-hidden="true"
      {...props}
    >
      {[...Array(8)].map((_, index) => (
        <div key={index} className={styles.pole} />
      ))}
    </div>
  )
);

Indicator.displayName = 'Indicator';
