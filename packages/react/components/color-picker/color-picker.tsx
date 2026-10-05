import { ColorPickerAlpha } from './color-picker-alpha';
import { ColorPickerArea } from './color-picker-area';
import { ColorPickerHue } from './color-picker-hue';
import { ColorPickerInput } from './color-picker-input';
import { ColorPickerMode } from './color-picker-mode';
import { ColorPickerRoot } from './color-picker-root';

export const ColorPicker = Object.assign(ColorPickerRoot, {
  Area: ColorPickerArea,
  Hue: ColorPickerHue,
  Alpha: ColorPickerAlpha,
  Input: ColorPickerInput,
  Mode: ColorPickerMode
});
