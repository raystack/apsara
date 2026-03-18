'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: Record<string, unknown>) => {
  return `
    <Drawer${getPropsString(props)}>
      <Drawer.Trigger>
        <Button>Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content${getPropsString(props)}>
        <Drawer.Header>
          <Drawer.Title>Drawer</Drawer.Title>
          <Drawer.Description>A simple drawer</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content goes here</Drawer.Body>
      </Drawer.Content>
    </Drawer>`;
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
  <Drawer side="right">
    <Drawer.Trigger>
      <Button>Open Drawer</Button>
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Drawer Title</Drawer.Title>
        <Drawer.Description>Drawer description goes here</Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>
        <span>Main content of the drawer</span>
      </Drawer.Body>
    </Drawer.Content>
  </Drawer>`
};

export const positionDemo = {
  type: 'code',
  code: `
  <Flex gap="medium">
    <Drawer side="top">
      <Drawer.Trigger>
        <Button>Top Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content side="top">
        <Drawer.Header>
          <Drawer.Title>Top Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Top</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="right">
      <Drawer.Trigger>
        <Button>Right Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content side="right">
        <Drawer.Header>
          <Drawer.Title>Right Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Right</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="left">
      <Drawer.Trigger>
        <Button>Left Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content side="left">
        <Drawer.Header>
          <Drawer.Title>Left Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Left</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="bottom">
      <Drawer.Trigger>
        <Button>Bottom Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content side="bottom">
        <Drawer.Header>
          <Drawer.Title>Bottom Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Bottom</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
  </Flex>`
};
