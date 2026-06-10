// url=<FIGMA_LINK>?node-id=180-585
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/text-area/text-area.tsx
// component=TextArea

import figma from 'figma';

function findTextContent(name: string): string | undefined {
  const node = figma.selectedInstance.findText(name);
  return node && node.type === 'TEXT' ? node.textContent : undefined;
}

// State is a VARIANT. Default/Hover/Active are empty/visual-only and only
// surface the placeholder; Filled / Filled Active surface a typed value.
const placeholder = findTextContent('Place holder');
const value = figma.selectedInstance.getEnum('State', {
  Filled: findTextContent('Filled'),
  'Filled Active': findTextContent('Filled')
});

// Label / Helper text / Optional are Field-level concerns (TextArea itself has
// no label/description/optional props). Info Icon has no code counterpart and
// is intentionally not mapped.
const label = figma.selectedInstance.getBoolean('Label', {
  true: findTextContent('Label'),
  false: undefined
});
const description = figma.selectedInstance.getBoolean('Helper text', {
  true: findTextContent('Helper Text'),
  false: undefined
});
const isOptional = figma.selectedInstance.getBoolean('Optional');

const textArea = figma.code`<TextArea${figma.helpers.react.renderProp(
  'placeholder',
  placeholder
)}${figma.helpers.react.renderProp('value', value)} />`;

const wrapped = figma.code`<Field${figma.helpers.react.renderProp(
  'label',
  label
)}${figma.helpers.react.renderProp(
  'description',
  description
)} required={${!isOptional}}>
  ${textArea}
</Field>`;

export default {
  id: 'TextArea',
  imports: ["import { Field, TextArea } from '@raystack/apsara'"],
  example: label || description || isOptional ? wrapped : textArea,
  metadata: { nestable: false }
};
