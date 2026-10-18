'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;
  return `<Callout${getPropsString(
    rest
  )} onDismiss={() => alert("Dismissed")}>${children}</Callout>`;
};

export const playground = {
  type: 'playground',
  controls: {
    color: {
      type: 'select',
      options: [
        'primary',
        'neutral',
        'success',
        'danger',
        'accent',
        'attention',
        'gradient'
      ],
      defaultValue: 'neutral',
      initialValue: 'gradient'
    },
    children: {
      type: 'text',
      initialValue: 'A short message'
    },
    icon: {
      type: 'icon'
    },
    variant: {
      type: 'select',
      options: ['solid', 'outline'],
      defaultValue: 'solid'
    },
    highContrast: {
      type: 'checkbox',
      defaultValue: false
    },
    dismissible: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};
export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout color="neutral">Neutral Callout</Callout>
    <Callout color="success">Success Callout</Callout>
    <Callout color="danger">Danger Callout</Callout>
    <Callout color="gradient">Gradient Callout</Callout>
    <Callout color="accent">Accent Callout</Callout>
    <Callout color="attention">Attention Callout</Callout>
    <Callout color="primary">Primary Callout</Callout>
  </Flex>`
};

export const outlineDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout color="success">Without Outline Callout</Callout>
    <Callout color="success" variant="outline">With Outline Callout</Callout>
  </Flex>`
};

export const highContrastDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout color="danger">Normal Callout</Callout>
    <Callout color="danger" highContrast>High Contrast Callout</Callout>
  </Flex>`
};

export const dismissibleDemo = {
  type: 'code',
  code: `
  <Callout dismissible onDismiss={() => alert("Dismissed!")}>
    Dismissible Callout
  </Callout>`
};

export const actionDemo = {
  type: 'code',
  code: `
  <Callout color="success" action={<Button>Action</Button>}>
    A short message to attract user's attention
  </Callout>`
};
