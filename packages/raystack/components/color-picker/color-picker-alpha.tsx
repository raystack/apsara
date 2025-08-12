'use client';

import { cx } from 'class-variance-authority';
import { Slider } from 'radix-ui';
import { type ComponentProps } from 'react';
import { useColorPicker } from './color-picker-root';
import styles from './color-picker.module.css';

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha = 1, setColor } = useColorPicker();
  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={100}
      onValueChange={([alpha]) => setColor({ alpha: alpha / 100 })}
      step={1}
      value={[alpha * 100]}
      {...props}
    >
      <Slider.Track className={cx(styles.sliderTrack, styles.alphaTrack)}>
        <div className={styles.alphaTrackGradient} />
        <Slider.Range className={styles.sliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.sliderThumb} />
    </Slider.Root>
  );
};
