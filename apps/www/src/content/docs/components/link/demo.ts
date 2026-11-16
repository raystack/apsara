'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;
  return `<Link${getPropsString(rest)}>${children}</Link>`;
};

export const playground = {
  type: 'playground',
  controls: {
    href: { type: 'text', initialValue: 'https://apsara.raystack.org/' },
    color: {
      type: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'emphasis',
        'accent',
        'attention',
        'danger',
        'success'
      ],
      defaultValue: 'accent'
    },
    size: {
      type: 'select',
      options: ['micro', 'mini', 'small', 'regular', 'large'],
      defaultValue: 'small'
    },
    weight: {
      type: 'select',
      options: ['regular', 'medium'],
      defaultValue: 'regular'
    },
    underline: { type: 'checkbox', defaultValue: false },
    external: { type: 'checkbox', defaultValue: false },
    download: { type: 'checkbox', defaultValue: false },
    children: { type: 'text', initialValue: 'My Link' }
  },
  getCode
};

export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="center">
    <Link href="#" color="primary">Primary Link</Link>
    <Link href="#" color="secondary">Secondary Link</Link>
    <Link href="#" color="tertiary">Tertiary Link</Link>
    <Link href="#" color="accent">Accent Link</Link>
    <Link href="#" color="attention">Attention Link</Link>
    <Link href="#" color="danger">Danger Link</Link>
    <Link href="#" color="success">Success Link</Link>
  </Flex>`
};
export const sizeDemo = {
  type: 'code',
  code: `
  <Flex gap={9} align="center">
     <Link href="#" size="micro">This is a text</Link> 
    <Link href="#" size="mini">This is a text</Link> 
    <Link href="#" size="small">This is a text</Link> 
    <Link href="#" size="regular">This is a text</Link> 
    <Link href="#" size="large">This is a text</Link> 
  </Flex>`
};
export const weightDemo = {
  type: 'code',
  code: `
  <Flex gap={9} align="center">
    <Link href="#" weight="regular">This is a text</Link>
    <Link href="#" weight="medium">This is a text</Link>
  </Flex>`
};
export const styleDemo = {
  type: 'code',
  code: `
  <Flex gap={5} align="end">
    <Link href="#" color="primary" underline>Underlined Link</Link>
    <Link href="https://example.com" external>External Link</Link>
    <Link href="/assets/logo.svg" download>Download File</Link>
  </Flex>`
};
