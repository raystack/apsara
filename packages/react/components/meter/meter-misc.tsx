'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from './meter.module.css';

export function MeterLabel({
  className,
  ...props
}: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      className={cx(styles.label, className)}
      data-slot='meter-label'
      {...props}
    />
  );
}

MeterLabel.displayName = 'Meter.Label';

type MeterValueProps = MeterPrimitive.Value.Props & {
  /** Renders the value. It receives the formatted value and the raw value. */
  children?: null | ((formattedValue: string, value: number) => ReactNode);
};

export function MeterValue({ className, ...props }: MeterValueProps) {
  return (
    <MeterPrimitive.Value
      className={cx(styles.value, className)}
      data-slot='meter-value'
      {...props}
    />
  );
}

MeterValue.displayName = 'Meter.Value';
