import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ReactNode } from "react";

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
  "aria-label"?: string;
}

export const Indicator = ({ 
  className, 
  variant, 
  label, 
  children, 
  "aria-label": ariaLabel,
  ...props 
}: IndicatorProps) => {
  const accessibilityLabel = ariaLabel || label || `${variant} indicator`;

  return (
    <div className={styles.wrapper} {...props}>
      {children}
      <div 
        className={indicator({ variant, className })}
        role="status"
        aria-label={accessibilityLabel}
      >
        {label ? (
          <span 
            className={styles.label} 
            data-length={label.length.toString()}
          >
            {label}
          </span>
        ) : (
          <span 
            className={styles.dot} 
            aria-hidden="true" 
          />
        )}
      </div>
    </div>
  );
};

Indicator.displayName = 'Indicator';
