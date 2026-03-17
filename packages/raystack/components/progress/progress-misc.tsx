'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './progress.module.css';

export function ProgressLabel({
  className,
  ...props
}: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cx(styles.label, className)}
      {...props}
    />
  );
}

ProgressLabel.displayName = 'Progress.Label';

export function ProgressValue({
  className,
  ...props
}: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cx(styles.value, className)}
      {...props}
    />
  );
}

ProgressValue.displayName = 'Progress.Value';
