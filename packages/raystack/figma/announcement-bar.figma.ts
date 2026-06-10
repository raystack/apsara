// url=<FIGMA_LINK>?node-id=613-990
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/announcement-bar/announcement-bar.tsx
// component=AnnouncementBar

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Error: 'error',
  Gradient: 'gradient'
});
const text = figma.selectedInstance.getString('Message');
const leadingIcon = figma.selectedInstance.getBoolean('Leading icon', {
  true: figma.selectedInstance.getInstanceSwap('Icon')?.executeTemplate()
    .example,
  false: undefined
});

export default {
  id: 'AnnouncementBar',
  imports: ["import { AnnouncementBar } from '@raystack/apsara'"],
  example: figma.code`<AnnouncementBar${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp(
    'text',
    text
  )}${figma.helpers.react.renderProp('leadingIcon', leadingIcon)}/>`,
  metadata: { nestable: true }
};
