'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CSSProperties, createContext } from 'react';
import styles from './meter.module.css';
import { MeterTrack } from './meter-track';

const meter = cva(styles.meter, {
  variants: {
    variant: {
      linear: '',
      circular: styles['meter-variant-circular']
    }
  },
  defaultVariants: {
    variant: 'linear'
  }
});

export interface MeterProps
  extends MeterPrimitive.Root.Props,
    VariantProps<typeof meter> {}

export interface MeterContextValue {
  variant: 'linear' | 'circular';
  value: number;
  percentage: number;
}

export const MeterContext = createContext<MeterContextValue>({
  variant: 'linear',
  value: 0,
  percentage: 0
});

export function MeterRoot({
  className,
  style = {},
  variant = 'linear',
  children = <MeterTrack />,
  value = 0,
  min = 0,
  max = 100,
  ...props
}: MeterProps) {
  const percentage = ((value - min) * 100) / (max - min);

  return (
    <MeterContext value={{ variant: variant ?? 'linear', value, percentage }}>
      <MeterPrimitive.Root
        className={meter({ variant, className })}
        style={
          {
            ...style,
            '--rs-meter-percentage': percentage
          } as CSSProperties
        }
        value={value}
        min={min}
        max={max}
        {...props}
      >
        {children}
      </MeterPrimitive.Root>
    </MeterContext>
  );
}

MeterRoot.displayName = 'Meter';
