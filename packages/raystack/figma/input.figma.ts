// url=<FIGMA_LINK>?node-id=1-297
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/input/input.tsx
// component=Input

import figma from 'figma';

const findTextContent = (name: string) => {
  const t = figma.selectedInstance.findText(name);
  return t && t.type === 'TEXT' ? t.textContent : undefined;
};

// Variant Normal/Chips have no prefix/suffix code prop — only Prefix/Suffix map.
const prefix = figma.selectedInstance.getEnum('Variant', {
  Prefix: findTextContent('Prefix')
});
const suffix = figma.selectedInstance.getEnum('Variant', {
  Suffix: findTextContent('Suffix')
});
// State Hover/Active/Filled Active are visual-only — only Disabled maps.
const disabled = figma.selectedInstance.getEnum('State', {
  Disabled: true
});
const placeholder = figma.selectedInstance.getEnum('State', {
  Default: findTextContent('Place holder'),
  Active: findTextContent('Place holder'),
  Hover: findTextContent('Place holder'),
  Disabled: findTextContent('Place holder')
});
const value = figma.selectedInstance.getEnum('State', {
  Filled: figma.selectedInstance.getEnum('Variant', {
    Normal: findTextContent('Filled'),
    Prefix: findTextContent('Input text'),
    Suffix: findTextContent('Input text')
  }),
  'Filled Active': figma.selectedInstance.getEnum('Variant', {
    Normal: findTextContent('Filled'),
    Prefix: findTextContent('Input text'),
    Suffix: findTextContent('Input text')
  })
});
const size = figma.selectedInstance.getEnum('Size', {
  Small: 'small'
});
const label = figma.selectedInstance.getBoolean('Label', {
  true: findTextContent('Label'),
  false: undefined
});
const description = figma.selectedInstance.getBoolean('Helper text', {
  true: findTextContent('Helper Text'),
  false: undefined
});
const optional = figma.selectedInstance.getBoolean('Optional');
// "Leading Icon" BOOLEAN toggles the leading icon; resolve the child instance
// named "Leading Icon" when enabled (guarded — ErrorHandle when absent).
const leadingIcon = figma.selectedInstance.getBoolean('Leading Icon', {
  true: (function () {
    const i = figma.selectedInstance.findInstance('Leading Icon');
    return i && i.type === 'INSTANCE' ? i.executeTemplate().example : undefined;
  })(),
  false: undefined
});

const input = figma.code`<Input${figma.helpers.react.renderProp(
  'prefix',
  prefix
)}${figma.helpers.react.renderProp(
  'suffix',
  suffix
)}${figma.helpers.react.renderProp(
  'leadingIcon',
  leadingIcon
)}${figma.helpers.react.renderProp(
  'disabled',
  disabled
)}${figma.helpers.react.renderProp(
  'placeholder',
  placeholder
)}${figma.helpers.react.renderProp(
  'value',
  value
)}${figma.helpers.react.renderProp('size', size)} />`;

// Wrap in a Field only when label/description/optional are present.
const wrapped = figma.code`<Field${figma.helpers.react.renderProp(
  'label',
  label
)}${figma.helpers.react.renderProp(
  'description',
  description
)} required={${!optional}}>
  ${input}
</Field>`;

export default {
  id: 'Input',
  imports: ["import { Field, Input } from '@raystack/apsara'"],
  example: label || description || optional ? wrapped : input,
  metadata: { nestable: false }
};
