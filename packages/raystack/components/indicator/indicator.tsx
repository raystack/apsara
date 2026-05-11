import { cva, cx, VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import styles from './indicator.module.css';

const indicator = cva(styles.indicator, {
  variants: {
    variant: {
      accent: styles['indicator-variant-accent'],
      warning: styles['indicator-variant-warning'],
      danger: styles['indicator-variant-danger'],
      success: styles['indicator-variant-success'],
      neutral: styles['indicator-variant-neutral']
    }
  },
  defaultVariants: {
    variant: 'accent'
  }
});

export interface IndicatorProps
  extends ComponentProps<'div'>,
    VariantProps<typeof indicator> {
  label?: string;
  children?: ReactNode;
  'aria-label'?: string;
  classNames?: {
    container?: string;
  };
}

export const Indicator = ({
  className,
  classNames,
  variant,
  label,
  children,
  'aria-label': ariaLabel,
  ...props
}: IndicatorProps) => {
  const accessibilityLabel = ariaLabel || label || `${variant} indicator`;

  return (
    <div className={cx(styles.wrapper, classNames?.container)} {...props}>
      {children}
      <div
        className={indicator({ variant, className })}
        role='status'
        aria-label={accessibilityLabel}
      >
        {label ? (
          <span className={styles.label} data-length={label.length.toString()}>
            {label}
          </span>
        ) : (
          <span className={styles.dot} aria-hidden='true' />
        )}
      </div>
    </div>
  );
};

Indicator.displayName = 'Indicator';
