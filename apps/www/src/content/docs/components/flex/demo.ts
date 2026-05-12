'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `
    <Flex${getPropsString(props)} style={{width:"100%",height:"100%"}}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>`;
};
export const playground = {
  type: 'playground',
  controls: {
    gap: {
      type: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      initialValue: 3
    },
    wrap: {
      type: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      initialValue: 'wrap'
    },
    justify: {
      type: 'select',
      options: ['start', 'end', 'center', 'between'],
      initialValue: 'center'
    },
    align: {
      type: 'select',
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
      initialValue: 'center'
    },
    direction: {
      type: 'select',
      options: ['row', 'rowReverse', 'column', 'columnReverse'],
      initialValue: 'row'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Flex gap={5} direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
    <Flex gap={5} direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
  </Flex>`
};
