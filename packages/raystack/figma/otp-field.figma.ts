// url=<FIGMA_LINK>?node-id=9869-2787
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/otp-field/otp-field.tsx
// component=OTPField

import figma from 'figma';

const instance = figma.selectedInstance;

// "Seperator" [sic] BOOLEAN → render an OTPField.Separator between groups of inputs.
const separator = instance.getBoolean('Seperator', {
  true: true,
  false: undefined
});

// State (Default / Active / Filled / Placeholder) is purely visual — no matching
// code prop on OTPField — intentionally not mapped.

export default {
  id: 'OTPField',
  imports: ["import { OTPField } from '@raystack/apsara'"],
  example: separator
    ? figma.code`<OTPField length={6}>
  <OTPField.Input index={0} />
  <OTPField.Input index={1} />
  <OTPField.Input index={2} />
  <OTPField.Separator />
  <OTPField.Input index={3} />
  <OTPField.Input index={4} />
  <OTPField.Input index={5} />
</OTPField>`
    : figma.code`<OTPField length={6}>
  <OTPField.Input index={0} />
  <OTPField.Input index={1} />
  <OTPField.Input index={2} />
  <OTPField.Input index={3} />
  <OTPField.Input index={4} />
  <OTPField.Input index={5} />
</OTPField>`,
  metadata: { nestable: true }
};
