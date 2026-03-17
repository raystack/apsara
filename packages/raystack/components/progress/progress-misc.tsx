'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './progress.module.css';

export const ProgressLabel = forwardRef<
  ElementRef<typeof ProgressPrimitive.Label>,
  ProgressPrimitive.Label.Props
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Label
    ref={ref}
    className={cx(styles.label, className)}
    {...props}
  />
));

ProgressLabel.displayName = 'ProgressLabel';

export const ProgressValue = forwardRef<
  ElementRef<typeof ProgressPrimitive.Value>,
  ProgressPrimitive.Value.Props
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Value
    ref={ref}
    className={cx(styles.value, className)}
    {...props}
  />
));

ProgressValue.displayName = 'ProgressValue';
