'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

const renderInputs = (
  length: number
) => `Array.from({ length: ${length} }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of ${length}\`} />
  ))`;

export const preview = {
  type: 'code',
  code: `<OTPField length={6}>
  {${renderInputs(6)}}
</OTPField>`
};

const getCode = (props: ComponentPropsType) => {
  const { length = 6, ...rest } = props;
  const slotCount = Number(length) || 6;
  return `<OTPField length={${slotCount}}${getPropsString(rest)}>
  {${renderInputs(slotCount)}}
</OTPField>`;
};

export const playground = {
  type: 'playground',
  controls: {
    length: {
      type: 'select',
      options: ['4', '6', '8'],
      defaultValue: '6'
    },
    validationType: {
      type: 'select',
      options: ['numeric', 'alpha', 'alphanumeric', 'none'],
      defaultValue: 'numeric'
    },
    mask: {
      type: 'checkbox',
      defaultValue: false
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    },
    readOnly: {
      type: 'checkbox',
      defaultValue: false
    },
    autoSubmit: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const separatorDemo = {
  type: 'code',
  code: `<OTPField length={6}>
  {Array.from({ length: 3 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
  ))}
  <OTPField.Separator />
  {Array.from({ length: 3 }, (_, i) => (
    <OTPField.Input key={i + 3} aria-label={\`Character \${i + 4} of 6\`} />
  ))}
</OTPField>`
};

export const maskedDemo = {
  type: 'code',
  code: `<OTPField length={6} mask>
  {Array.from({ length: 6 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
  ))}
</OTPField>`
};

export const alphanumericDemo = {
  type: 'code',
  code: `<OTPField length={6} validationType="alphanumeric">
  {Array.from({ length: 6 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
  ))}
</OTPField>`
};

export const disabledDemo = {
  type: 'code',
  code: `<OTPField length={6} disabled defaultValue="123">
  {Array.from({ length: 6 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
  ))}
</OTPField>`
};

export const readOnlyDemo = {
  type: 'code',
  code: `<OTPField length={6} readOnly defaultValue="934821">
  {Array.from({ length: 6 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
  ))}
</OTPField>`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledOTP() {
  const [value, setValue] = React.useState('');

  return (
    <Flex direction="column" gap={4} align="start">
      <OTPField length={6} value={value} onValueChange={setValue}>
        {Array.from({ length: 6 }, (_, i) => (
          <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
        ))}
      </OTPField>
      <Text size="small">Current value: <code>{value || '(empty)'}</code></Text>
    </Flex>
  );
}`
};

export const onCompleteDemo = {
  type: 'code',
  code: `function CompleteOTP() {
  const [submitted, setSubmitted] = React.useState('');

  return (
    <Flex direction="column" gap={4} align="start">
      <OTPField
        length={6}
        onValueComplete={(value) => setSubmitted(value)}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
        ))}
      </OTPField>
      <Text size="small">
        {submitted ? \`Submitted: \${submitted}\` : 'Type all 6 digits to submit'}
      </Text>
    </Flex>
  );
}`
};

export const customSanitizeDemo = {
  type: 'code',
  code: `<OTPField
  length={4}
  validationType="none"
  inputMode="numeric"
  sanitizeValue={(val) => val.replace(/[^0-3]/g, '')}
>
  {Array.from({ length: 4 }, (_, i) => (
    <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 4\`} />
  ))}
</OTPField>`
};

export const withFieldDemo = {
  type: 'code',
  code: `<Flex justify="center">
  <Field label="Verification code" description="Enter the 6-digit code we sent to your device.">
    <OTPField length={6}>
      {Array.from({ length: 6 }, (_, i) => (
        <OTPField.Input key={i} aria-label={\`Character \${i + 1} of 6\`} />
      ))}
    </OTPField>
  </Field>
</Flex>`
};
