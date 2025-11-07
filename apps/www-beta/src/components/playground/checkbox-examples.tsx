'use client';

import { Checkbox, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function CheckboxExamples() {
  return (
    <PlaygroundLayout title='Checkbox'>
      <Flex gap='medium'>
        <Checkbox />
        <Checkbox checked={true} />
        <Checkbox checked='indeterminate' />
        <Checkbox checked={true} disabled />
      </Flex>
    </PlaygroundLayout>
  );
}
