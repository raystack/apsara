import * as React from 'react';
import { type ComponentPropsWithoutRef } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';

import { ThumbIcon } from './thumb';

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
  label?: string | [string, string];
  onChange?: (value: number | [number, number]) => void;
  'aria-label'?: string;
  'aria-valuetext'?: string;
}

export const Slider = React.forwardRef<React.ElementRef<typeof RadixSlider.Root>, SliderProps>(
  ({ 
    className, 
    variant = 'single', 
    value, 
    defaultValue, 
    min = 0, 
    max = 100, 
    step = 1, 
    label, 
    onChange,
    'aria-label': ariaLabel,
    'aria-valuetext': ariaValueText,
    ...props 
  }, ref) => {
    const isRange = variant === 'range';
    const defaultVal = isRange 
      ? (defaultValue as [number, number]) || [min, max] 
      : [defaultValue as number || min];
    const currentValue = value ? (isRange ? value as [number, number] : [value as number]) : defaultVal;

    const getLabel = (index: number) => {
      if (!label) return undefined;
      if (typeof label === 'string') return label;
      return label[index];
    };

    const getAriaValueText = (index: number) => {
      if (ariaValueText) return ariaValueText;
      const labelText = getLabel(index);
      const val = currentValue[index];
      return labelText ? `${labelText}: ${val}` : `${val}`;
    };

    return (
      <RadixSlider.Root
        ref={ref}
        className={`${slider({ variant })} ${className || ''}`}
        value={value ? currentValue : undefined}
        defaultValue={defaultVal}
        min={min}
        max={max}
        step={step}
        onValueChange={(val) => onChange?.(isRange ? val as [number, number] : val[0])}
        aria-label={ariaLabel || (isRange ? 'Range slider' : 'Slider')}
        {...props}
      >
        <RadixSlider.Track className={styles.track}>
          <RadixSlider.Range className={styles.range} />
        </RadixSlider.Track>
        {defaultVal.map((_, i) => (
          <RadixSlider.Thumb 
            key={i} 
            className={styles.thumb} 
            asChild
            aria-label={getLabel(i) || `Thumb ${i + 1}`}
            aria-valuetext={getAriaValueText(i)}
          >
            <div>
              <ThumbIcon />
              {getLabel(i) && <div className={styles.label}>{getLabel(i)}</div>}
            </div>
          </RadixSlider.Thumb>
        ))}
      </RadixSlider.Root>
    );
  }
);

Slider.displayName = 'Slider';