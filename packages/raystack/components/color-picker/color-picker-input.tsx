'use client';

import Color from 'color';
import { ComponentProps } from 'react';
import { InputField } from '../input-field';
import { useColorPicker } from './color-picker-root';
import { getColorString } from './utils';

export const ColorPickerInput = (props: ComponentProps<typeof InputField>) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker();
  const color = Color.hsl(hue, saturation, lightness, alpha ?? 1);

  return <InputField value={getColorString(color, mode)} readOnly {...props} />;
};

ColorPickerInput.displayName = 'ColorPicker.Input';
