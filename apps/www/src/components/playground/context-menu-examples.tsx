'use client';

import { ContextMenu, Flex, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ContextMenuExamples() {
  return (
    <PlaygroundLayout title='Context Menu'>
      <Flex gap='medium' wrap='wrap'>
        <ContextMenu>
          <ContextMenu.Trigger
            style={{
              padding: '2em 4em',
              border: '1px dashed var(--rs-color-border-base-primary)',
              borderRadius: 'var(--rs-radius-2)'
            }}
          >
            <Text>Right click here</Text>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Profile</ContextMenu.Item>
            <ContextMenu.Item>Settings</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Logout</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
        <ContextMenu>
          <ContextMenu.Trigger
            style={{
              padding: '2em 4em',
              border: '1px dashed var(--rs-color-border-base-primary)',
              borderRadius: 'var(--rs-radius-2)'
            }}
          >
            <Text>With icons</Text>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item leadingIcon={<>📝</>}>Edit</ContextMenu.Item>
            <ContextMenu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>
              Copy
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item leadingIcon={<>🗑️</>}>Delete</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
        <ContextMenu>
          <ContextMenu.Trigger
            style={{
              padding: '2em 4em',
              border: '1px dashed var(--rs-color-border-base-primary)',
              borderRadius: 'var(--rs-radius-2)'
            }}
          >
            <Text>With groups</Text>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Group>
              <ContextMenu.Label>Actions</ContextMenu.Label>
              <ContextMenu.Item>New File</ContextMenu.Item>
              <ContextMenu.Item>New Folder</ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Label>Sort By</ContextMenu.Label>
              <ContextMenu.Item>Name</ContextMenu.Item>
              <ContextMenu.Item>Date</ContextMenu.Item>
            </ContextMenu.Group>
          </ContextMenu.Content>
        </ContextMenu>
      </Flex>
    </PlaygroundLayout>
  );
}
