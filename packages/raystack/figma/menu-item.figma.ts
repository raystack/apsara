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
// The actual icon is a (usually code-connected) instance nested inside the
// "leading" wrapper ("Component Boolean"), so reach into it and render the
// connected icon. When the icon is a one-off vector with no Code Connect, fall
// back to a generic JSX placeholder (not a string) → `leadingIcon={<Icon />}`.
const renderLeadingIcon = function () {
  const leading = figma.selectedInstance.findInstance('leading');
  if (leading && leading.type === 'INSTANCE') {
    const [iconInstance] = leading.findConnectedInstances(() => true, {
      traverseInstances: true
    });
    if (iconInstance && iconInstance.type === 'INSTANCE') {
      return iconInstance.executeTemplate().example;
    }
  }
  return figma.helpers.react.jsxElement('<Icon />');
};
// Icon BOOLEAN → leadingIcon slot.
const icon = figma.selectedInstance.getBoolean('Icon', {
  true: renderLeadingIcon(),
  false: undefined
});
// Avatar BOOLEAN → also rendered via the leadingIcon slot, using the connected
// <Avatar /> component (executeTemplate on the nested Avatar instance).
const avatar = figma.selectedInstance.getBoolean('Avatar', {
  true: (function () {
    const a = figma.selectedInstance.findInstance('Avatar');
    return a && a.type === 'INSTANCE' ? a.executeTemplate().example : undefined;
  })(),
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
// Submenu BOOLEAN → render the item as a Menu.Submenu, moving the label/icons
// onto the Menu.SubmenuTrigger (see the example below).
const submenu = figma.selectedInstance.getBoolean('Submenu');
// "Cell Label" TEXT → the Menu.Item children (the visible item text).
const children = (function () {
  const t = figma.selectedInstance.findText('Cell Label');
  return t && t.type === 'TEXT' ? t.textContent : 'Item';
})();

export default {
  id: 'Menu.Item',
  imports: ["import { Menu } from '@raystack/apsara'"],
  // When Submenu is set, render Menu.Submenu and move the label/icons onto the
  // Menu.SubmenuTrigger; otherwise render a plain Menu.Item.
  example: submenu
    ? figma.code`<Menu.Submenu>
      <Menu.SubmenuTrigger${figma.helpers.react.renderProp(
        'disabled',
        disabled
      )}${figma.helpers.react.renderProp(
        'leadingIcon',
        avatar ?? icon
      )}${figma.helpers.react.renderProp(
        'trailingIcon',
        keyboardShortcut
      )}>${figma.helpers.react.renderChildren(children)}</Menu.SubmenuTrigger>
      <Menu.SubmenuContent />
    </Menu.Submenu>`
    : figma.code`<Menu.Item${figma.helpers.react.renderProp(
        'disabled',
        disabled
      )}${figma.helpers.react.renderProp(
        'leadingIcon',
        avatar ?? icon
      )}${figma.helpers.react.renderProp(
        'trailingIcon',
        keyboardShortcut
      )}>${figma.helpers.react.renderChildren(children)}</Menu.Item>`,
  metadata: { nestable: true }
};
