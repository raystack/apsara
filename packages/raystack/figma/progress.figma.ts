// url=<FIGMA_LINK>?node-id=8946-5318
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/progress/progress-root.tsx
// component=Progress

import figma from 'figma';

const instance = figma.selectedInstance;

// Variant Linear/Circular → code `variant` prop (linear | circular).
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

// "Label" text layer (linear variant only) → rendered inside Progress.Label.
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
    ? figma.code`<Progress variant="circular" value={${value}}>
      <Progress.Track />
      <Progress.Value />
    </Progress>`
    : figma.code`<Progress variant="circular" value={50} />`;
} else {
  example =
    hasValue && hasLabel
      ? figma.code`<Progress value={${value}}>
      <Flex justify="between">
        <Progress.Label>${label}</Progress.Label>
        <Progress.Value />
      </Flex>
      <Progress.Track />
    </Progress>`
      : figma.code`<Progress value={${hasValue ? value : 50}} />`;
}

export default {
  id: 'Progress',
  imports:
    !isCircular && hasValue && hasLabel
      ? ["import { Flex, Progress } from '@raystack/apsara'"]
      : ["import { Progress } from '@raystack/apsara'"],
  example,
  metadata: { nestable: true }
};
