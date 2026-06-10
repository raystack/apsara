// url=<FIGMA_LINK>?node-id=5793-14138
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/side-panel/side-panel.tsx
// component=SidePanel.Section

import figma from 'figma';

// SidePanel.Section only accepts native div props (children). The Figma
// Header BOOLEAN and Variant (layout presets) are content/composition concerns,
// not code props.
// Header BOOLEAN → whether the section leads with a heading line.
const header = figma.selectedInstance.getBoolean('Header', {
  true: true,
  false: undefined
});

// Unmapped (intentional):
// - Variant (Order Overview/Task Parameters/H Template/V Template): these are
//   layout presets composed from children, not a code prop on the section.

export default {
  id: 'SidePanel.Section',
  imports: ["import { SidePanel } from '@raystack/apsara'"],
  example: figma.code`<SidePanel.Section>${
    header
      ? figma.code`
      <h3>Section title</h3>`
      : ''
  }
      Section content
    </SidePanel.Section>`,
  metadata: { nestable: true }
};
