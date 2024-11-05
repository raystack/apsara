import React from 'react';
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from './spinner.module.css';

const spinner = cva(styles.spinner, {
  variants: {
    size: {
      1: styles["spinner-size-1"],
      2: styles["spinner-size-2"],
      3: styles["spinner-size-3"],
      4: styles["spinner-size-4"],
      5: styles["spinner-size-5"],
      6: styles["spinner-size-6"],
    },
    color: {
      default: styles["spinner-color-default"],
      inverted: styles["spinner-color-inverted"],
    }
  },
  defaultVariants: {
    size: 1,
    color: "default",
  },
});

export interface SpinnerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof spinner> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "default" | "inverted";
}

export const Spinner = forwardRef<ElementRef<"div">, SpinnerProps>(
  ({ className, size, color, ...props }, ref) => (
    <div
      ref={ref}
      className={spinner({ size, color, className })}
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

Spinner.displayName = 'Spinner';
