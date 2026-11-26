'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from './progress.module.css';

export function ProgressLabel({
  className,
  ...props
}: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cx(styles.label, className)}
      data-slot='progress-label'
      {...props}
    />
  );
}

ProgressLabel.displayName = 'Progress.Label';

type ProgressValueProps = ProgressPrimitive.Value.Props & {
  /** Renders the value. It receives the formatted value and the raw value. */
  children?:
    | null
    | ((formattedValue: string | null, value: number | null) => ReactNode);
};

export function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      className={cx(styles.value, className)}
      data-slot='progress-value'
      {...props}
    />
  );
}

ProgressValue.displayName = 'Progress.Value';
