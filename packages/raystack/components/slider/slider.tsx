'use client';

import { Slider as SliderPrimitive } from '@base-ui/react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ElementRef, forwardRef, useCallback } from 'react';
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

const SliderRoot = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, variant = 'single', label, thumbSize = 'large', ...props },
    ref
  ) => {
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
        ref={ref}
        className={slider({ variant, className })}
        thumbAlignment='edge'
        {...props}
      >
        <SliderPrimitive.Control className={styles.control}>
          <SliderPrimitive.Track className={styles.track}>
            <SliderPrimitive.Indicator className={styles.indicator} />
            {Array.from({ length: thumbCount }).map((_, i) => (
              <SliderPrimitive.Thumb
                key={i}
                index={isRange ? i : undefined}
                className={cx(styles.thumb)}
                aria-label={
                  getLabel(i) || (isRange ? `Thumb ${i + 1}` : 'Slider thumb')
                }
                data-size={thumbSize}
              >
                {isThumbSmall ? (
                  <div className={styles.thumbSmall} />
                ) : (
                  <div className={styles.thumbLarge}>
                    <div className={styles.thumbLargeLine} />
                    <div className={styles.thumbLargeLine} />
                    <div className={styles.thumbLargeLine} />
                  </div>
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
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    );
  }
);

SliderRoot.displayName = 'SliderRoot';

export const Slider = Object.assign(SliderRoot, {
  Value: SliderPrimitive.Value
});
