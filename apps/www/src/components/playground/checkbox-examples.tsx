'use client';

import { Checkbox, Field, Flex, Text } from '@raystack/apsara';
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
              <Field.Label orientation='horizontal' htmlFor='pg-apple'>
                Apple
              </Field.Label>
            </Flex>
            <Flex gap='small' align='center'>
              <Checkbox name='banana' id='pg-banana' />
              <Field.Label orientation='horizontal' htmlFor='pg-banana'>
                Banana
              </Field.Label>
            </Flex>
            <Flex gap='small' align='center'>
              <Checkbox name='cherry' id='pg-cherry' />
              <Field.Label orientation='horizontal' htmlFor='pg-cherry'>
                Cherry
              </Field.Label>
            </Flex>
          </Flex>
        </Checkbox.Group>
      </Flex>
    </PlaygroundLayout>
  );
}
