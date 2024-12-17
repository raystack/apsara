import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from "react";

import styles from './indicator.module.css';

const indicator = cva(styles.indicator, {
  variants: {
    variant: {
      accent: styles["indicator-variant-accent"],
      warning: styles["indicator-variant-warning"],
      danger: styles["indicator-variant-danger"],
      success: styles["indicator-variant-success"],
      neutral: styles["indicator-variant-neutral"],
    }
  },
  defaultVariants: {
    variant: "accent",
  },
});

export interface IndicatorProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof indicator> {
  label?: string;
  children?: ReactNode;
}

export const Indicator = forwardRef<ElementRef<"div">, IndicatorProps>(
  ({ className, variant, label, children, ...props }, ref) => (
    <div className={styles.wrapper} ref={ref} {...props}>
      {children}
      <div className={indicator({ variant, className })}>
        {label ? <span className={styles.label}>{label}</span> : <span className={styles.dot} />}
      </div>
    </div>
  )
);

Indicator.displayName = 'Indicator';
