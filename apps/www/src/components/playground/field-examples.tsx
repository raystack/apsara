'use client';

import { Field, Flex, InputField, TextArea } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FieldExamples() {
  return (
    <PlaygroundLayout title='Field'>
      <Flex gap='large' wrap='wrap'>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <Field label='Name' required description='Enter your full name'>
            <InputField placeholder='John Doe' />
          </Field>
          <Field label='Email' error='Please enter a valid email'>
            <InputField type='email' placeholder='Enter email' />
          </Field>
          <Field label='Phone' optional>
            <InputField placeholder='Enter phone' />
          </Field>
        </Flex>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <Field label='Bio' optional description='Tell us about yourself'>
            <TextArea placeholder='Write something...' />
          </Field>
          <Field label='Disabled' disabled>
            <InputField placeholder='Cannot edit' />
          </Field>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
