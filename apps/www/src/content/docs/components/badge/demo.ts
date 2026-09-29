'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Badge${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: [
        'accent',
        'warning',
        'danger',
        'success',
        'neutral',
        'gradient'
      ],
      defaultValue: 'accent'
    },
    size: {
      type: 'select',
      options: ['micro', 'small', 'regular'],
      defaultValue: 'small'
    },
    outline: {
      type: 'checkbox',
      defaultValue: false
    },
    dot: {
      type: 'checkbox',
      defaultValue: false
    },
    icon: {
      type: 'icon'
    },
    screenReaderText: {
      type: 'text',
      initialValue: 'Notification badge'
    },
    children: {
      type: 'text',
      initialValue: 'New Badge'
    }
  },
  getCode
};

export const variantDemo = {
  type: 'code',
  code: `
  <Flex gap={5}>
    <Badge variant="accent">Accent</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="danger">Danger</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="gradient">Gradient</Badge>
  </Flex>`
};

export const outlineDemo = {
  type: 'code',
  code: `
  <Flex gap={5}>
    <Badge outline variant="accent">Accent</Badge>
    <Badge outline variant="warning">Warning</Badge>
    <Badge outline variant="danger">Danger</Badge>
    <Badge outline variant="success">Success</Badge>
    <Badge outline variant="neutral">Neutral</Badge>
  </Flex>`
};

export const dotDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="center">
    <Badge dot variant="accent" screenReaderText="New" />
    <Badge dot variant="warning" screenReaderText="Pending" />
    <Badge dot variant="danger" screenReaderText="Error" />
    <Badge dot variant="success" screenReaderText="Online" />
    <Badge dot variant="neutral" screenReaderText="Offline" />
  </Flex>`
};

export const sizesDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="center">
    <Badge size="micro">Micro</Badge>
    <Badge size="small">Small</Badge>
    <Badge size="regular">Regular</Badge>
  </Flex>`
};

export const iconDemo = {
  type: 'code',
  code: `
  <Flex gap={5}>
    <Badge icon={<Home size="16"/>}>Badge</Badge>
    <Badge icon={<Laugh size="16"/>}>Badge</Badge>
    <Badge icon="🔥">Badge</Badge>
  </Flex>`
};

export const screenReaderTextDemo = {
  type: 'code',
  code: `
  <Badge screenReaderText="New updates available">
    Updates
  </Badge>`
};
