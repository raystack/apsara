'use client';

import { ComponentProps, useMemo } from 'react';
import { Input } from '../input';
import { useColorPicker } from './color-picker-root';
import { getColorString } from './utils';

export const ColorPickerInput = (props: ComponentProps<typeof Input>) => {
  const { lightness, chroma, hue, alpha, mode } = useColorPicker();
  const value = useMemo(
    () =>
      getColorString(
        { l: lightness, c: chroma, h: hue, alpha: alpha ?? 1 },
        mode
      ),
    [lightness, chroma, hue, alpha, mode]
  );

  return <Input value={value} readOnly {...props} />;
};

ColorPickerInput.displayName = 'ColorPicker.Input';
