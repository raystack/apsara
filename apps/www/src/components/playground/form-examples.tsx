'use client';

import {
  Button,
  Field,
  Fieldset,
  Form,
  InputField,
  TextArea
} from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FormExamples() {
  return (
    <PlaygroundLayout title='Form'>
      <Form
        onSubmit={e => {
          e.preventDefault();
          alert('Form submitted!');
        }}
        style={{ maxWidth: 400 }}
      >
        <Fieldset legend='Personal Information'>
          <Field label='First Name' required>
            <InputField placeholder='John' />
          </Field>
          <Field label='Last Name' required>
            <InputField placeholder='Doe' />
          </Field>
        </Fieldset>
        <Field label='Email' required description="We'll send a confirmation">
          <InputField type='email' placeholder='john@example.com' />
        </Field>
        <Field label='Message' optional>
          <TextArea placeholder='Tell us more...' />
        </Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </PlaygroundLayout>
  );
}
