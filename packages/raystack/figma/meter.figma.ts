// url=<FIGMA_LINK>?node-id=8948-7068
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/meter/meter-root.tsx
// component=Meter

import figma from 'figma';

const instance = figma.selectedInstance;

// Variant VARIANT maps directly to the Meter `variant` prop.
const variant = instance.getEnum('Variant', {
  Linear: 'linear',
  Circular: 'circular'
});

// "Value" text layer (present in both variants) reads like "50%" — extract the
// leading number so it can be passed as the numeric `value` prop.
const valueText = instance.findText('Value');
const valueMatch =
  valueText && valueText.type === 'TEXT'
    ? valueText.textContent.match(/[\d.]+/)
    : null;
const value = valueMatch ? Number(valueMatch[0]) : undefined;

// "Label" text layer (linear variant only) → rendered inside Meter.Label.
const labelText = instance.findText('Label');
const label =
  labelText && labelText.type === 'TEXT' ? labelText.textContent : undefined;

const hasValue = value !== undefined;
const hasLabel = label !== undefined && label !== '';
const isCircular = variant === 'circular';

// Branch on variant + which text layers carry content:
// - circular with Value → compose Track + Value so the percentage text renders.
// - linear with Value + Label → compose the labelled layout.
// - otherwise (no Value text) → the default single-line example.
let example;
if (isCircular) {
  example = hasValue
    ? figma.code`<Meter variant="circular" value={${value}}>
      <Meter.Track />
      <Meter.Value />
    </Meter>`
    : figma.code`<Meter variant="circular" value={50} />`;
} else {
  example =
    hasValue && hasLabel
      ? figma.code`<Meter value={${value}}>
      <Flex justify="between">
        <Meter.Label>${label}</Meter.Label>
        <Meter.Value />
      </Flex>
      <Meter.Track />
    </Meter>`
      : figma.code`<Meter value={${hasValue ? value : 50}} />`;
}

export default {
  id: 'Meter',
  imports:
    !isCircular && hasValue && hasLabel
      ? ["import { Flex, Meter } from '@raystack/apsara'"]
      : ["import { Meter } from '@raystack/apsara'"],
  example,
  metadata: { nestable: true }
};
