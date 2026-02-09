'use client';

import { Button, Flex, Menu } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function DropdownMenuExamples() {
  return (
    <PlaygroundLayout title='Menu'>
      <Flex gap='medium' wrap='wrap'>
        <Menu>
          <Menu.Trigger render={<Button color='neutral' />}>
            Open Menu
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Profile</Menu.Item>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Logout</Menu.Item>
          </Menu.Content>
        </Menu>
        <Menu>
          <Menu.Trigger render={<Button color='neutral' />}>
            Actions
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item leadingIcon={<>📝</>}>Edit</Menu.Item>
            <Menu.Item leadingIcon={<>📋</>} trailingIcon={<>⌘C</>}>
              Copy
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item leadingIcon={<>🗑️</>}>Delete</Menu.Item>
          </Menu.Content>
        </Menu>
        <Menu>
          <Menu.Trigger render={<Button color='neutral' />}>More</Menu.Trigger>
          <Menu.Content>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Group>
              <Menu.Item>New File</Menu.Item>
              <Menu.Item>New Folder</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Label>Sort By</Menu.Label>
            <Menu.Group>
              <Menu.Item>Name</Menu.Item>
              <Menu.Item>Date</Menu.Item>
            </Menu.Group>
          </Menu.Content>
        </Menu>
      </Flex>
    </PlaygroundLayout>
  );
}
