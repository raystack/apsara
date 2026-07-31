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
    }
  },
  defaultVariants: {
    variant: 'single'
  }
});

export interface SliderProps
  extends SliderPrimitive.Root.Props,
    VariantProps<typeof slider> {
  label?: string | [string, string];
  thumbSize?: 'small' | 'large';
}

function SliderRoot({
  className,
  variant = 'single',
  label,
  thumbSize = 'large',
  ...props
}: SliderProps) {
  const isRange = variant === 'range';
  const isThumbSmall = thumbSize === 'small';

  const getLabel = useCallback(
    (index: number) => {
      if (!label) return undefined;
      if (typeof label === 'string') return label;
      return label[index];
    },
    [label]
  );

  const thumbCount = isRange ? 2 : 1;

  return (
    <SliderPrimitive.Root
      className={slider({ variant, className })}
      thumbAlignment='edge'
      data-slot='slider'
      {...props}
    >
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
              {getLabel(i) && (
                <Text
                  className={styles.label}
                  size={isThumbSmall ? 'micro' : 'mini'}
                  weight='medium'
                  data-slot='slider-label'
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

function SliderValue(props: SliderPrimitive.Value.Props) {
  return <SliderPrimitive.Value data-slot='slider-value' {...props} />;
}

SliderValue.displayName = 'Slider.Value';

export const Slider = Object.assign(SliderRoot, {
  Value: SliderValue
});
