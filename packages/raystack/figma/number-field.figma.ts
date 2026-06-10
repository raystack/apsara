// url=<FIGMA_LINK>?node-id=9047-412
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/number-field/number-field.tsx
// component=NumberField

import figma from 'figma';

// Size VARIANT has a single option (Medium) and there is no corresponding
// `size` prop on NumberField in code (root extends NumberFieldPrimitive.Root.Props),
// so it is intentionally omitted. Compose a realistic example from the public API.

export default {
  id: 'NumberField',
  imports: ["import { NumberField } from '@raystack/apsara'"],
  example: figma.code`<NumberField defaultValue={10}>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField>`,
  metadata: { nestable: true }
};
