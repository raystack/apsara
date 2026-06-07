// url=<FIGMA_LINK>?node-id=5793-14125
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/side-panel/side-panel.tsx
// component=SidePanel.Header

import figma from 'figma';

// Sub Heading BOOLEAN → `description` prop (toggled on with a placeholder).
const description = figma.selectedInstance.getBoolean('Sub Heading', {
  true: 'Panel description',
  false: undefined
});

// Unmapped (intentional):
// - Dismiss / Avatar / Download: these populate the `icon` / `actions`
//   ReactNode props, but Figma exposes them only as BOOLEANs (no instance
//   swap) so there is no extractable node to render.
// - Variant (Text/Tabs): SidePanel.Header has no variant prop in code.

export default {
  id: 'SidePanel.Header',
  imports: ["import { SidePanel } from '@raystack/apsara'"],
  example: figma.code`<SidePanel.Header title='Panel title'${figma.helpers.react.renderProp(
    'description',
    description
  )} />`,
  metadata: { nestable: true }
};
