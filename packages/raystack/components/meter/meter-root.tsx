'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, type ElementRef, forwardRef } from 'react';
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

export const MeterRoot = forwardRef<
  ElementRef<typeof MeterPrimitive.Root>,
  MeterProps
>(
  (
    {
      className,
      style = {},
      variant = 'linear',
      children = <MeterTrack />,
      value = 0,
      min = 0,
      max = 100,
      ...props
    },
    ref
  ) => {
    const percentage = ((value - min) * 100) / (max - min);

    return (
      <MeterContext.Provider
        value={{ variant: variant ?? 'linear', value, percentage }}
      >
        <MeterPrimitive.Root
          ref={ref}
          className={meter({ variant, className })}
          style={
            {
              ...style,
              '--rs-meter-percentage': percentage
            } as React.CSSProperties
          }
          value={value}
          min={min}
          max={max}
          {...props}
        >
          {children}
        </MeterPrimitive.Root>
      </MeterContext.Provider>
    );
  }
);

MeterRoot.displayName = 'MeterRoot';
