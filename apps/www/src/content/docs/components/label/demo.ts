'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Label${getPropsString(rest)}>${children}</Label>`;
};

export const playground = {
  type: 'playground',
  controls: {
    required: { type: 'checkbox', defaultValue: true },
    htmlFor: { type: 'text', defaultValue: '' },
    children: { type: 'text', initialValue: 'Label' }
  },
  getCode
};

export const inlineDemo = {
  type: 'code',
  code: `
  <Flex gap="small" align="center">
    <Checkbox id="terms" />
    <Label htmlFor="terms">Accept terms</Label>
  </Flex>`
};

export const optionalDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap="small">
    <Label>Required field</Label>
    <Label required={false}>Optional field</Label>
  </Flex>`
};
