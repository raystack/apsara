'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, type ElementRef, forwardRef } from 'react';
import styles from './progress.module.css';
import { ProgressTrack } from './progress-track';

const progress = cva(styles.progress, {
  variants: {
    variant: {
      linear: '',
      circular: styles['progress-variant-circular']
    }
  },
  defaultVariants: {
    variant: 'linear'
  }
});

export interface ProgressProps
  extends ProgressPrimitive.Root.Props,
    VariantProps<typeof progress> {}

export interface ProgressContextValue {
  variant: 'linear' | 'circular';
  value: number | null;
  percentage: number;
}

export const ProgressContext = createContext<ProgressContextValue>({
  variant: 'linear',
  value: 0,
  percentage: 0
});

export const ProgressRoot = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      style = {},
      variant = 'linear',
      children = <ProgressTrack />,
      value = 0,
      min = 0,
      max = 100,
      ...props
    },
    ref
  ) => {
    const percentage = value === null ? 0 : ((value - min) * 100) / (max - min);

    return (
      <ProgressContext.Provider
        value={{ variant: variant ?? 'linear', value, percentage }}
      >
        <ProgressPrimitive.Root
          ref={ref}
          className={progress({ variant, className })}
          style={
            {
              ...style,
              '--rs-progress-percentage': percentage
            } as React.CSSProperties
          }
          value={value}
          min={min}
          max={max}
          {...props}
        >
          {children}
        </ProgressPrimitive.Root>
      </ProgressContext.Provider>
    );
  }
);

ProgressRoot.displayName = 'ProgressRoot';
