'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<Label${getPropsString(rest)}>${children}</Label>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['small', 'medium', 'large'],
      defaultValue: 'small'
    },
    required: { type: 'checkbox', defaultValue: false },
    requiredIndicator: { type: 'text', defaultValue: '*' },
    children: { type: 'text', initialValue: 'Label' }
  },
  getCode
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Label size="small">Small Label</Label>
    <Label size="medium">Medium Label</Label>
    <Label size="large">Large Label</Label>
  </Flex>`
};
export const requiredDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Label size="medium" required>
      Required Field
      </Label>
      <Label size="medium" required requiredIndicator=" (Required)">
      Required Field
    </Label>
  </Flex>`
};
