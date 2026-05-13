'use client';

import { Field, Flex, OTPField, Text } from '@raystack/apsara';
import { useState } from 'react';
import PlaygroundLayout from './playground-layout';

const renderSlots = (length: number, offset = 0) =>
  Array.from({ length }, (_, i) => (
    <OTPField.Input
      key={i + offset}
      aria-label={`Character ${i + 1 + offset} of ${length + offset}`}
    />
  ));

function ControlledOTP() {
  const [value, setValue] = useState('');
  return (
    <Flex direction='column' gap={3} align='start'>
      <OTPField length={6} value={value} onValueChange={setValue}>
        {renderSlots(6)}
      </OTPField>
      <Text size='small'>
        Current value: <code>{value || '(empty)'}</code>
      </Text>
    </Flex>
  );
}

function CompleteOTP() {
  const [submitted, setSubmitted] = useState('');
  return (
    <Flex direction='column' gap={3} align='start'>
      <OTPField length={6} onValueComplete={setSubmitted}>
        {renderSlots(6)}
      </OTPField>
      <Text size='small'>
        {submitted ? `Submitted: ${submitted}` : 'Type all 6 digits to submit'}
      </Text>
    </Flex>
  );
}

export function OTPFieldExamples() {
  return (
    <PlaygroundLayout title='OTPField'>
      <Flex direction='column' gap={9}>
        <Text>Default (6 digits):</Text>
        <OTPField length={6}>{renderSlots(6)}</OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>4 digits:</Text>
        <OTPField length={4}>{renderSlots(4)}</OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>With separator:</Text>
        <OTPField length={6}>
          {renderSlots(3)}
          <OTPField.Separator />
          {Array.from({ length: 3 }, (_, i) => (
            <OTPField.Input
              key={`b-${i}`}
              aria-label={`Character ${i + 4} of 6`}
            />
          ))}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Masked:</Text>
        <OTPField length={6} mask>
          {renderSlots(6)}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Alphanumeric:</Text>
        <OTPField length={6} validationType='alphanumeric'>
          {renderSlots(6)}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Default value:</Text>
        <OTPField length={6} defaultValue='123456'>
          {renderSlots(6)}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Controlled (value / onValueChange):</Text>
        <ControlledOTP />
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>onValueComplete:</Text>
        <CompleteOTP />
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Disabled:</Text>
        <OTPField length={6} disabled defaultValue='123'>
          {renderSlots(6)}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>Read-only:</Text>
        <OTPField length={6} readOnly defaultValue='934821'>
          {renderSlots(6)}
        </OTPField>
      </Flex>

      <Flex direction='column' gap={9}>
        <Text>With Field:</Text>
        <Field
          label='Verification code'
          description='Enter the 6-digit code we sent to your device.'
        >
          <OTPField length={6}>{renderSlots(6)}</OTPField>
        </Field>
      </Flex>
    </PlaygroundLayout>
  );
}
