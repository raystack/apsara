'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;
  return `<Indicator${getPropsString(rest)}>${children}</Indicator>`;
};

export const playground = {
  type: 'playground',
  controls: {
    color: {
      type: 'select',
      options: ['accent', 'attention', 'danger', 'success', 'neutral'],
      defaultValue: 'accent'
    },
    label: { type: 'text', initialValue: '' },
    pulse: { type: 'checkbox', defaultValue: false },
    children: {
      type: 'text',
      initialValue: "<Button color='neutral'>Notification</Button>"
    }
  },
  getCode
};

export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap={9} align="center">
    <Indicator color="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator color="attention">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator color="danger">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator color="success">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator color="neutral">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`
};
export const labelDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Indicator color="accent" label="2 new">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator color="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`
};
export const pulseDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Indicator color="success" pulse>
      <Button color='neutral'>Live</Button>
    </Indicator>
    <Indicator color="danger" label="3" pulse>
      <Button color='neutral'>Alerts</Button>
    </Indicator>
  </Flex>`
};
