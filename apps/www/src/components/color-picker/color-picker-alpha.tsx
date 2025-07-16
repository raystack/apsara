'use client';
import { cx } from 'class-variance-authority';
import { Slider } from 'radix-ui';
import { type ComponentProps } from 'react';
import { useColorPicker } from './color-picker-base';
import styles from './color-picker.module.css';

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha, setAlpha } = useColorPicker();
  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={100}
      onValueChange={([alpha]) => setAlpha(alpha)}
      step={1}
      value={[alpha]}
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
