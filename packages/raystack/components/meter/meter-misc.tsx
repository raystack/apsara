'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './meter.module.css';

export function MeterLabel({
  className,
  ...props
}: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label className={cx(styles.label, className)} {...props} />
  );
}

MeterLabel.displayName = 'Meter.Label';

export function MeterValue({
  className,
  ...props
}: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value className={cx(styles.value, className)} {...props} />
  );
}

MeterValue.displayName = 'Meter.Value';
