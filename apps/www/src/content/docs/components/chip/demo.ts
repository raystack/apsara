'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
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
      options: ['neutral', 'accent'],
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
  <Flex gap="large">
    <Chip variant="outline">Outline</Chip>
    <Chip variant="filled">Filled</Chip>
  </Flex>`
};

export const sizesDemo = {
  type: 'code',
  code: `
  <Flex gap="large">
    <Chip size="small">Small</Chip>
    <Chip size="large">Large</Chip>
  </Flex>`
};

export const colorDemo = {
  type: 'code',
  code: `
  <Flex gap="large">
    <Chip color="neutral" variant="outline">Outline</Chip>
    <Chip color="neutral" variant="filled">Filled</Chip>
    <Chip color="accent" variant="outline">Outline</Chip>
    <Chip color="accent" variant="filled">Filled</Chip>
  </Flex>`
};

export const dismissableDemo = {
  type: 'code',
  code: `
  <Flex gap="large">
    <Chip isDismissible onDismiss={() => alert('dismissed')} ariaLabel="Dismissible chip">Dismissable Chip</Chip>
    <Chip variant="outline" color="accent" isDismissible onDismiss={() => alert('dismissed')} ariaLabel="Dismissible chip">Dismissable Chip</Chip>
    <Chip variant="filled" color="accent" isDismissible onDismiss={() => alert('dismissed')} ariaLabel="Dismissible chip">Dismissable Chip</Chip>
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
