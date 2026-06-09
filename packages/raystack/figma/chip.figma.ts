// url=<FIGMA_LINK>?node-id=3388-602
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/chip/chip.tsx
// component=Chip

import figma from 'figma';

const variant = figma.selectedInstance.getEnum('Variant', {
  Filled: 'filled',
  Outline: 'outline'
});
const size = figma.selectedInstance.getEnum('Size', {
  Small: 'small',
  Large: 'large'
});
const color = figma.selectedInstance.getEnum('Style', {
  Neutral: 'neutral',
  Accent: 'accent'
});
// State (Default/Hover/Active) is visual-only — no code counterpart, intentionally unmapped.
// children, dismiss and the leading/trailing icons live on the nested
// ".chip_structure" instance (guarded — findInstance returns an ErrorHandle
// when absent).
const structure = (function () {
  const nested = figma.selectedInstance.findInstance('.chip_structure');
  if (!nested || nested.type !== 'INSTANCE') {
    return {
      children: undefined,
      isDismissible: undefined,
      leadingIcon: undefined,
      trailingIcon: undefined
    };
  }
  // The icons are fixed nested instances (not instance-swap props) toggled by
  // the "Leading icon" / "Trailing icon" BOOLEANs, so resolve them by layer
  // name and render their connected component.
  const renderNestedIcon = function (layerName: string) {
    const icon = nested.findInstance(layerName);
    return icon && icon.type === 'INSTANCE'
      ? icon.executeTemplate().example
      : undefined;
  };
  return {
    children: nested.getBoolean('Label', {
      true: (function () {
        const t = nested.findText('Label');
        return t && t.type === 'TEXT' ? t.textContent : undefined;
      })(),
      false: undefined
    }),
    isDismissible: nested.getBoolean('Dismiss'),
    // `leadingIcon` is driven by either the "Avatar" or the "Leading icon"
    // BOOLEAN. Avatar takes precedence and renders the connected <Avatar />.
    leadingIcon: nested.getBoolean('Avatar', {
      true: renderNestedIcon('Avatar'),
      false: nested.getBoolean('Leading icon', {
        true: renderNestedIcon('Leading icon'),
        false: undefined
      })
    }),
    trailingIcon: nested.getBoolean('Trailing icon', {
      true: renderNestedIcon('Trailing icon'),
      false: undefined
    })
  };
})();

export default {
  id: 'Chip',
  imports: ["import { Chip } from '@raystack/apsara'"],
  example: figma.code`<Chip${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp(
    'color',
    color
  )}${figma.helpers.react.renderProp(
    'leadingIcon',
    structure.leadingIcon
  )}${figma.helpers.react.renderProp(
    'trailingIcon',
    structure.trailingIcon
  )}${figma.helpers.react.renderProp('isDismissible', structure.isDismissible)}>
      ${figma.helpers.react.renderChildren(structure.children)}
    </Chip>`,
  metadata: { nestable: true }
};
