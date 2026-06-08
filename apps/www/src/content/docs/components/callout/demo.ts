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
    type: {
      type: 'select',
      options: [
        'grey',
        'success',
        'alert',
        'gradient',
        'accent',
        'attention',
        'normal'
      ],
      defaultValue: 'grey',
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
export const typeDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout type="grey">Default Callout</Callout>
    <Callout type="success">Success Callout</Callout>
    <Callout type="alert">Alert Callout</Callout>
    <Callout type="gradient">Gradient Callout</Callout>
    <Callout type="accent">Accent Callout</Callout>
    <Callout type="attention">Attention Callout</Callout>
    <Callout type="normal">Normal Callout</Callout>
  </Flex>`
};

export const outlineDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout type="success">Without Outline Callout</Callout>
    <Callout type="success" variant="outline">With Outline Callout</Callout>
  </Flex>`
};

export const highContrastDemo = {
  type: 'code',
  code: `
  <Flex gap={5} direction="column">
    <Callout type="alert">Normal Callout</Callout>
    <Callout type="alert" highContrast>High Contrast Callout</Callout>
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
  <Callout type="success" action={<Button>Action</Button>}>
    A short message to attract user's attention
  </Callout>`
};
