'use client';

import { Field, Flex, InputField } from '@raystack/apsara';
import { Home, Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function InputFieldExamples() {
  return (
    <PlaygroundLayout title='InputField'>
      <Flex gap='large' wrap='wrap'>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <Field label='Default'>
            <InputField placeholder='Enter text' />
          </Field>
          <Field label='With Description' description='This is a description'>
            <InputField placeholder='Enter text' />
          </Field>
          <Field label='With Error' error='This field is required'>
            <InputField placeholder='Enter text' />
          </Field>
        </Flex>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <InputField placeholder='0.00' prefix='$' suffix='USD' />
          <InputField
            placeholder='Enter text'
            leadingIcon={<Home size={16} />}
            trailingIcon={<Info size={16} />}
          />
          <InputField placeholder='Enter text' disabled />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
