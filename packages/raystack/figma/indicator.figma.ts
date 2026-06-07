// url=<FIGMA_LINK>?node-id=3472-3108
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/indicator/indicator.tsx
// component=Indicator

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Accent: 'accent',
  Warning: 'warning',
  Danger: 'danger',
  Success: 'success',
  Neutral: 'neutral'
});
const label = figma.selectedInstance.getEnum('Label', {
  True: (function () {
    const t = figma.selectedInstance.findText('3');
    return t && t.type === 'TEXT' ? t.textContent : undefined;
  })(),
  False: undefined
});

export default {
  id: 'Indicator',
  imports: ["import { Indicator } from '@raystack/apsara'"],
  example: figma.code`<Indicator${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp('label', label)}/>`,
  metadata: { nestable: true }
};
