import { mergeProps } from '@base-ui/react';
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
  /**
   * Pulses the badge to mark a live or active state.
   * @default false
   */
  pulse?: boolean;
  children?: ReactNode;
  'aria-label'?: string;
  /** Props for the inner parts. */
  slotProps?: {
    container?: ComponentProps<'div'>;
  };
  /** @deprecated Use `slotProps` instead. */
  classNames?: {
    /** @deprecated Use `slotProps.container` instead. */
    container?: string;
  };
}

export const Indicator = ({
  className,
  slotProps,
  classNames,
  variant,
  pulse,
  label,
  children,
  'aria-label': ariaLabel,
  ...props
}: IndicatorProps) => {
  const accessibilityLabel = ariaLabel || label || `${variant} indicator`;

  return (
    <div
      data-slot='indicator'
      {...mergeProps<'div'>(
        { className: cx(styles.wrapper, classNames?.container) },
        slotProps?.container,
        props
      )}
    >
      {children}
      <div
        className={indicator({ variant, className })}
        role='status'
        aria-label={accessibilityLabel}
        data-slot='indicator-badge'
      >
        {pulse && (
          <span
            className={styles.pulse}
            aria-hidden='true'
            data-slot='indicator-pulse'
          />
        )}
        {label ? (
          <span
            className={styles.label}
            data-length={label.length.toString()}
            data-slot='indicator-label'
          >
            {label}
          </span>
        ) : (
          <span
            className={styles.dot}
            aria-hidden='true'
            data-slot='indicator-dot'
          />
        )}
      </div>
    </div>
  );
};

Indicator.displayName = 'Indicator';
