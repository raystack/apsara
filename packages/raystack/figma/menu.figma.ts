// url=<FIGMA_LINK>?node-id=78-586
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/menu/menu.tsx
// component=Menu

import figma from 'figma';

// Search BOOLEAN → autocomplete search mode on the Menu root.
const autocomplete = figma.selectedInstance.getBoolean('Search', {
  true: true,
  false: undefined
});
// Empty BOOLEAN → render a Menu.EmptyState fallback when no options are shown.
const empty = figma.selectedInstance.getBoolean('Empty', {
  true: true,
  false: undefined
});
// Options BOOLEAN → render Menu.Item options inside the content.
const options = figma.selectedInstance.getBoolean('Options', {
  true: true,
  false: undefined
});

export default {
  id: 'Menu',
  imports: ["import { Menu } from '@raystack/apsara'"],
  example: figma.code`<Menu${figma.helpers.react.renderProp(
    'autocomplete',
    autocomplete
  )}>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Content>${
        options
          ? figma.code`
        <Menu.Item value='profile'>Profile</Menu.Item>
        <Menu.Item value='settings'>Settings</Menu.Item>`
          : ''
      }${
        empty
          ? figma.code`
        <Menu.EmptyState>No results found</Menu.EmptyState>`
          : ''
      }
      </Menu.Content>
    </Menu>`,
  metadata: { nestable: false }
};
