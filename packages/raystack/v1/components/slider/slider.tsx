import * as React from 'react';
import { type ComponentPropsWithoutRef } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './slider.module.css';

const slider = cva(styles.slider, {
  variants: {
    variant: {
      single: styles['slider-variant-single'],
      range: styles['slider-variant-range'],
    },
  },
  defaultVariants: {
    variant: 'single',
  },
});

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixSlider.Root>, 'value' | 'defaultValue' | 'onChange'>,
    VariantProps<typeof slider> {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange?: (value: number | [number, number]) => void;
}

export const Slider = React.forwardRef<React.ElementRef<typeof RadixSlider.Root>, SliderProps>(
  ({ className, variant = 'single', value, defaultValue, min = 0, max = 100, step = 1, label, onChange, ...props }, ref) => {
    const isRange = variant === 'range';
    const defaultVal = isRange 
      ? (defaultValue as [number, number]) || [min, max] 
      : [defaultValue as number || min];
    const currentValue = isRange ? value as [number, number] : [value as number];

    return (
      <RadixSlider.Root
        ref={ref}
        className={`${slider({ variant })} ${className || ''}`}
        value={value ? currentValue : undefined}
        defaultValue={defaultVal}
        min={min}
        max={max}
        step={step}
        onValueChange={(val) => onChange?.(isRange ? (val as [number, number]) : val[0])}
        {...props}
      >
        <RadixSlider.Track className={styles.track}>
          <RadixSlider.Range className={styles.range} />
        </RadixSlider.Track>
        {defaultVal.map((_, i) => (
          <RadixSlider.Thumb key={i} className={styles.thumb}>
            {label && <div className={styles.label}>{label}</div>}
          </RadixSlider.Thumb>
        ))}
      </RadixSlider.Root>
    );
  }
);

Slider.displayName = 'Slider';