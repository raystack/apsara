import { type ColorInstance } from 'color';

export const getColorString = (color: ColorInstance, mode: string) => {
  let string;
  if (mode === 'hex')
    string =
      color.alpha() === 1 ? color.hex().toString() : color.hexa().toString();
  else if (mode === 'hsl') string = color.hsl().toString();
  else string = color.rgb().toString();

  return string;
};

export const SUPPORTED_MODES = ['hex', 'hsl', 'rgb'];

export type ModeType = (typeof SUPPORTED_MODES)[number];

export type ColorObject = {
  h: number;
  s: number;
  l: number;
  alpha?: number;
};
