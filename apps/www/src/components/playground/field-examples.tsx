'use client';

import { Field, Flex, Input, TextArea } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FieldExamples() {
  return (
    <PlaygroundLayout title='Field'>
      <Flex gap={9} wrap='wrap'>
        <Flex gap={9} direction='column' style={{ width: 300 }}>
          <Field label='Name' required description='Enter your full name'>
            <Input placeholder='John Doe' />
          </Field>
          <Field label='Email' error='Please enter a valid email'>
            <Input type='email' placeholder='Enter email' />
          </Field>
          <Field label='Phone' required={false}>
            <Input placeholder='Enter phone' />
          </Field>
        </Flex>
        <Flex gap={9} direction='column' style={{ width: 300 }}>
          <Field
            label='Bio'
            required={false}
            description='Tell us about yourself'
          >
            <TextArea placeholder='Write something...' />
          </Field>
          <Field label='Disabled' disabled>
            <Input placeholder='Cannot edit' />
          </Field>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
