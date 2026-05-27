'use client';

import { Slider } from '@base-ui/react/slider';
import { cx } from 'class-variance-authority';
import { useMemo } from 'react';
import styles from './color-picker.module.css';
import { useColorPicker } from './color-picker-root';
import { hslToOklch, oklchToHsl } from './utils';

export type ColorPickerHueProps = Slider.Root.Props;
export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { lightness, chroma, hue, mode, setColor } = useColorPicker();
  const isOklch = mode === 'oklch';

  // Non-oklch modes drive the slider in HSL hue space so the picker behaves
  // like it did pre-OKLCH (red at 0°, green at 120°, etc.). State is still
  // stored as OKLCH; we round-trip through HSL on read and write.
  const hsl = useMemo(
    () => (isOklch ? null : oklchToHsl({ l: lightness, c: chroma, h: hue })),
    [isOklch, lightness, chroma, hue]
  );
  const value = isOklch ? hue : (hsl?.h ?? 0);

  const handleValueChange = (next: number) => {
    if (isOklch) {
      setColor({ h: next });
      return;
    }
    if (!hsl) return;
    const oklch = hslToOklch(next, hsl.s, hsl.l);
    setColor({ l: oklch.l, c: oklch.c, h: oklch.h });
  };

  return (
    <Slider.Root
      className={cx(styles.sliderRoot, className)}
      max={360}
      onValueChange={value => handleValueChange(value as number)}
      // OKLCH hue is perceptually uniform — sub-degree precision is meaningful
      // when fine-tuning a tone. HSL hue keeps the classic 1° granularity.
      step={isOklch ? 0.1 : 1}
      value={value}
      thumbAlignment='edge'
      {...props}
    >
      <Slider.Control className={styles.sliderControl}>
        <Slider.Track
          className={cx(
            styles.sliderTrack,
            isOklch ? styles.hueTrack : styles.hueTrackHsl
          )}
        >
          <Slider.Indicator className={styles.sliderRange} />
          <Slider.Thumb
            className={styles.sliderThumb}
            aria-label={isOklch ? 'OKLCH hue' : 'HSL hue'}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};

ColorPickerHue.displayName = 'ColorPicker.Hue';
