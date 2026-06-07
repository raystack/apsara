// url=<FIGMA_LINK>?node-id=8948-7068
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/meter/meter-root.tsx
// component=Meter

import figma from 'figma';

// Variant VARIANT maps directly to the Meter `variant` prop.
const variant = figma.selectedInstance.getEnum('Variant', {
  Linear: 'linear',
  Circular: 'circular'
});

export default {
  id: 'Meter',
  imports: ["import { Meter } from '@raystack/apsara'"],
  example: figma.code`<Meter${figma.helpers.react.renderProp(
    'variant',
    variant
  )} value={50} />`,
  metadata: { nestable: true }
};
