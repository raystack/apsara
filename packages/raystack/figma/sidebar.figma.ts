// url=<FIGMA_LINK>?node-id=85-1351
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/sidebar/sidebar-root.tsx
// component=Sidebar

import figma from 'figma';

const instance = figma.selectedInstance;

// Variant Plain/Floating/Inset → code `variant`.
const variant = instance.getEnum('Variant', {
  Floating: 'floating',
  Inset: 'inset'
});
// State Expanded/Collapsed → `defaultOpen` (Expanded = open, Collapsed = closed).
// Expanded is the code default (defaultOpen=true) so only emit when Collapsed.
const defaultOpen = instance.getEnum('State', {
  Expanded: undefined,
  Collapsed: false
});
// Collapsible Group BOOLEAN → render a collapsible Sidebar.Group.
const collapsibleGroup = instance.getBoolean('Collapsible Group', {
  true: true,
  false: undefined
});

export default {
  id: 'Sidebar',
  imports: ["import { Sidebar } from '@raystack/apsara'"],
  example: figma.code`<Sidebar${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp('defaultOpen', defaultOpen)}>
  <Sidebar.Header>Logo</Sidebar.Header>
  <Sidebar.Main>
    <Sidebar.Group label="Navigation"${collapsibleGroup ? ' collapsible' : ''}>
      <Sidebar.Item href="/" active>Home</Sidebar.Item>
      <Sidebar.Item href="/settings">Settings</Sidebar.Item>
    </Sidebar.Group>
  </Sidebar.Main>
  <Sidebar.Footer>
    <Sidebar.Item href="/profile">Profile</Sidebar.Item>
  </Sidebar.Footer>
</Sidebar>`,
  metadata: { nestable: false }
};
