// url=<FIGMA_LINK>?node-id=78-1127
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/sidebar/sidebar-item.tsx
// component=Sidebar.Item

import figma from 'figma';

const instance = figma.selectedInstance;

// Leading Icon BOOLEAN gates the Icon INSTANCE_SWAP → `leadingIcon` prop.
const leadingIcon = instance.getBoolean('Leading Icon', {
  true: instance.getInstanceSwap('Icon')?.executeTemplate().example,
  false: undefined
});
// State Active/Active_hover → `active`; Default/Hover map to nothing (visual).
const active = instance.getEnum('State', {
  Default: undefined,
  Hover: undefined,
  Active: true,
  Active_hover: true
});

// Label BOOLEAN — when false the cell shows no text; the code component always
// takes children, so we render placeholder label text below.
// Trailing Icon BOOLEAN has no matching prop on Sidebar.Item, intentionally
// not mapped. Type (Expanded/Collapsed) is driven by the parent Sidebar state,
// not a Sidebar.Item prop — intentionally not mapped.

export default {
  id: 'Sidebar.Item',
  imports: ["import { Sidebar } from '@raystack/apsara'"],
  example: figma.code`<Sidebar.Item href="/"${figma.helpers.react.renderProp(
    'leadingIcon',
    leadingIcon
  )}${figma.helpers.react.renderProp('active', active)}>Label</Sidebar.Item>`,
  metadata: { nestable: true }
};
