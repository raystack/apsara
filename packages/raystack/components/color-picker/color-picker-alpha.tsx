'use client';

import { Slider } from '@base-ui/react/slider';
import { cx } from 'class-variance-authority';
import styles from './color-picker.module.css';
import { useColorPicker } from './color-picker-root';

export type ColorPickerAlphaProps = Slider.Root.Props;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha = 1, setColor } = useColorPicker();
  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={100}
      onValueChange={value => setColor({ alpha: (value as number) / 100 })}
      step={1}
      value={alpha * 100}
      thumbAlignment='edge'
      {...props}
    >
      <Slider.Control className={styles.sliderControl}>
        <Slider.Track className={cx(styles.sliderTrack, styles.alphaTrack)}>
          <div className={styles.alphaTrackGradient} />
          <Slider.Indicator className={styles.sliderRange} />
          <Slider.Thumb className={styles.sliderThumb} aria-label='Alpha' />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};
