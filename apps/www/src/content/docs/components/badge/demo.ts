'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Badge${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    color: {
      type: 'select',
      options: [
        'accent',
        'attention',
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

export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap={5}>
    <Badge color="accent">Accent</Badge>
    <Badge color="attention">Attention</Badge>
    <Badge color="danger">Danger</Badge>
    <Badge color="success">Success</Badge>
    <Badge color="neutral">Neutral</Badge>
    <Badge color="gradient">Gradient</Badge>
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
