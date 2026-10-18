// url=<FIGMA_LINK>?node-id=613-990
// source=https://github.com/raystack/apsara/blob/main/packages/react/components/announcement-bar/announcement-bar.tsx
// component=AnnouncementBar

import figma from 'figma';

const color = figma.selectedInstance.getEnum('Variant', {
  Error: 'danger',
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
    'color',
    color
  )}${figma.helpers.react.renderProp(
    'text',
    text
  )}${figma.helpers.react.renderProp('leadingIcon', leadingIcon)}/>`,
  metadata: { nestable: true }
};
