'use client';

import { Flex, InputField } from '@raystack/apsara';
import { Home, Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function InputFieldExamples() {
  return (
    <PlaygroundLayout title='InputField'>
      <Flex gap='large' wrap='wrap'>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <InputField label='Default' placeholder='Enter text' />
          <InputField
            label='With label'
            placeholder='Enter text'
            helperText='This is a helper text'
          />
          <InputField
            label='With Error'
            placeholder='Enter text'
            error='This field is required'
          />
        </Flex>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <InputField
            label='With Prefix/Suffix'
            placeholder='0.00'
            prefix='$'
            suffix='USD'
          />
          <InputField
            label='With Icons'
            placeholder='Enter text'
            leadingIcon={<Home size={16} />}
            trailingIcon={<Info size={16} />}
          />
          <InputField label='Disabled' placeholder='Enter text' disabled />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
