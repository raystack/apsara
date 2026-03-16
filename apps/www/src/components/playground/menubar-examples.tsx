'use client';

import { Flex, Menu, Menubar } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function MenubarExamples() {
  return (
    <PlaygroundLayout title='Menubar'>
      <Flex direction='column' gap='large'>
        <Menubar>
          <Menu>
            <Menu.Trigger>File</Menu.Trigger>
            <Menu.Content>
              <Menu.Item>New Tab</Menu.Item>
              <Menu.Item>New Window</Menu.Item>
              <Menu.Separator />
              <Menu.Item>Print</Menu.Item>
            </Menu.Content>
          </Menu>
          <Menu>
            <Menu.Trigger>Edit</Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Undo</Menu.Item>
              <Menu.Item>Redo</Menu.Item>
              <Menu.Separator />
              <Menu.Item>Cut</Menu.Item>
              <Menu.Item>Copy</Menu.Item>
              <Menu.Item>Paste</Menu.Item>
            </Menu.Content>
          </Menu>
          <Menu>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Zoom In</Menu.Item>
              <Menu.Item>Zoom Out</Menu.Item>
              <Menu.Separator />
              <Menu.Item>Fullscreen</Menu.Item>
            </Menu.Content>
          </Menu>
        </Menubar>
      </Flex>
    </PlaygroundLayout>
  );
}
