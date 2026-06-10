// url=<FIGMA_LINK>?node-id=1-84
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/button/button.tsx
// component=Button

import figma from 'figma';

// Component defaults (variant 'solid', color 'accent', size 'normal') are left
// unmapped so getEnum returns undefined and renderProp omits the redundant prop.
const variant = figma.selectedInstance.getEnum('Variant', {
  Outline: 'outline',
  Ghost: 'ghost',
  Text: 'text'
});
const color = figma.selectedInstance.getEnum('Color', {
  Neutral: 'neutral',
  Danger: 'danger',
  Success: 'success'
});
const size = figma.selectedInstance.getEnum('Size', {
  Small: 'small'
});
// Label is a BOOLEAN controlling label visibility; Label Copy holds the text.
const children = figma.selectedInstance.getBoolean('Label', {
  true: figma.selectedInstance.getString('Label Copy'),
  false: undefined
});
// State: Disabled → disabled. Hover is visual-only (no code prop) and is left unmapped.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
const leadingIcon = figma.selectedInstance.getBoolean('Leading Visible', {
  true: figma.selectedInstance
    .getInstanceSwap('Leading Icon')
    ?.executeTemplate().example,
  false: undefined
});
const trailingIcon = figma.selectedInstance.getBoolean('Trailing Visible', {
  true: figma.selectedInstance
    .getInstanceSwap('Trailing Icon')
    ?.executeTemplate().example,
  false: undefined
});
// The "Loading…" label value represents the loading state in the design.
const loading = figma.selectedInstance.getEnum('Label Copy', {
  'Loading...': true
});

export default {
  id: 'Button',
  imports: ["import { Button } from '@raystack/apsara'"],
  example: figma.code`<Button${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp(
    'color',
    color
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp(
    'disabled',
    disabled
  )}${figma.helpers.react.renderProp(
    'leadingIcon',
    loading ? undefined : leadingIcon
  )}${figma.helpers.react.renderProp(
    'trailingIcon',
    trailingIcon
  )}${figma.helpers.react.renderProp(
    'loading',
    loading
  )}>${figma.helpers.react.renderChildren(children)}</Button>`,
  metadata: { nestable: true }
};
