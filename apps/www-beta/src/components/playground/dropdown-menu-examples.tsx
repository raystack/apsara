'use client';

import { Button, DropdownMenu, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function DropdownMenuExamples() {
  return (
    <PlaygroundLayout title='DropdownMenu'>
      <Flex gap='medium' wrap='wrap'>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button color='neutral'>Open Menu</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Logout</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button color='neutral'>Actions</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item leadingIcon={<>📝</>}>Edit</DropdownMenu.Item>
            <DropdownMenu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>
              Copy
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item leadingIcon={<>🗑️</>}>Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button color='neutral'>More</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Actions</DropdownMenu.Label>
            <DropdownMenu.Group>
              <DropdownMenu.Item>New File</DropdownMenu.Item>
              <DropdownMenu.Item>New Folder</DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>Sort By</DropdownMenu.Label>
            <DropdownMenu.Group>
              <DropdownMenu.Item>Name</DropdownMenu.Item>
              <DropdownMenu.Item>Date</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Flex>
    </PlaygroundLayout>
  );
}
