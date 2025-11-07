'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `
  <Popover>
    <Popover.Trigger asChild>
      <Button>Top Popover</Button>
    </Popover.Trigger>
    <Popover.Content${getPropsString(rest)}>
    ${children}
    </Popover.Content>
  </Popover>`;
};

export const playground = {
  type: 'playground',
  controls: {
    align: {
      type: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'center'
    },
    alignOffset: { type: 'number', min: 0, defaultValue: 2 },
    side: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom'
    },
    sideOffset: { type: 'number', min: 0, defaultValue: 2 },
    collisionPadding: { type: 'number', min: 0, defaultValue: 0 },
    children: { type: 'text', initialValue: 'This is the popover content.' }
  },
  getCode
};

export const positionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Top',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Top Popover</Button>
        </Popover.Trigger>
        <Popover.Content side="top">
          <Text size="2">Content appears above the trigger</Text>
        </Popover.Content>
      </Popover>`
    },
    {
      name: 'Right',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Right Popover</Button>
        </Popover.Trigger>
        <Popover.Content side="right">
          <Text size="2">Content appears to the right</Text>
        </Popover.Content>
      </Popover>`
    },
    {
      name: 'Bottom',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Bottom Popover</Button>
        </Popover.Trigger>
        <Popover.Content side="bottom">
          <Text size="2">Content appears below the trigger</Text>
        </Popover.Content>
      </Popover>`
    },
    {
      name: 'Left',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Left Popover</Button>
        </Popover.Trigger>
        <Popover.Content side="left">
          <Text size="2">Content appears to the left</Text>
        </Popover.Content>
      </Popover>`
    }
  ]
};
export const alignDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Center',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Center Aligned</Button>
        </Popover.Trigger>
        <Popover.Content align="center">
          <Text size="2">Centered with the trigger</Text>
        </Popover.Content>
      </Popover>`
    },
    {
      name: 'Start',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>Start Aligned</Button>
        </Popover.Trigger>
        <Popover.Content align="start">
          <Text size="2">Aligned to the start</Text>
        </Popover.Content>
      </Popover>`
    },
    {
      name: 'End',
      code: `
      <Popover>
        <Popover.Trigger asChild>
          <Button>End Aligned</Button>
        </Popover.Trigger>
        <Popover.Content align="end">
          <Text size="2">Aligned to the end</Text>
        </Popover.Content>
      </Popover>`
    }
  ]
};
