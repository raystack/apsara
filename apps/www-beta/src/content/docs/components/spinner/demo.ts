'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Spinner${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'number',
      options: [1, 2, 3, 4, 5, 6],
      defaultValue: 1,
      initialValue: 4,
      min: 1,
      max: 6
    },
    color: {
      type: 'select',
      options: [
        'default',
        'neutral',
        'accent',
        'danger',
        'success',
        'attention'
      ],
      defaultValue: 'default'
    }
  },
  getCode
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="center">
    <Spinner size={1} />
    <Spinner size={2} />
    <Spinner size={3} />
    <Spinner size={4} />
    <Spinner size={5} />
    <Spinner size={6} />
  </Flex>`
};
export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Spinner size={4} color="default" />
    <Spinner size={4} color="neutral" />
    <Spinner size={4} color="accent" />
    <Spinner size={4} color="danger" />
    <Spinner size={4} color="success" />
    <Spinner size={4} color="attention" />
  </Flex>`
};
