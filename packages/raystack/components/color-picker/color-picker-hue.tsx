'use client';

import { Slider } from '@base-ui/react/slider';
import { cx } from 'class-variance-authority';
import styles from './color-picker.module.css';
import { useColorPicker } from './color-picker-root';

export type ColorPickerHueProps = Slider.Root.Props;
export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { hue, setColor } = useColorPicker();
  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={360}
      onValueChange={value => setColor({ h: value as number })}
      step={1}
      value={hue}
      thumbAlignment='edge'
      {...props}
    >
      <Slider.Control className={styles.sliderControl}>
        <Slider.Track className={cx(styles.sliderTrack, styles.hueTrack)}>
          <Slider.Indicator className={styles.sliderRange} />
          <Slider.Thumb className={styles.sliderThumb} aria-label='Hue' />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};
