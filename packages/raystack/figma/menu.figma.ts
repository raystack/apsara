// url=<FIGMA_LINK>?node-id=78-586
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/menu/menu.tsx
// component=Menu

import figma from 'figma';

const instance = figma.selectedInstance;

// Search BOOLEAN → autocomplete search mode on the Menu root.
const autocomplete = instance.getBoolean('Search', {
  true: true,
  false: undefined
});
// Empty BOOLEAN → render a Menu.EmptyState fallback when no options are shown.
const empty = instance.getBoolean('Empty', {
  true: true,
  false: undefined
});
// Options BOOLEAN → render placeholder Menu.Item options.
const options = instance.getBoolean('Options', {
  true: true,
  false: undefined
});

// Render the real menu cells when present: each "dropdown cell" is connected to
// Menu.Item, so render each via executeTemplate and flatten into one section list.
const cells = instance
  .findConnectedInstances(node => node.name === 'dropdown cell', {
    traverseInstances: true
  })
  // findConnectedInstances returns reverse document order — flip to top-to-bottom.
  .reverse()
  .flatMap(cell =>
    cell && cell.type === 'INSTANCE' ? cell.executeTemplate().example : []
  );

// Fall back to placeholder content (Options / Empty) when no real cells exist.
const placeholder = figma.code`${
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
}`.sections;

const content = cells.length > 0 ? cells : placeholder;

export default {
  id: 'Menu',
  imports: ["import { Menu } from '@raystack/apsara'"],
  example: figma.code`<Menu${figma.helpers.react.renderProp(
    'autocomplete',
    autocomplete
  )}>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Content>${content}
      </Menu.Content>
    </Menu>`,
  metadata: { nestable: false }
};
