import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from './sidepanel.module.css';

const sidepanel = cva(styles.sidepanel, {
  variants: {
    size: {
      1: styles["sidepanel-size-1"],
      2: styles["sidepanel-size-2"],
      3: styles["sidepanel-size-3"],
      4: styles["sidepanel-size-4"],
      5: styles["sidepanel-size-5"],
      6: styles["sidepanel-size-6"],
    },
    color: {
      default: styles["sidepanel-color-default"],
      inverted: styles["sidepanel-color-inverted"],
    }
  },
  defaultVariants: {
    size: 1,
    color: "default",
  },
});

export interface SpinnerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof sidepanel> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "default" | "inverted";
}

export const Sidepanel = forwardRef<ElementRef<"div">, SpinnerProps>(
  ({ className, size, color, ...props }, ref) => (
    <div
      ref={ref}
      className={sidepanel({ size, color, className })}
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

Sidepanel.displayName = 'Sidepanel';
