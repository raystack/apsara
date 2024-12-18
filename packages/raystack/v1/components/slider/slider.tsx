import * as RadixSlider from '@radix-ui/react-slider';
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from './slider.module.css';

const slider = cva(styles.slider, {
  variants: {
    variant: {
      single: styles["slider-variant-single"],
      range: styles["slider-variant-range"],
    }
  },
  defaultVariants: {
    variant: "single",
  },
});

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixSlider.Root>, 'value' | 'defaultValue'>,
    VariantProps<typeof slider> {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | [number, number];
  value?: number | [number, number];
  label?: string;
  onChange?: (value: number | [number, number]) => void;
}

export const Slider = forwardRef<ElementRef<typeof RadixSlider.Root>, SliderProps>(({
  className,
  variant = "single",
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  label,
  onChange,
  ...props
}, ref) => {
  const initialValue = value ?? defaultValue ?? (variant === "single" ? [min] : [min, max]);
  const values = Array.isArray(initialValue) ? initialValue : [initialValue];

  return (
    <RadixSlider.Root
      ref={ref}
      className={slider({ variant, className })}
      min={min}
      max={max}
      step={step}
      value={values}
      onValueChange={(newValues) => {
        onChange?.(variant === "single" ? newValues[0] : [newValues[0], newValues[1]]);
      }}
      {...props}
    >
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>
      {values.map((_, index) => (
        <RadixSlider.Thumb
          key={index}
          className={styles.thumb}
        >
          {label && <span className={styles.label}>{label}</span>}
        </RadixSlider.Thumb>
      ))}
    </RadixSlider.Root>
  );
});

Slider.displayName = 'Slider';