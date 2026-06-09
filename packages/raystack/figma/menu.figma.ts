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

// Empty BOOLEAN → render the actual "Empty state" layer (an EmptyState
// instance) when present; otherwise fall back to the default Menu.EmptyState.
const emptyContent = (function () {
  const layer = instance.findInstance('Empty state');
  if (layer && layer.type === 'INSTANCE') {
    return layer.executeTemplate().example;
  }
  return figma.code`
        <Menu.EmptyState>No results found</Menu.EmptyState>`.sections;
})();

// Options BOOLEAN → placeholder items, shown only when there are no real cells.
const optionsPlaceholder = options
  ? figma.code`
        <Menu.Item value='profile'>Profile</Menu.Item>
        <Menu.Item value='settings'>Settings</Menu.Item>`.sections
  : [];

// Content priority: empty state → real cells → placeholder options.
const content = empty
  ? emptyContent
  : cells.length > 0
    ? cells
    : optionsPlaceholder;

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
