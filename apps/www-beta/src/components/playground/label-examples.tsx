'use client';

import { Flex, Label } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function LabelExamples() {
  return (
    <PlaygroundLayout title='Label'>
      <Flex gap='extra-large' align='center' wrap='wrap'>
        <Label size='small'>Small Label</Label>
        <Label size='medium'>Medium Label</Label>
        <Label size='large'>Large Label</Label>
        <Label size='medium' required>
          Required Field
        </Label>
        <Label size='medium' required requiredIndicator=' (Required)'>
          Required Field
        </Label>
      </Flex>
    </PlaygroundLayout>
  );
}
