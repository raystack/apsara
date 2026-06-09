// url=<FIGMA_LINK>?node-id=254-549
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/slider/slider.tsx
// component=Slider

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Range: 'range'
});
const handle = (function () {
  const nestedLayer0 = figma.selectedInstance.findInstance('Handle');
  if (!nestedLayer0 || nestedLayer0.type !== 'INSTANCE') {
    return { thumbSize: undefined, label: undefined };
  }
  const labelText = nestedLayer0.findText('Label');
  return {
    thumbSize: nestedLayer0.getEnum('Size', {
      Small: 'small'
    }),
    label: nestedLayer0.getBoolean('Handle Label', {
      true:
        labelText && labelText.type === 'TEXT'
          ? labelText.textContent
          : undefined,
      false: undefined
    })
  };
})();

export default {
  id: 'Slider',
  imports: ["import { Slider } from '@raystack/apsara'"],
  example: figma.code`<Slider${figma.helpers.react.renderProp(
    'thumbSize',
    handle.thumbSize
  )}${figma.helpers.react.renderProp(
    'label',
    handle.label
  )}${figma.helpers.react.renderProp('variant', variant)}/>`,
  metadata: { nestable: true }
};
