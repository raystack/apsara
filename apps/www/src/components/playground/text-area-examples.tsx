'use client';

import { Field, Flex, TextArea } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function TextAreaExamples() {
  return (
    <PlaygroundLayout title='TextArea'>
      <Flex gap='large' wrap='wrap'>
        <Field label='Basic TextArea' helperText='This is a helper text'>
          <TextArea placeholder='Enter your text here' />
        </Field>
        <Field label='Error TextArea' error='This field has an error'>
          <TextArea placeholder='Enter your text here' />
        </Field>
        <TextArea placeholder='Without Field wrapper' width='300px' />
      </Flex>
    </PlaygroundLayout>
  );
}
