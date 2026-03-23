'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<InputField${getPropsString(props)} placeholder="Enter text" />`;
};

export const playground = {
  type: 'playground',
  controls: {
    disabled: { type: 'checkbox', initialValue: false, defaultValue: false },
    leadingIcon: { type: 'icon', initialValue: '' },
    trailingIcon: { type: 'icon', initialValue: '' },
    prefix: { type: 'text', initialValue: '' },
    suffix: { type: 'text', initialValue: '' },
    width: { type: 'text', initialValue: '560px' },
    size: {
      type: 'select',
      options: ['small', 'large'],
      initialValue: 'large'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `<InputField placeholder="Enter text" width="560px" />`
};

export const withFieldDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 560 }}>
  <Field label="Email" required helperText="We won't share your email">
    <InputField type="email" placeholder="Enter email" />
  </Field>
  <Field label="Name" error="This field is required">
    <InputField placeholder="Enter name" />
  </Field>
  <Field label="Phone" optional>
    <InputField type="tel" placeholder="Enter phone" />
  </Field>
</Flex>`
};

export const prefixDemo = {
  type: 'code',
  code: `<InputField
  placeholder="0.00"
  prefix="$"
  suffix="USD"
  width="560px"
/>`
};

export const iconDemo = {
  type: 'code',
  code: `<InputField
  placeholder="Enter text"
  leadingIcon={<Home size={16}/>}
  trailingIcon={<Info size={16}/>}
  width="560px"
/>`
};

export const disabledDemo = {
  type: 'code',
  code: `<InputField
  placeholder="Enter text"
  disabled
  width="560px"
/>`
};

export const widthDemo = {
  type: 'code',
  code: `<InputField
  placeholder="Enter text"
  width="300px"
/>`
};

export const sizeDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium">
  <InputField
    placeholder="32px height (default)"
  />
  <InputField
    placeholder="24px height"
    size="small"
  />
</Flex>`
};

export const sizeChipDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium">
  <InputField
    placeholder="Type and press Enter..."
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
  <InputField
    placeholder="Type and press Enter..."
    size="small"
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
</Flex>`
};
