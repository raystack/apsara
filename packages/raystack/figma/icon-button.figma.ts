// url=<FIGMA_LINK>?node-id=627-576
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/icon-button/icon-button.tsx
// component=IconButton

import figma from 'figma';

const size = figma.selectedInstance.getEnum('Size', {
  '1': 1,
  '3': 3,
  '4': 4
});
// State Hover/Active are visual-only — only Disabled maps to a code prop.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
const children = figma.selectedInstance
  .getInstanceSwap('Icon')
  ?.executeTemplate().example;

export default {
  id: 'IconButton',
  imports: ["import { IconButton } from '@raystack/apsara'"],
  example: figma.code`<IconButton${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp(
    'disabled',
    disabled
  )}>${figma.helpers.react.renderChildren(children)}</IconButton>`,
  metadata: { nestable: true }
};
