'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { label, helperText, error, required, optional, ...rest } = props;
  const fieldProps: Record<string, unknown> = {};
  if (label) fieldProps.label = label;
  if (helperText) fieldProps.helperText = helperText;
  if (error) fieldProps.error = error;
  if (required) fieldProps.required = required;
  if (optional) fieldProps.optional = optional;
  return `<Field${getPropsString(fieldProps)}>
  <InputField${getPropsString(rest)} placeholder="Enter text" />
</Field>`;
};

export const playground = {
  type: 'playground',
  controls: {
    label: { type: 'text', initialValue: 'Email' },
    helperText: { type: 'text', initialValue: "We won't share your email" },
    error: { type: 'text', initialValue: '' },
    required: { type: 'checkbox', initialValue: false, defaultValue: false },
    optional: { type: 'checkbox', initialValue: false, defaultValue: false },
    disabled: { type: 'checkbox', initialValue: false, defaultValue: false }
  },
  getCode
};

export const simpleDemo = {
  type: 'code',
  code: `<Field label="Name" helperText="Enter your full name">
  <InputField placeholder="John Doe" />
</Field>`
};

export const errorDemo = {
  type: 'code',
  code: `<Field label="Email" error="Please enter a valid email address">
  <InputField placeholder="Enter email" />
</Field>`
};

export const helperTextDemo = {
  type: 'code',
  code: `<Field label="Password" helperText="Must be at least 8 characters">
  <InputField type="password" placeholder="Enter password" />
</Field>`
};

export const requiredDemo = {
  type: 'code',
  code: `<Field label="Username" required>
  <InputField placeholder="Enter username" />
</Field>`
};

export const optionalDemo = {
  type: 'code',
  code: `<Field label="Phone Number" optional helperText="We may use this for verification">
  <InputField placeholder="Enter phone number" />
</Field>`
};

export const subComponentDemo = {
  type: 'code',
  code: `<Field name="email">
  <Field.Label>Email</Field.Label>
  <Field.Control required type="email" placeholder="Enter email" />
  <Field.Error match="valueMissing">Email is required</Field.Error>
  <Field.Error match="typeMismatch">Please enter a valid email</Field.Error>
  <Field.Description>We'll send a verification link</Field.Description>
</Field>`
};

export const withInputFieldDemo = {
  type: 'code',
  code: `<Field label="Full Name" required helperText="As it appears on your ID">
  <InputField placeholder="John Doe" />
</Field>`
};

export const withTextAreaDemo = {
  type: 'code',
  code: `<Field label="Bio" optional helperText="Tell us about yourself">
  <TextArea placeholder="Write something..." />
</Field>`
};

export const withSelectDemo = {
  type: 'code',
  code: `<Field label="Country" required>
  <Select>
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="us">United States</Select.Item>
      <Select.Item value="uk">United Kingdom</Select.Item>
      <Select.Item value="ca">Canada</Select.Item>
    </Select.Content>
  </Select>
</Field>`
};
