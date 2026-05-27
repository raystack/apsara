'use client';

import { Slider } from '@base-ui/react/slider';
import { cx } from 'class-variance-authority';
import { CSSProperties, useMemo } from 'react';
import styles from './color-picker.module.css';
import { useColorPicker } from './color-picker-root';

export type ColorPickerAlphaProps = Slider.Root.Props;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha = 1, lightness, chroma, hue, setColor } = useColorPicker();
  // Drive the track gradient from the current color so the user can preview
  // what the picked tone looks like at any alpha. The CSS reads
  // --rs-color-picker-alpha-end from this style.
  const trackStyle = useMemo(
    () =>
      ({
        ['--rs-color-picker-alpha-end' as string]: `oklch(${lightness} ${chroma} ${hue})`
      }) as CSSProperties,
    [lightness, chroma, hue]
  );
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
          <div className={styles.alphaTrackGradient} style={trackStyle} />
          <Slider.Indicator className={styles.sliderRange} />
          <Slider.Thumb className={styles.sliderThumb} aria-label='Alpha' />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};

ColorPickerAlpha.displayName = 'ColorPicker.Alpha';
