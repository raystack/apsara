'use client';
import { InputField } from '@raystack/apsara';
import Color from 'color';
import { ComponentPropsWithoutRef } from 'react';
import { useColorPicker } from './color-picker-base';

export const ColorPickerFormat = (
  props: ComponentPropsWithoutRef<typeof InputField>
) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker();
  const color = Color.hsl(hue, saturation, lightness, alpha / 100);

  let value = '';
  if (mode === 'hex') {
    value = color.hex();
  } else if (mode === 'rgb') {
    value = color.rgb().toString();
  } else if (mode === 'hsl') {
    value = color.hsl().toString();
  }

  return <InputField readOnly value={value} {...props} />;
};
