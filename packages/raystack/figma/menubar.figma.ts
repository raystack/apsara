// url=<FIGMA_LINK>?node-id=9053-3557
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/menubar/menubar.tsx
// component=Menubar

import figma from 'figma';

const instance = figma.selectedInstance;

// Render every direct child of the Menubar frame into a single flat list of
// sections (so the array flattens correctly when interpolated):
// - A Button instance (the menu triggers) becomes a <Menu> whose Trigger
//   renders that button via the `render` prop, with an (empty) Menu.Content.
// - Any other child is passed through and rendered directly.
const items = instance.children.flatMap(child => {
  if (child.type === 'INSTANCE') {
    const rendered = child.hasCodeConnect()
      ? child.executeTemplate().example
      : undefined;
    if (child.name === 'Button' && rendered) {
      return figma.code`
      <Menu>
        <Menu.Trigger render={${rendered}} />
        <Menu.Content />
      </Menu>`.sections;
    }
    // Non-button instance → render it as-is.
    return rendered ?? [];
  }
  if (child.type === 'TEXT') {
    return figma.code`
      ${child.textContent}`.sections;
  }
  return [];
});

// Fall back to a minimal realistic example when the frame exposes no
// resolvable children (e.g. nothing selected).
const fallback = figma.code`<Menubar>
      <Menu>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item value='new'>New</Menu.Item>
          <Menu.Item value='open'>Open</Menu.Item>
        </Menu.Content>
      </Menu>
    </Menubar>`;

export default {
  id: 'Menubar',
  imports: ["import { Menubar, Menu } from '@raystack/apsara'"],
  example:
    items.length > 0
      ? figma.code`<Menubar>${items}
    </Menubar>`
      : fallback,
  metadata: { nestable: false }
};
