'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Separator${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: ['full', 'middle'],
      defaultValue: 'full'
    },
    color: {
      type: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      defaultValue: 'primary'
    },
    orientation: {
      type: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal'
    }
  },
  getCode
};
export const variantDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={9} align="center" style={{width:"400px"}}>
    <Separator variant="full" />
    <Separator variant="middle" />
  </Flex>`
};

export const colorDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={9} align="center" style={{width:"400px"}}>
    <Separator color="primary" />
    <Separator color="secondary" />
    <Separator color="tertiary" />
  </Flex>`
};
export const orientationDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={5} style={{width:"400px"}}>
    <Text>Above</Text>
    <Separator />
    <Flex gap={5} align="center" style={{height:"24px"}}>
      <Text>Left</Text>
      <Separator orientation="vertical" />
      <Text>Right</Text>
    </Flex>
  </Flex>`
};
