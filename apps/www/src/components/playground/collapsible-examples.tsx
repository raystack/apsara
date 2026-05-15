'use client';

import { Collapsible, Flex, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CollapsibleExamples() {
  return (
    <PlaygroundLayout title='Collapsible'>
      <Flex direction='column' gap={9}>
        <Text>Default:</Text>
        <Collapsible>
          <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
          <Collapsible.Panel>
            <Text>This is the collapsible content that can be toggled.</Text>
          </Collapsible.Panel>
        </Collapsible>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Default open:</Text>
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
          <Collapsible.Panel>
            <Text>This content is visible by default.</Text>
          </Collapsible.Panel>
        </Collapsible>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Disabled:</Text>
        <Collapsible disabled>
          <Collapsible.Trigger>Cannot toggle (disabled)</Collapsible.Trigger>
          <Collapsible.Panel>
            <Text>This content cannot be toggled.</Text>
          </Collapsible.Panel>
        </Collapsible>
      </Flex>
    </PlaygroundLayout>
  );
}
