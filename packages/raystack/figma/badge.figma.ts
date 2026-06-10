// url=<FIGMA_LINK>?node-id=3463-756
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/badge/badge.tsx
// component=Badge

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Warning: 'warning',
  Danger: 'danger',
  Success: 'success',
  Neutral: 'neutral',
  Gradient: 'gradient'
});
const size = figma.selectedInstance.getEnum('Size', {
  Micro: 'micro',
  Regular: 'regular'
});
// "Icon" BOOLEAN toggles the leading icon; resolve the child instance named "Icon"
// when enabled (guarded — findInstance returns an ErrorHandle when absent).
const icon = figma.selectedInstance.getBoolean('Icon', {
  true: (function () {
    const i = figma.selectedInstance.findInstance('Icon');
    return i && i.type === 'INSTANCE' ? i.executeTemplate().example : undefined;
  })(),
  false: undefined
});
const badgeText = figma.selectedInstance.findText('Badge');
const children =
  badgeText && badgeText.type === 'TEXT' ? badgeText.textContent : 'Badge';

export default {
  id: 'Badge',
  imports: ["import { Badge } from '@raystack/apsara'"],
  example: figma.code`<Badge${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp(
    'icon',
    icon
  )}>${figma.helpers.react.renderChildren(children)}</Badge>`,
  metadata: { nestable: true }
};
