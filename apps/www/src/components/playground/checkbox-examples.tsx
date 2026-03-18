'use client';

import { Checkbox, Flex, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CheckboxExamples() {
  return (
    <PlaygroundLayout title='Checkbox'>
      <Flex direction='column' gap='large'>
        <Flex gap='medium'>
          <Checkbox />
          <Checkbox checked={true} />
          <Checkbox checked='indeterminate' />
          <Checkbox checked={true} disabled />
        </Flex>
        <Text size={2} weight={500}>
          Checkbox.Group
        </Text>
        <Checkbox.Group defaultValue={['banana']}>
          <Flex direction='column' gap='small'>
            <Flex gap='small' align='center'>
              <Checkbox name='apple' id='pg-apple' />
              <label htmlFor='pg-apple'>Apple</label>
            </Flex>
            <Flex gap='small' align='center'>
              <Checkbox name='banana' id='pg-banana' />
              <label htmlFor='pg-banana'>Banana</label>
            </Flex>
            <Flex gap='small' align='center'>
              <Checkbox name='cherry' id='pg-cherry' />
              <label htmlFor='pg-cherry'>Cherry</label>
            </Flex>
          </Flex>
        </Checkbox.Group>
      </Flex>
    </PlaygroundLayout>
  );
}
