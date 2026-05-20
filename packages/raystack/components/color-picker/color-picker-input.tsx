'use client';

import { ComponentProps } from 'react';
import { Input } from '../input';
import { useColorPicker } from './color-picker-root';
import { getColorString } from './utils';

export const ColorPickerInput = (props: ComponentProps<typeof Input>) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker();
  const value = getColorString(
    { h: hue, s: saturation, l: lightness, alpha: alpha ?? 1 },
    mode
  );

  return <Input value={value} readOnly {...props} />;
};

ColorPickerInput.displayName = 'ColorPicker.Input';
