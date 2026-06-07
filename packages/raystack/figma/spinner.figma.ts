// url=<FIGMA_LINK>?node-id=3073-10985
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/spinner/spinner.tsx
// component=Spinner

import figma from 'figma';

// Figma "State" VARIANT runs 1-8, but the code Spinner `size` prop only
// supports 1-6. States 7 and 8 have no code counterpart and are clamped to
// the largest supported size (6).
const size = figma.selectedInstance.getEnum('State', {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 6,
  '8': 6
});

export default {
  id: 'Spinner',
  imports: ["import { Spinner } from '@raystack/apsara'"],
  example: figma.code`<Spinner${figma.helpers.react.renderProp('size', size)} />`,
  metadata: { nestable: true }
};
