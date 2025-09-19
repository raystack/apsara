'use client';

import { type VariantProps, cva, cx } from 'class-variance-authority';
import { Slider as SliderPrimitive } from 'radix-ui';
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef
} from 'react';
import { Text } from '../text';
import styles from './slider.module.css';
import { ThumbIcon } from './thumb';

const slider = cva(styles.slider, {
  variants: {
    variant: {
      single: styles['slider-variant-single'],
      range: styles['slider-variant-range']
    }
  },
  defaultVariants: {
    variant: 'single'
  }
});

export interface SliderProps
  extends Omit<
      ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      'value' | 'defaultValue' | 'onChange'
    >,
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
  thumbSize?: 'small' | 'large';
}

export const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
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
      thumbSize = 'large',
      ...props
    },
    ref
  ) => {
    const isRange = variant === 'range';
    const isThumbSmall = thumbSize === 'small';
    const defaultVal = isRange
      ? (defaultValue as [number, number]) || [min, max]
      : [(defaultValue as number) || min];
    const currentValue = value
      ? isRange
        ? (value as [number, number])
        : [value as number]
      : defaultVal;

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
      <SliderPrimitive.Root
        ref={ref}
        className={`${slider({ variant })} ${className || ''}`}
        value={value ? currentValue : undefined}
        defaultValue={defaultVal}
        min={min}
        max={max}
        step={step}
        onValueChange={val =>
          onChange?.(isRange ? (val as [number, number]) : val[0])
        }
        aria-label={ariaLabel || (isRange ? 'Range slider' : 'Slider')}
        {...props}
      >
        <SliderPrimitive.Track className={styles.track}>
          <SliderPrimitive.Range className={styles.range} />
        </SliderPrimitive.Track>
        {defaultVal.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cx(styles.thumb)}
            asChild
            aria-label={getLabel(i) || `Thumb ${i + 1}`}
            aria-valuetext={getAriaValueText(i)}
            data-size={thumbSize}
          >
            <div>
              {isThumbSmall ? (
                <div className={styles.thumbSmall} />
              ) : (
                <ThumbIcon />
              )}
              {getLabel(i) && (
                <Text
                  className={styles.label}
                  size={isThumbSmall ? 'micro' : 'mini'}
                  weight='medium'
                >
                  {getLabel(i)}
                </Text>
              )}
            </div>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = 'Slider';
