'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<InputField${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    label: { type: 'text', initialValue: 'Your Name' },
    helperText: { type: 'text', initialValue: 'Enter your full name' },
    error: { type: 'text', initialValue: '' },
    disabled: { type: 'boolean', initialValue: false },
    leadingIcon: { type: 'icon', initialValue: '' },
    trailingIcon: { type: 'icon', initialValue: '' },
    optional: { type: 'checkbox', defaultValue: false },
    prefix: { type: 'text', initialValue: '' },
    suffix: { type: 'text', initialValue: '' },
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
  code: `
  <InputField 
  label="Default"
  placeholder="Enter text"
/>`
};
export const helperTextDemo = {
  type: 'code',
  code: `
  <InputField 
  label="With label"
  placeholder="Enter text"
  helperText="This is a helper text"
/>`
};
export const errorDemo = {
  type: 'code',
  code: `
 <InputField 
  label="With Error"
  placeholder="Enter text"
  error="This field is required"
/>`
};
export const prefixDemo = {
  type: 'code',
  code: `
 <InputField 
  label="With Prefix/Suffix"
  placeholder="0.00"
  prefix="$"
  suffix="USD"
/>`
};
export const iconDemo = {
  type: 'code',
  code: `
 <InputField 
  label="With Icons"
  placeholder="Enter text"
  leadingIcon={<Home size={16}/>}
  trailingIcon={<Info  size={16}/>}
/>`
};
export const optionalDemo = {
  type: 'code',
  code: `
 <InputField 
  label="Optional Field"
  placeholder="Enter text"
  optional
/>`
};
export const disabledDemo = {
  type: 'code',
  code: `
<InputField 
  label="Disabled"
  placeholder="Enter text"
  disabled
/>`
};
export const widthDemo = {
  type: 'code',
  code: `
<InputField 
  label="Custom Width"
  placeholder="Enter text"
  width="300px"
/>`
};
export const sizeDemo = {
  type: 'code',
  code: `
<Flex direction="column" gap="medium">
  <InputField 
    label="Large Input (Default)"
    placeholder="32px height"
  />
  <InputField 
    label="Small Input"
    placeholder="24px height"
    size="small"
  />
</Flex>`
};
export const sizeChipDemo = {
  type: 'code',
  code: `
<Flex direction="column" gap="medium">
  <InputField 
    label="Large Input with Chips"
    placeholder="Type and press Enter..."
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
  <InputField 
    label="Small Input with Chips"
    placeholder="Type and press Enter..."
    size="small"
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
</Flex>`
};
