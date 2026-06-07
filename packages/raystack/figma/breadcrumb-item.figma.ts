// url=<FIGMA_LINK>?node-id=496-882
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/breadcrumb/breadcrumb-item.tsx
// component=Breadcrumb.Item

import figma from 'figma';

const instance = figma.selectedInstance;

// State `Active` maps to the `current` prop; `Default` is the implicit state.
const current = instance.getEnum('State', {
  Active: true
});
// `Show Icon` gates the leading icon INSTANCE_SWAP.
const leadingIcon = instance.getBoolean('Show Icon', {
  true: instance.getInstanceSwap('Icon')?.executeTemplate().example,
  false: undefined
});
// `Label` toggles whether the text label is rendered as children.
const children = instance.getBoolean('Label', {
  true: 'Label',
  false: undefined
});
// `Dropdown` true renders a dropdown menu via the `dropdownItems` prop.
const dropdownItems = instance.getBoolean('Dropdown', {
  true: " dropdownItems={[{ children: 'Option 1' }, { children: 'Option 2' }]}",
  false: ''
});
// `Size` is owned by the Breadcrumb root, not the item — intentionally unmapped.

export default {
  id: 'Breadcrumb.Item',
  imports: ["import { Breadcrumb } from '@raystack/apsara'"],
  example: figma.code`<Breadcrumb.Item${figma.helpers.react.renderProp(
    'current',
    current
  )}${figma.helpers.react.renderProp(
    'leadingIcon',
    leadingIcon
  )}${dropdownItems}>${figma.helpers.react.renderChildren(children)}</Breadcrumb.Item>`,
  metadata: { nestable: true }
};
