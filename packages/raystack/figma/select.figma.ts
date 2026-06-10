// url=<FIGMA_LINK>?node-id=6057-3800
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/select/select.tsx
// component=Select

import figma from 'figma';

const instance = figma.selectedInstance;

// Variant Outline/Text → Select.Trigger `variant`.
const variant = instance.getEnum('Variant', {
  Text: 'text'
});
// Size Normal/Small → Select.Trigger `size`. Code sizes are medium/small;
const size = instance.getEnum('Size', {
  Small: 'small'
});
// Icon BOOLEAN gates the leading icon on a Select.Item; the swapped instance
// comes from the "Icon name" INSTANCE_SWAP, resolved dynamically.
const leadingIcon = instance.getBoolean('Icon', {
  true: instance.getInstanceSwap('Icon name')?.executeTemplate().example,
  false: undefined
});

// Chevron / Avatar / Label BOOLEANs and Filled / Hover VARIANTs are visual-only
// (the chevron is always rendered by Select.Trigger; Filled/Hover are states) —
// no matching code props, intentionally not mapped.

export default {
  id: 'Select',
  imports: ["import { Select } from '@raystack/apsara'"],
  example: figma.code`<Select>
  <Select.Trigger${figma.helpers.react.renderProp(
    'variant',
    variant
  )}${figma.helpers.react.renderProp('size', size)}>
    <Select.Value placeholder="Select an option" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option-1"${
      leadingIcon ? figma.code` leadingIcon={${leadingIcon}}` : ''
    }>Option 1</Select.Item>
    <Select.Item value="option-2">Option 2</Select.Item>
  </Select.Content>
</Select>`,
  metadata: { nestable: false }
};
