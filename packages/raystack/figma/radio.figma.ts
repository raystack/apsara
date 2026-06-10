// url=<FIGMA_LINK>?node-id=2-148
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/radio/radio.tsx
// component=Radio

import figma from 'figma';

// State Hover is visual-only — only Disabled maps to a code prop.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
// Selection is controlled by the group value; True pre-selects the item via defaultValue.
const defaultValue = figma.selectedInstance.getEnum('Selected', {
  True: 'value',
  False: undefined
});

export default {
  id: 'Radio',
  imports: ["import { Radio } from '@raystack/apsara'"],
  example: figma.code`<Radio.Group${figma.helpers.react.renderProp(
    'defaultValue',
    defaultValue
  )}>
      <Radio value='value'${figma.helpers.react.renderProp(
        'disabled',
        disabled
      )}/>
    </Radio.Group>`,
  metadata: { nestable: true }
};
