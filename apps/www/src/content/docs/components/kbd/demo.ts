'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;

  return `<Kbd${getPropsString(rest)}>${children}</Kbd>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: ['solid', 'ghost'],
      defaultValue: 'solid'
    },
    children: {
      type: 'text',
      initialValue: 'Esc'
    }
  },
  getCode
};

export const singleDemo = {
  type: 'code',
  code: `<Flex gap={5} align="center">
    <Kbd>Esc</Kbd>
    <Kbd aria-label="Command">⌘</Kbd>
    <Kbd aria-label="Shift">⇧</Kbd>
    <Kbd aria-label="Enter">↵</Kbd>
    <Kbd>Tab</Kbd>
  </Flex>`
};

export const variantDemo = {
  type: 'code',
  code: `<Flex gap={7} align="center">
    <Kbd.Group>
      <Kbd aria-label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
    <Kbd.Group variant="ghost">
      <Kbd aria-label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
  </Flex>`
};

export const groupDemo = {
  type: 'code',
  code: `<Flex gap={7} align="center">
    <Kbd.Group>
      <Kbd aria-label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
    <Kbd.Group>
      <Kbd aria-label="Command">⌘</Kbd>
      <Kbd aria-label="Shift">⇧</Kbd>
      <Kbd>P</Kbd>
    </Kbd.Group>
  </Flex>`
};

export const separatorDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Plus',
      code: `<Kbd.Group>
        <Kbd aria-label="Command">⌘</Kbd>
        +
        <Kbd>K</Kbd>
      </Kbd.Group>`
    },
    {
      name: 'Then',
      code: `<Kbd.Group>
        <Kbd>G</Kbd>
        then
        <Kbd>P</Kbd>
      </Kbd.Group>`
    }
  ]
};

export const withTextDemo = {
  type: 'code',
  code: `<Text size="small" variant="secondary">
    Press <Kbd.Group><Kbd aria-label="Command">⌘</Kbd><Kbd>K</Kbd></Kbd.Group> to open the command palette.
  </Text>`
};

export const withInputDemo = {
  type: 'code',
  code: `<Input
    placeholder="Search projects"
    trailingIcon={<Kbd variant="ghost" aria-label="Command K">⌘K</Kbd>}
  />`
};

export const withTooltipDemo = {
  type: 'code',
  code: `<Tooltip>
    <Tooltip.Trigger render={<Button variant="outline" />}>
      Search
    </Tooltip.Trigger>
    <Tooltip.Content>
      <Flex gap={3} align="center">
        Open search
        <Kbd.Group variant="ghost">
          <Kbd aria-label="Command">⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>
      </Flex>
    </Tooltip.Content>
  </Tooltip>`
};
