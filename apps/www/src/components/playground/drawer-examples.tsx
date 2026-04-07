'use client';

import { Button, Drawer, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function DrawerExamples() {
  return (
    <PlaygroundLayout title='Drawer'>
      <Flex gap='medium' wrap='wrap'>
        <Drawer side='top'>
          <Drawer.Trigger render={<Button />}>Top Drawer</Drawer.Trigger>
          <Drawer.Content side='top'>
            <Drawer.Title>Top Drawer</Drawer.Title>
            <Drawer.Description>Slides in from the Top</Drawer.Description>
          </Drawer.Content>
        </Drawer>
        <Drawer side='right'>
          <Drawer.Trigger render={<Button />}>Right Drawer</Drawer.Trigger>
          <Drawer.Content side='right'>
            <Drawer.Title>Right Drawer</Drawer.Title>
            <Drawer.Description>Slides in from the Right</Drawer.Description>
          </Drawer.Content>
        </Drawer>
        <Drawer side='left'>
          <Drawer.Trigger render={<Button />}>Left Drawer</Drawer.Trigger>
          <Drawer.Content side='left'>
            <Drawer.Title>Left Drawer</Drawer.Title>
            <Drawer.Description>Slides in from the Left</Drawer.Description>
          </Drawer.Content>
        </Drawer>
        <Drawer side='bottom'>
          <Drawer.Trigger render={<Button />}>Bottom Drawer</Drawer.Trigger>
          <Drawer.Content side='bottom'>
            <Drawer.Title>Bottom Drawer</Drawer.Title>
            <Drawer.Description>Slides in from the Bottom</Drawer.Description>
          </Drawer.Content>
        </Drawer>
      </Flex>
    </PlaygroundLayout>
  );
}
