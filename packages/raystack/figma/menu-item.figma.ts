// url=<FIGMA_LINK>?node-id=78-570
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/menu/menu-item.tsx
// component=Menu.Item

import figma from 'figma';

// State VARIANT: Hover/Active are purely-visual interaction states with no
// code counterpart and are intentionally skipped. Only Disabled maps to the
// `disabled` prop.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
// Icon BOOLEAN → leadingIcon slot.
const leadingIcon = figma.selectedInstance.getBoolean('Icon', {
  true: '<Icon />',
  false: undefined
});
// Avatar BOOLEAN → also rendered via leadingIcon slot when present.
const avatar = figma.selectedInstance.getBoolean('Avatar', {
  true: '<Avatar />',
  false: undefined
});
// Keyboard Shortcut BOOLEAN → trailingIcon slot.
const keyboardShortcut = figma.selectedInstance.getBoolean(
  'Keyboard Shortcut',
  {
    true: '⌘K',
    false: undefined
  }
);
// Submenu BOOLEAN has no Menu.Item counterpart — submenus use the separate
// Menu.Submenu / Menu.SubmenuTrigger sub-components, so it is intentionally
// not mapped onto Menu.Item.

export default {
  id: 'Menu.Item',
  imports: ["import { Menu } from '@raystack/apsara'"],
  example: figma.code`<Menu.Item${figma.helpers.react.renderProp(
    'disabled',
    disabled
  )}${figma.helpers.react.renderProp(
    'leadingIcon',
    leadingIcon ?? avatar
  )}${figma.helpers.react.renderProp(
    'trailingIcon',
    keyboardShortcut
  )}>Item</Menu.Item>`,
  metadata: { nestable: true }
};
