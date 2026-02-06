'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `
    <Sheet>
      <Sheet.Trigger>
        <Button>Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content${getPropsString(props)}>
        <Sheet.Header>
          <Sheet.Title>Sheet</Sheet.Title>
          <Sheet.Description>A simple sheet</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>Content goes here</Sheet.Body>
      </Sheet.Content>
    </Sheet>`;
};

export const playground = {
  type: 'playground',
  controls: {
    side: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'right'
    },
    showCloseButton: {
      type: 'checkbox',
      defaultValue: true
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Sheet>
    <Sheet.Trigger>
      <Button>Open Sheet</Button>
    </Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Sheet Title</Sheet.Title>
        <Sheet.Description>Sheet description goes here</Sheet.Description>
      </Sheet.Header>
      <Sheet.Body>
        <span>Main content of the sheet</span>
      </Sheet.Body>
    </Sheet.Content>
  </Sheet>`
};

export const positionDemo = {
  type: 'code',
  code: `
  <Flex gap="medium">
    <Sheet>
      <Sheet.Trigger>
        <Button>Top Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side="top">
        <Sheet.Header>
          <Sheet.Title>Top Sheet</Sheet.Title>
          <Sheet.Description>Slides in from the Top</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>Content here</Sheet.Body>
      </Sheet.Content>
    </Sheet>
    <Sheet>
      <Sheet.Trigger>
        <Button>Right Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Right Sheet</Sheet.Title>
          <Sheet.Description>Slides in from the Right</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>Content here</Sheet.Body>
      </Sheet.Content>
    </Sheet>
    <Sheet>
      <Sheet.Trigger>
        <Button>Left Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Left Sheet</Sheet.Title>
          <Sheet.Description>Slides in from the Left</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>Content here</Sheet.Body>
      </Sheet.Content>
    </Sheet>
    <Sheet>
      <Sheet.Trigger>
        <Button>Bottom Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side="bottom">
        <Sheet.Header>
          <Sheet.Title>Bottom Sheet</Sheet.Title>
          <Sheet.Description>Slides in from the Bottom</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>Content here</Sheet.Body>
      </Sheet.Content>
    </Sheet>
  </Flex>`
};
