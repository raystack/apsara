'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;
  return `<Headline${getPropsString(rest)}>${children}</Headline>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['t1', 't2', 't3', 't4'],
      defaultValue: 't2'
    },
    weight: {
      type: 'select',
      options: ['regular', 'medium'],
      defaultValue: 'medium'
    },
    render: {
      type: 'select',
      options: ['<h1 />', '<h2 />', '<h3 />', '<h4 />', '<h5 />', '<h6 />'],
      defaultValue: '<h2 />'
    },
    align: {
      type: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: 'left',
      initialValue: 'center'
    },
    truncate: { type: 'checkbox', defaultValue: false },
    children: { type: 'text', initialValue: 'This is a Headline' }
  },
  getCode
};

export const alignDemo = {
  type: 'code',
  code: `
  <Flex direction="column" style={{width:"100%"}} gap="large">
    <Headline size="t2" align="left">Left Aligned</Headline>
    <Headline size="t2" align="center">Center Aligned</Headline>
    <Headline size="t2" align="right">Right Aligned</Headline>
  </Flex>`
};
export const truncateDemo = {
  type: 'code',
  code: `
  <Flex style={{ width: "200px" }}>
    <Headline size="t2" truncate>
      This is a very long headline that will be truncated with an ellipsis
    </Headline>
  </Flex>`
};

export const weightDemo = {
  type: 'code',
  code: `
  <Flex direction="column" style={{width:"100%"}} gap="large">
    <Headline size="t2" weight="regular">Regular Weight Headline</Headline>
    <Headline size="t2" weight="medium">Medium Weight Headline</Headline>
  </Flex>`
};
