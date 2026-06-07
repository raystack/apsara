// url=<FIGMA_LINK>?node-id=9136-2831
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/sidebar/sidebar-misc.tsx
// component=Sidebar.Group

import figma from 'figma';

const instance = figma.selectedInstance;

// Leading Icon BOOLEAN gates the Icon INSTANCE_SWAP → `leadingIcon` prop.
const leadingIcon = instance.getBoolean('Leading Icon', {
  true: instance.getInstanceSwap('Icon')?.executeTemplate().example,
  false: undefined
});
// Trailing Icon BOOLEAN → `trailingIcon`. The Figma component only swaps a
// single "Icon" instance, so reuse it for the trailing slot when enabled.
const trailingIcon = instance.getBoolean('Trailing Icon', {
  true: instance.getInstanceSwap('Icon')?.executeTemplate().example,
  false: undefined
});

// Label BOOLEAN — the code `label` prop is required; render placeholder text.
// State (Default/Hover) and Type (Expanded/Collapsed) are visual / parent-driven
// — no matching Sidebar.Group props, intentionally not mapped.

export default {
  id: 'Sidebar.Group',
  imports: ["import { Sidebar } from '@raystack/apsara'"],
  example: figma.code`<Sidebar.Group label="Navigation"${figma.helpers.react.renderProp(
    'leadingIcon',
    leadingIcon
  )}${figma.helpers.react.renderProp('trailingIcon', trailingIcon)}>
  <Sidebar.Item href="/">Home</Sidebar.Item>
</Sidebar.Group>`,
  metadata: { nestable: true }
};
