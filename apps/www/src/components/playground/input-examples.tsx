'use client';

import { Field, Flex, Input } from '@raystack/apsara';
import { Home, Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function InputExamples() {
  return (
    <PlaygroundLayout title='Input'>
      <Flex gap='large' wrap='wrap'>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <Field label='Default'>
            <Input placeholder='Enter text' />
          </Field>
          <Field label='With Description' description='This is a description'>
            <Input placeholder='Enter text' />
          </Field>
          <Field label='With Error' error='This field is required'>
            <Input placeholder='Enter text' />
          </Field>
        </Flex>
        <Flex gap='large' direction='column' style={{ width: 300 }}>
          <Input placeholder='0.00' prefix='$' suffix='USD' />
          <Input
            placeholder='Enter text'
            leadingIcon={<Home size={16} />}
            trailingIcon={<Info size={16} />}
          />
          <Input placeholder='Enter text' disabled />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
