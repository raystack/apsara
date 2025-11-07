'use client';

import { Flex, Radio } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function RadioExamples() {
  return (
    <PlaygroundLayout title='Radio'>
      <Radio defaultValue='2'>
        <Flex gap='large'>
          <Flex gap='small' align='center'>
            <Radio.Item value='1' id='P1' />
            <label htmlFor='P1'>Option One</label>
          </Flex>
          <Flex gap='small' align='center'>
            <Radio.Item value='2' id='P2' />
            <label htmlFor='P2'>Option Two</label>
          </Flex>
          <Flex gap='small' align='center'>
            <Radio.Item value='3' id='P3' disabled />
            <label htmlFor='P3'>Option Three</label>
          </Flex>
        </Flex>
      </Radio>
    </PlaygroundLayout>
  );
}
