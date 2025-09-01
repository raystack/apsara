'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Avatar${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: ['solid', 'soft'],
      defaultValue: 'soft'
    },
    radius: {
      type: 'select',
      options: ['small', 'full'],
      defaultValue: 'small'
    },
    color: {
      type: 'select',
      options: [
        'indigo',
        'orange',
        'mint',
        'neutral',
        'sky',
        'lime',
        'grass',
        'cyan',
        'iris',
        'purple',
        'pink',
        'crimson',
        'gold'
      ],
      defaultValue: 'indigo'
    },
    size: { type: 'number', defaultValue: 3, min: 1, max: 13 },
    src: {
      type: 'text',
      initialValue:
        'https://images.unsplash.com/photo-1511485977113-f34c92461ad9'
    },
    fallback: { type: 'text', initialValue: 'RC' }
  },
  getCode
};

export const variantDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="end">
    <Avatar size={6} variant="soft" fallback="RC" />
    <Avatar size={6} variant="solid" fallback="RC" />
  </Flex>`
};

export const sizesDemo = {
  type: 'code',
  code: `<Flex gap="large" direction="column">
  <Flex gap="small" align="end">
    <Avatar size={1} fallback="RC" />
    <Avatar size={2} fallback="RC" />
    <Avatar size={3} fallback="RC" />
    <Avatar size={4} fallback="RC" />
    <Avatar size={5} fallback="RC" />
    <Avatar size={6} fallback="RC" />
    <Avatar size={7} fallback="RC" />
    <Avatar size={8} fallback="RC" />
    <Avatar size={9} fallback="RC" />
  </Flex>
  <Flex gap="small">
    <Avatar size={10} fallback="RC" />
    <Avatar size={11} fallback="RC" />
    <Avatar size={12} fallback="RC" />
    <Avatar size={13} fallback="RC" />
  </Flex>
  </Flex>`
};

export const colorsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Base',
      code: `
      <Flex gap="medium">
        <Avatar size={6} color="indigo" fallback="RC" />
        <Avatar size={6} color="orange" fallback="RC" />
        <Avatar size={6} color="mint" fallback="RC" />
        <Avatar size={6} color="neutral" fallback="RC" />
      </Flex>`
    },
    {
      name: 'Extended',
      code: `
      <Flex gap="medium">
        <Avatar size={6} color="sky" fallback="RC" />
        <Avatar size={6} color="lime" fallback="RC" />
        <Avatar size={6} color="grass" fallback="RC" />
        <Avatar size={6} color="cyan" fallback="RC" />
        <Avatar size={6} color="iris" fallback="RC" />
        <Avatar size={6} color="purple" fallback="RC" />
        <Avatar size={6} color="pink" fallback="RC" />
        <Avatar size={6} color="crimson" fallback="RC" />
        <Avatar size={6} color="gold" fallback="RC" />
      </Flex>`
    }
  ]
};

export const radiusDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="end">
    <Avatar size={6} radius="full" fallback="RC" />
    <Avatar size={6} radius="small" fallback="RC" />
  </Flex>`
};
export const imageDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="end">
    <Avatar size={6} radius="full" fallback="RC" src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80" />
    <Avatar size={8} radius="small" fallback="RC" src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80" />
  </Flex>`
};

export const generatedColorDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="end">
    <Avatar size={6} color={getAvatarColor("abcde")} fallback="RC" />
  </Flex>`
};
