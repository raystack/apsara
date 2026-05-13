import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';

import styles from './spinner.module.css';

const spinner = cva(styles.spinner, {
  variants: {
    size: {
      1: styles['spinner-size-1'],
      2: styles['spinner-size-2'],
      3: styles['spinner-size-3'],
      4: styles['spinner-size-4'],
      5: styles['spinner-size-5'],
      6: styles['spinner-size-6']
    },
    color: {
      default: styles['spinner-color-default'],
      neutral: styles['spinner-color-neutral'],
      accent: styles['spinner-color-accent'],
      danger: styles['spinner-color-danger'],
      success: styles['spinner-color-success'],
      attention: styles['spinner-color-attention']
    }
  },
  defaultVariants: {
    size: 1,
    color: 'neutral'
  }
});

export interface SpinnerProps
  extends ComponentProps<'div'>,
    VariantProps<typeof spinner> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: 'default' | 'neutral' | 'accent' | 'danger' | 'success' | 'attention';
  ariaLabel?: string;
}

export function Spinner({
  className,
  size,
  color,
  ariaLabel = 'Loading',
  'aria-label': ariaLabelStandard,
  'aria-hidden': ariaHidden,
  ...props
}: SpinnerProps) {
  const isDecorative = ariaHidden === true || ariaHidden === 'true';
  return (
    <div
      className={spinner({ size, color, className })}
      role={isDecorative ? undefined : 'status'}
      aria-label={isDecorative ? undefined : (ariaLabelStandard ?? ariaLabel)}
      aria-live={isDecorative ? undefined : 'polite'}
      aria-hidden={isDecorative || undefined}
      {...props}
    >
      {[...Array(8)].map((_, index) => (
        <div key={index} className={styles.pole} aria-hidden='true' />
      ))}
    </div>
  );
}

Spinner.displayName = 'Spinner';
