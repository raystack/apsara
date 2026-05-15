'use client';

import { Flex, Label, Radio } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function RadioExamples() {
  return (
    <PlaygroundLayout title='Radio'>
      <Radio.Group defaultValue='2'>
        <Flex gap={9}>
          <Flex gap={3} align='center'>
            <Radio value='1' id='P1' />
            <Label htmlFor='P1'>Option One</Label>
          </Flex>
          <Flex gap={3} align='center'>
            <Radio value='2' id='P2' />
            <Label htmlFor='P2'>Option Two</Label>
          </Flex>
          <Flex gap={3} align='center'>
            <Radio value='3' id='P3' disabled />
            <Label htmlFor='P3'>Option Three</Label>
          </Flex>
        </Flex>
      </Radio.Group>
    </PlaygroundLayout>
  );
}
