// url=<FIGMA_LINK>?node-id=8949-10541
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/toggle/toggle.tsx
// component=Toggle.Group

import figma from 'figma';

// Toggle Group has no Figma component properties. Compose a minimal realistic
// example using the public Toggle.Group + Toggle API.

export default {
  id: 'Toggle.Group',
  imports: ["import { Toggle } from '@raystack/apsara'"],
  example: figma.code`<Toggle.Group>
      <Toggle value='left'>Left</Toggle>
      <Toggle value='center'>Center</Toggle>
      <Toggle value='right'>Right</Toggle>
    </Toggle.Group>`,
  metadata: { nestable: true }
};
