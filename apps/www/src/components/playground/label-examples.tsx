'use client';

import { Checkbox, Flex, Label } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function LabelExamples() {
  return (
    <PlaygroundLayout title='Label'>
      <Flex direction='column' gap='large'>
        <Flex direction='column' gap='small'>
          <Label htmlFor='pg-label-email'>Email</Label>
          <Label htmlFor='pg-label-name' required={false}>
            Display name
          </Label>
        </Flex>
        <Flex gap='small' align='center'>
          <Checkbox id='pg-label-terms' />
          <Label htmlFor='pg-label-terms'>Accept terms</Label>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
