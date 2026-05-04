'use client';

import { Field, Fieldset, Flex, Input } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FieldsetExamples() {
  return (
    <PlaygroundLayout title='Fieldset'>
      <Flex gap='large' direction='column' style={{ maxWidth: 400 }}>
        <Fieldset legend='Contact Details'>
          <Field label='Phone' required>
            <Input type='tel' placeholder='+1 (555) 000-0000' />
          </Field>
          <Field label='Address' required={false}>
            <Input placeholder='123 Main St' />
          </Field>
        </Fieldset>
        <Fieldset legend='Disabled Section' disabled>
          <Field label='Read Only'>
            <Input placeholder='Cannot edit' />
          </Field>
        </Fieldset>
      </Flex>
    </PlaygroundLayout>
  );
}
