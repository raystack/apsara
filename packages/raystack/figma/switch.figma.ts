// url=<FIGMA_LINK>?node-id=1-349
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/switch/switch.tsx
// component=Switch

import figma from 'figma';

// State is a VARIANT — Disabled maps to the `disabled` prop; Hover is
// visual-only and intentionally unmapped (renderProp omits undefined).
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
const size = figma.selectedInstance.getEnum('Size', {
  Small: 'small',
  Large: 'large'
});
// Selected is a VARIANT (False/True), not a boolean property.
const defaultChecked = figma.selectedInstance.getEnum('Selected', {
  True: true,
  False: undefined
});

export default {
  id: 'Switch',
  imports: ["import { Switch } from '@raystack/apsara'"],
  example: figma.code`<Switch${figma.helpers.react.renderProp(
    'disabled',
    disabled
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp('defaultChecked', defaultChecked)} />`,
  metadata: { nestable: true }
};
