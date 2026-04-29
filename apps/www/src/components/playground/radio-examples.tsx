'use client';

import { Field, Flex, Radio } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function RadioExamples() {
  return (
    <PlaygroundLayout title='Radio'>
      <Radio.Group defaultValue='2'>
        <Flex gap='large'>
          <Flex gap='small' align='center'>
            <Radio value='1' id='P1' />
            <Field.Label orientation='horizontal' htmlFor='P1'>
              Option One
            </Field.Label>
          </Flex>
          <Flex gap='small' align='center'>
            <Radio value='2' id='P2' />
            <Field.Label orientation='horizontal' htmlFor='P2'>
              Option Two
            </Field.Label>
          </Flex>
          <Flex gap='small' align='center'>
            <Radio value='3' id='P3' disabled />
            <Field.Label orientation='horizontal' htmlFor='P3'>
              Option Three
            </Field.Label>
          </Flex>
        </Flex>
      </Radio.Group>
    </PlaygroundLayout>
  );
}
