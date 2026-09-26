'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;

  return `<Chip${getPropsString(rest)}>${children}</Chip>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: ['outline', 'filled'],
      defaultValue: 'outline'
    },
    size: {
      type: 'select',
      options: ['small', 'large'],
      defaultValue: 'small'
    },
    color: {
      type: 'select',
      options: ['neutral', 'accent', 'danger', 'success', 'warning'],
      defaultValue: 'neutral'
    },
    isDismissible: {
      type: 'checkbox',
      defaultValue: false
    },
    children: {
      type: 'text',
      initialValue: 'My Chip'
    },
    leadingIcon: { type: 'icon' },
    trailingIcon: { type: 'icon' }
  },
  getCode
};

export const variantsDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Chip variant="outline">Outline</Chip>
    <Chip variant="filled">Filled</Chip>
  </Flex>`
};

export const sizesDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Chip size="small">Small</Chip>
    <Chip size="large">Large</Chip>
  </Flex>`
};

export const colorDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={5}>
    <Flex gap={9}>
      <Chip color="neutral" variant="outline">Neutral</Chip>
      <Chip color="accent" variant="outline">Accent</Chip>
      <Chip color="danger" variant="outline">Danger</Chip>
      <Chip color="success" variant="outline">Success</Chip>
      <Chip color="warning" variant="outline">Warning</Chip>
    </Flex>
    <Flex gap={9}>
      <Chip color="neutral" variant="filled">Neutral</Chip>
      <Chip color="accent" variant="filled">Accent</Chip>
      <Chip color="danger" variant="filled">Danger</Chip>
      <Chip color="success" variant="filled">Success</Chip>
      <Chip color="warning" variant="filled">Warning</Chip>
    </Flex>
  </Flex>`
};

export const dismissableDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Chip isDismissible onDismiss={() => alert('dismissed')} aria-label="Dismissible chip">Dismissable Chip</Chip>
    <Chip variant="outline" color="accent" isDismissible onDismiss={() => alert('dismissed')} aria-label="Dismissible chip">Dismissable Chip</Chip>
    <Chip variant="filled" color="accent" isDismissible onDismiss={() => alert('dismissed')} aria-label="Dismissible chip">Dismissable Chip</Chip>
  </Flex>`
};

export const iconsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Leading Icon',
      code: `
      <div style={{ display: 'flex', gap: '10px' }}>
        <Chip leadingIcon={'O'}>Add Item</Chip>
        <Chip variant="filled" leadingIcon={'O'} data-state="active">Selected</Chip>
      </div>`
    },
    {
      name: 'Trailing Icon',
      code: `
      <div style={{ display: 'flex', gap: '10px' }}>
        <Chip trailingIcon={'O'}>Next</Chip>
        <Chip variant="filled" trailingIcon={'O'}>Open</Chip>
      </div>`
    },
    {
      name: 'Both Icons',
      code: `
      <div style={{ display: 'flex', gap: '10px' }}>
        <Chip leadingIcon={'O'} trailingIcon={'O'}>Download</Chip>
        <Chip variant="filled" leadingIcon={'O'} trailingIcon={'O'}>Edit Profile</Chip>
      </div>`
    }
  ]
};
