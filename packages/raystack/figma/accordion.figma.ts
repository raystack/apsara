// url=<FIGMA_LINK>?node-id=8089-1150
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/accordion/accordion.tsx
// component=Accordion

import figma from 'figma';

// State (Collapsed/Hover/Expanded) is visual-only — the Accordion root exposes no
// matching prop, so it is not mapped. A composed example uses the public sub-component API.

export default {
  id: 'Accordion',
  imports: ["import { Accordion } from '@raystack/apsara'"],
  example: figma.code`<Accordion>
      <Accordion.Item value='item-1'>
        <Accordion.Trigger>Trigger</Accordion.Trigger>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion.Item>
    </Accordion>`,
  metadata: { nestable: true }
};
