'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `
    <Drawer${getPropsString(props)}>
      <Drawer.Trigger render={<Button />}>Drawer</Drawer.Trigger>
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
    <Drawer.Trigger render={<Button />}>Open Drawer</Drawer.Trigger>
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
  <Flex gap={5}>
    <Drawer side="top">
      <Drawer.Trigger render={<Button />}>Top Drawer</Drawer.Trigger>
      <Drawer.Content side="top">
        <Drawer.Header>
          <Drawer.Title>Top Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Top</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="right">
      <Drawer.Trigger render={<Button />}>Right Drawer</Drawer.Trigger>
      <Drawer.Content side="right">
        <Drawer.Header>
          <Drawer.Title>Right Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Right</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="left">
      <Drawer.Trigger render={<Button />}>Left Drawer</Drawer.Trigger>
      <Drawer.Content side="left">
        <Drawer.Header>
          <Drawer.Title>Left Drawer</Drawer.Title>
          <Drawer.Description>Slides in from the Left</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Content here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
    <Drawer side="bottom">
      <Drawer.Trigger render={<Button />}>Bottom Drawer</Drawer.Trigger>
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

export const controlledDemo = {
  type: 'code',
  code: `
function ControlledDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex align="center" gap={5}>
      <Button variant="outline" onClick={() => setOpen(true)}>Open from outside</Button>
      <Drawer open={open} onOpenChange={setOpen} side="right">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Text size="small">Closing is owned by the parent, so a save can finish first.</Text>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Flex>
  );
}`
};

export const swipeAreaDemo = {
  type: 'code',
  code: `
function SwipeAreaDemo() {
  const [container, setContainer] = React.useState(null);

  return (
    <div
      ref={setContainer}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', contain: 'layout', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)' }}
    >
      <Drawer side="right" modal={false}>
        <Drawer.SwipeArea
          style={{ backgroundColor: 'var(--rs-color-background-accent-primary)', borderLeft: '2px dashed var(--rs-color-border-accent-emphasis)' }}
        />
        <Flex align="center" justify="center" style={{ minHeight: 320 }}>
          <Text variant="secondary">Swipe from the right edge to open the drawer.</Text>
        </Flex>
        <Drawer.Content container={container}>
          <Drawer.Header>
            <Drawer.Title>Library</Drawer.Title>
            <Drawer.Description>Swipe from the edge whenever you want to jump back into your playlists.</Drawer.Description>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}`
};

export const keyboardDemo = {
  type: 'code',
  code: `
  <Drawer side="bottom">
    <Drawer.Trigger render={<Button />}>Edit profile</Drawer.Trigger>
    <Drawer.Content side="bottom" enableVirtualKeyboard>
      <Drawer.Header>
        <Drawer.Title>Edit profile</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Flex direction="column" gap={3}>
          <Input placeholder="Name" />
          <Input type="email" placeholder="Email" />
        </Flex>
      </Drawer.Body>
    </Drawer.Content>
  </Drawer>`
};

export const indentDemo = {
  type: 'code',
  code: `
function IndentDemo() {
  const [container, setContainer] = React.useState(null);

  return (
    <Drawer.Provider>
      <div
        ref={setContainer}
        style={{ position: 'relative', width: '100%', overflow: 'hidden', contain: 'layout', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)' }}
      >
        <Drawer.Indent style={{ minHeight: 400 }}>
          <Flex align="center" justify="center" style={{ minHeight: 400 }}>
            <Drawer side="bottom" modal={false}>
              <Drawer.Trigger render={<Button />}>Open drawer</Drawer.Trigger>
              <Drawer.Content side="bottom" container={container}>
                <Drawer.Header>
                  <Drawer.Title>Notifications</Drawer.Title>
                  <Drawer.Description>You are all caught up. Good job!</Drawer.Description>
                </Drawer.Header>
              </Drawer.Content>
            </Drawer>
          </Flex>
        </Drawer.Indent>
      </div>
    </Drawer.Provider>
  );
}`
};
