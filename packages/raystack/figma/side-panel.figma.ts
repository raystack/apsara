// url=<FIGMA_LINK>?node-id=5793-15924
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/side-panel/side-panel.tsx
// component=SidePanel

import figma from 'figma';

// Sidepanel has no Figma component properties. Compose a minimal realistic
// example using the public SidePanel API (Header + Section).

export default {
  id: 'SidePanel',
  imports: ["import { SidePanel } from '@raystack/apsara'"],
  example: figma.code`<SidePanel>
      <SidePanel.Header title='Panel title' />
      <SidePanel.Section>Section content</SidePanel.Section>
    </SidePanel>`,
  metadata: { nestable: false }
};
