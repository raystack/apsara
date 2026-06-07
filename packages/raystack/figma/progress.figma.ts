// url=<FIGMA_LINK>?node-id=8946-5318
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/progress/progress-root.tsx
// component=Progress

import figma from 'figma';

const instance = figma.selectedInstance;

// Variant Linear/Circular → code `variant` prop (linear | circular).
const variant = instance.getEnum('Variant', {
  Linear: 'linear',
  Circular: 'circular'
});

export default {
  id: 'Progress',
  imports: ["import { Progress } from '@raystack/apsara'"],
  example: figma.code`<Progress${figma.helpers.react.renderProp(
    'variant',
    variant
  )} value={50} />`,
  metadata: { nestable: true }
};
