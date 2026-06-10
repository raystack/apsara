// url=<FIGMA_LINK>?node-id=4583-510
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/color-picker/color-picker.tsx
// component=ColorPicker

import figma from 'figma';

// Plain COMPONENT with no Figma properties — emit a minimal realistic example
// composed from the public sub-component API.

export default {
  id: 'ColorPicker',
  imports: ["import { ColorPicker } from '@raystack/apsara'"],
  example: figma.code`<ColorPicker defaultValue="#ffffff">
  <ColorPicker.Area />
  <ColorPicker.Hue />
  <ColorPicker.Alpha />
  <ColorPicker.Input />
  <ColorPicker.Mode />
</ColorPicker>`,
  metadata: { nestable: false }
};
