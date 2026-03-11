'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef } from 'react';
import styles from './meter.module.css';

export const MeterLabel = forwardRef<
  ElementRef<typeof MeterPrimitive.Label>,
  MeterPrimitive.Label.Props
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Label
    ref={ref}
    className={cx(styles.label, className)}
    {...props}
  />
));

MeterLabel.displayName = 'MeterLabel';

export const MeterValue = forwardRef<
  ElementRef<typeof MeterPrimitive.Value>,
  MeterPrimitive.Value.Props
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Value
    ref={ref}
    className={cx(styles.value, className)}
    {...props}
  />
));

MeterValue.displayName = 'MeterValue';
