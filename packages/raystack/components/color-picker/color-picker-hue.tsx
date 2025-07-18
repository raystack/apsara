import { cx } from 'class-variance-authority';
import { Slider } from 'radix-ui';
import { type ComponentProps } from 'react';
import { useColorPicker } from './color-picker-root';
import styles from './color-picker.module.css';

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;
export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { hue, setColor } = useColorPicker();
  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={360}
      onValueChange={([hue]) => setColor({ h: hue })}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className={cx(styles.sliderTrack, styles.hueTrack)}>
        <Slider.Range className={styles.sliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.sliderThumb} />
    </Slider.Root>
  );
};
