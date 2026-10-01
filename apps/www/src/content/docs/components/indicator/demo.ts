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
    variant: {
      type: 'select',
      options: ['accent', 'warning', 'danger', 'success', 'neutral'],
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

export const variantDemo = {
  type: 'code',
  code: `
  <Flex gap={9} align="center">
    <Indicator variant="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="warning">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="danger">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="success">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="neutral">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`
};
export const labelDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Indicator variant="accent" label="2 new">
      <Button color='neutral'>Notification</Button>
    </Indicator>
    <Indicator variant="accent">
      <Button color='neutral'>Notification</Button>
    </Indicator>
  </Flex>`
};
export const pulseDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Indicator variant="success" pulse>
      <Button color='neutral'>Live</Button>
    </Indicator>
    <Indicator variant="danger" label="3" pulse>
      <Button color='neutral'>Alerts</Button>
    </Indicator>
  </Flex>`
};
