import { cva, cx, VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import styles from './indicator.module.css';

const indicator = cva(styles.indicator, {
  variants: {
    /** Color of the indicator. */
    color: {
      accent: styles['indicator-color-accent'],
      attention: styles['indicator-color-attention'],
      danger: styles['indicator-color-danger'],
      success: styles['indicator-color-success'],
      neutral: styles['indicator-color-neutral']
    }
  },
  defaultVariants: {
    color: 'accent'
  }
});

export interface IndicatorProps
  extends Omit<ComponentProps<'div'>, 'color'>,
    VariantProps<typeof indicator> {
  /** Text shown in the badge. Without it, the badge shows a dot. */
  label?: string;
  /**
   * Pulses the badge to mark a live or active state.
   * @default false
   */
  pulse?: boolean;
  /** Content that the indicator sits on. */
  children?: ReactNode;
  /** Accessible name of the badge. Defaults to `label`, otherwise `"Indicator"`. */
  'aria-label'?: string;
  /** CSS class applied to the badge. */
  className?: string;
  /** @deprecated Use the `data-slot` selectors instead. */
  classNames?: {
    /** @deprecated Use `[data-slot="indicator"]` instead. */
    container?: string;
  };
}

export const Indicator = ({
  className,
  classNames,
  color,
  pulse,
  label,
  children,
  'aria-label': ariaLabel,
  ...props
}: IndicatorProps) => {
  const accessibilityLabel = ariaLabel || label || 'Indicator';

  return (
    <div
      className={cx(styles.wrapper, classNames?.container)}
      data-slot='indicator'
      {...props}
    >
      {children}
      <div
        className={indicator({ color, className })}
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
