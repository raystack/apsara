'use client';

import { Field, Flex, TextArea } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function TextAreaExamples() {
  return (
    <PlaygroundLayout title='TextArea'>
      <Flex gap={9} wrap='wrap'>
        <Field label='Basic TextArea' description='This is a description'>
          <TextArea placeholder='Enter your text here' />
        </Field>
        <Field label='Error TextArea' error='This field has an error'>
          <TextArea placeholder='Enter your text here' />
        </Field>
        <TextArea
          placeholder='Without Field wrapper'
          style={{ width: '300px' }}
        />
      </Flex>
    </PlaygroundLayout>
  );
}
