'use client';

import { Button, Flex, Popover, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function PopoverExamples() {
  return (
    <PlaygroundLayout title='Popover'>
      <Flex gap={5} wrap='wrap'>
        <Popover>
          <Popover.Trigger render={<Button />}>Top Popover</Popover.Trigger>
          <Popover.Content side='top'>
            <Text size='small'>Content appears above the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>Right Popover</Popover.Trigger>
          <Popover.Content side='right'>
            <Text size='small'>Content appears to the right</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>Bottom Popover</Popover.Trigger>
          <Popover.Content side='bottom'>
            <Text size='small'>Content appears below the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>Left Popover</Popover.Trigger>
          <Popover.Content side='left'>
            <Text size='small'>Content appears to the left</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>Center Aligned</Popover.Trigger>
          <Popover.Content align='center'>
            <Text size='small'>Centered with the trigger</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>Start Aligned</Popover.Trigger>
          <Popover.Content align='start'>
            <Text size='small'>Aligned to the start</Text>
          </Popover.Content>
        </Popover>
        <Popover>
          <Popover.Trigger render={<Button />}>End Aligned</Popover.Trigger>
          <Popover.Content align='end'>
            <Text size='small'>Aligned to the end</Text>
          </Popover.Content>
        </Popover>
      </Flex>
    </PlaygroundLayout>
  );
}
