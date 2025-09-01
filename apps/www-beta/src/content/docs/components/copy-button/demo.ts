'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<CopyButton${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: [1, 2, 3, 4],
      defaultValue: 2,
      initialValue: 4
    },
    resetTimeout: {
      type: 'number',
      min: 0,
      defaultValue: 1000
    },
    disabled: { type: 'checkbox', defaultValue: false },
    text: {
      type: 'text',
      initialValue: 'Copy me!'
    }
  },
  getCode
};

export const sizesDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="center">
    <CopyButton text="Copy me!" size={1} />
    <CopyButton text="Copy me!" size={2} />
    <CopyButton text="Copy me!" size={3} />
    <CopyButton text="Copy me!" size={4} />
  </Flex>`
};

export const stateDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="end">
    <CopyButton text="Copy me!" size={4} />
    <CopyButton text="Copy me!" size={4} disabled />
  </Flex>`
};
