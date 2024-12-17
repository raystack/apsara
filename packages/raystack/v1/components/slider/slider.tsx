import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from './slider.module.css';

const slider = cva(styles.slider, {
  variants: {
    size: {
      1: styles["slider-size-1"],
      2: styles["slider-size-2"],
      3: styles["slider-size-3"],
      4: styles["slider-size-4"],
      5: styles["slider-size-5"],
      6: styles["slider-size-6"],
    },
    color: {
      default: styles["slider-color-default"],
      inverted: styles["slider-color-inverted"],
    }
  },
  defaultVariants: {
    size: 1,
    color: "default",
  },
});

export interface SliderProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof slider> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: "default" | "inverted";
}

export const Slider = forwardRef<ElementRef<"div">, SliderProps>(
  ({ className, size, color, ...props }, ref) => (
    <div
      ref={ref}
      className={slider({ size, color, className })}
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

Slider.displayName = 'Slider';