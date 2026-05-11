'use client';

import { Checkbox, Flex, Label, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CheckboxExamples() {
  return (
    <PlaygroundLayout title='Checkbox'>
      <Flex direction='column' gap={9}>
        <Flex gap={5}>
          <Checkbox />
          <Checkbox checked />
          <Checkbox indeterminate />
          <Checkbox checked disabled />
        </Flex>
        <Text size='small' weight='medium'>
          Checkbox.Group
        </Text>
        <Checkbox.Group defaultValue={['banana']}>
          <Flex direction='column' gap={3}>
            <Flex gap={3} align='center'>
              <Checkbox name='apple' id='pg-apple' />
              <Label htmlFor='pg-apple'>Apple</Label>
            </Flex>
            <Flex gap={3} align='center'>
              <Checkbox name='banana' id='pg-banana' />
              <Label htmlFor='pg-banana'>Banana</Label>
            </Flex>
            <Flex gap={3} align='center'>
              <Checkbox name='cherry' id='pg-cherry' />
              <Label htmlFor='pg-cherry'>Cherry</Label>
            </Flex>
          </Flex>
        </Checkbox.Group>
      </Flex>
    </PlaygroundLayout>
  );
}
