'use client';

import { Flex, TextArea } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function TextAreaExamples() {
  return (
    <PlaygroundLayout title='TextArea'>
      <Flex gap='large' wrap='wrap'>
        <TextArea label='Basic TextArea' placeholder='Enter your text here' />
        <TextArea
          label='Basic TextArea'
          placeholder='Enter your text here'
          helperText='This is a helper text'
        />
        <TextArea
          label='Error TextArea'
          error={true}
          helperText='This field has an error'
          placeholder='Enter your text here'
        />
      </Flex>
    </PlaygroundLayout>
  );
}
