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
      7: styles["spinner-size-7"],
      8: styles["spinner-size-8"],
      9: styles["spinner-size-9"],
    },
  },
  defaultVariants: {
    size: 1,
  },
});

export interface SpinnerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof spinner> {
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export const Spinner = forwardRef<ElementRef<"div">, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={spinner({ size, className })}
      role="status"
      aria-hidden="true"
      {...props}
    >
      {[...Array(8)].map((_, index) => (
        <div key={index} className={styles.pole} />
      ))}
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  )
);

Spinner.displayName = 'Spinner';

