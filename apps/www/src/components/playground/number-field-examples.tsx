'use client';

import { Flex, NumberField, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function NumberFieldExamples() {
  return (
    <PlaygroundLayout title='Number Field'>
      <Flex direction='column' gap='large'>
        <Text>Default:</Text>
        <NumberField defaultValue={0} />

        <Text>With Min/Max (0-10):</Text>
        <NumberField defaultValue={5} min={0} max={10} />

        <Text>With Step (5):</Text>
        <NumberField defaultValue={0} step={5} />

        <Text>Disabled:</Text>
        <NumberField defaultValue={0} disabled />

        <Text>Composed with ScrubArea:</Text>
        <NumberField defaultValue={50}>
          <NumberField.ScrubArea label='Amount' />
          <NumberField.Group>
            <NumberField.Decrement />
            <NumberField.Input />
            <NumberField.Increment />
          </NumberField.Group>
        </NumberField>
      </Flex>
    </PlaygroundLayout>
  );
}
