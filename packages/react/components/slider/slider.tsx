'use client';

import { Slider as SliderPrimitive } from '@base-ui/react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { useCallback } from 'react';
import { Text } from '../text';
import styles from './slider.module.css';

const slider = cva(styles.slider, {
  variants: {
    variant: {
      single: styles['slider-variant-single'],
      range: styles['slider-variant-range']
    },
    thumbLabelDisplay: {
      always: null,
      hover: styles['slider-thumb-label-display-hover'],
      none: null
    }
  },
  defaultVariants: {
    variant: 'single'
  }
});

export interface SliderProps
  extends SliderPrimitive.Root.Props,
    VariantProps<typeof slider> {
  /** Text shown above each thumb and used as its `aria-label`. */
  thumbLabel?: string | [string, string];
  /**
   * When the text above each thumb is shown.
   * @default 'always'
   */
  thumbLabelDisplay?: 'always' | 'hover' | 'none';
  thumbSize?: 'small' | 'large';
}

function SliderRoot({
  className,
  variant = 'single',
  thumbLabel,
  thumbLabelDisplay = 'always',
  thumbSize = 'large',
  children,
  ...props
}: SliderProps) {
  const isRange = variant === 'range';
  const isThumbSmall = thumbSize === 'small';

  const getLabel = useCallback(
    (index: number) => {
      if (!thumbLabel) return undefined;
      if (typeof thumbLabel === 'string') return thumbLabel;
      return thumbLabel[index];
    },
    [thumbLabel]
  );

  const thumbCount = isRange ? 2 : 1;

  return (
    <SliderPrimitive.Root
      className={slider({ variant, thumbLabelDisplay, className })}
      thumbAlignment='edge'
      data-slot='slider'
      {...props}
    >
      {children}
      <SliderPrimitive.Control
        className={styles.control}
        data-slot='slider-control'
      >
        <SliderPrimitive.Track
          className={styles.track}
          data-slot='slider-track'
        >
          <SliderPrimitive.Indicator
            className={styles.indicator}
            data-slot='slider-indicator'
          />
          {Array.from({ length: thumbCount }).map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              index={isRange ? i : undefined}
              className={cx(styles.thumb)}
              aria-label={
                getLabel(i) || (isRange ? `Thumb ${i + 1}` : 'Slider thumb')
              }
              data-size={thumbSize}
              data-slot='slider-thumb'
            >
              {isThumbSmall ? (
                <div
                  className={styles.thumbSmall}
                  data-slot='slider-thumb-grip'
                />
              ) : (
                <div
                  className={styles.thumbLarge}
                  data-slot='slider-thumb-grip'
                >
                  <div
                    className={styles.thumbLargeLine}
                    data-slot='slider-thumb-grip-line'
                  />
                  <div
                    className={styles.thumbLargeLine}
                    data-slot='slider-thumb-grip-line'
                  />
                  <div
                    className={styles.thumbLargeLine}
                    data-slot='slider-thumb-grip-line'
                  />
                </div>
              )}
              {thumbLabelDisplay !== 'none' && getLabel(i) && (
                <Text
                  className={styles.thumbLabel}
                  size={isThumbSmall ? 'micro' : 'mini'}
                  weight='medium'
                  data-slot='slider-thumb-label'
                >
                  {getLabel(i)}
                </Text>
              )}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

SliderRoot.displayName = 'Slider';

function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      className={cx(styles.label, className)}
      data-slot='slider-label'
      {...props}
    />
  );
}

SliderLabel.displayName = 'Slider.Label';

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      className={cx(styles.value, className)}
      data-slot='slider-value'
      {...props}
    />
  );
}

SliderValue.displayName = 'Slider.Value';

export const Slider = Object.assign(SliderRoot, {
  Label: SliderLabel,
  Value: SliderValue
});
