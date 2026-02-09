'use client';

import { Button, Flex, Tooltip } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function TooltipExamples() {
  return (
    <PlaygroundLayout title='Tooltip'>
      <Flex gap='medium' align='center' wrap='wrap'>
        <Tooltip>
          <Tooltip.Trigger render={<Button />}>Top</Tooltip.Trigger>
          <Tooltip.Content side='top'>Top tooltip</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger render={<Button />}>Right</Tooltip.Trigger>
          <Tooltip.Content side='right'>Right tooltip</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger render={<Button />}>Bottom</Tooltip.Trigger>
          <Tooltip.Content side='bottom'>Bottom tooltip</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger render={<Button />}>Left</Tooltip.Trigger>
          <Tooltip.Content side='left'>Left tooltip</Tooltip.Content>
        </Tooltip>
      </Flex>
    </PlaygroundLayout>
  );
}
