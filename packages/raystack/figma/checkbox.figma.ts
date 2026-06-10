// url=<FIGMA_LINK>?node-id=1-372
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/checkbox/checkbox.tsx
// component=Checkbox

import figma from 'figma';

// State: Disabled → disabled. Hover is visual-only (no code prop) and is left unmapped.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
// Base UI Checkbox uses a boolean `checked` plus a separate boolean `indeterminate`.
// Default is the unchecked baseline, so it is left unmapped (no noisy checked={false}).
const checked = figma.selectedInstance.getEnum('Variant', {
  Selected: true
});
const indeterminate = figma.selectedInstance.getEnum('Variant', {
  Indeterminate: true
});

export default {
  id: 'Checkbox',
  imports: ["import { Checkbox } from '@raystack/apsara'"],
  example: figma.code`<Checkbox${figma.helpers.react.renderProp(
    'disabled',
    disabled
  )}${figma.helpers.react.renderProp(
    'checked',
    checked
  )}${figma.helpers.react.renderProp('indeterminate', indeterminate)}/>`,
  metadata: { nestable: true }
};
