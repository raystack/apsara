// url=<FIGMA_LINK>?node-id=11-170
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/tabs/tabs.tsx
// component=Tabs

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Standalone: 'standalone',
  Plain: 'plain'
});
const size = figma.selectedInstance.getEnum('Size', {
  Large: 'large',
  Small: 'small'
});
// content container SLOT → rendered into Tabs.Content, with a placeholder
// fallback when the slot is empty.
const content = figma.selectedInstance.getSlot('content container');

export default {
  id: 'Tabs',
  imports: ["import { Tabs } from '@raystack/apsara'"],
  example: figma.code`<Tabs${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp('size', size)} defaultValue='tab1'>
      <Tabs.List>
        <Tabs.Tab value='tab1'>Tab one</Tabs.Tab>
        <Tabs.Tab value='tab2'>Tab two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value='tab1'>${
        content ?? figma.code`Tab one content`
      }</Tabs.Content>
      <Tabs.Content value='tab2'>Tab two content</Tabs.Content>
    </Tabs>`,
  metadata: { nestable: false }
};
