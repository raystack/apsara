import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { OTPField } from '../otp-field';

describe('OTPField data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <OTPField length={6}>
        <OTPField.Input aria-label='Character 1 of 6' />
        <OTPField.Input aria-label='Character 2 of 6' />
        <OTPField.Input aria-label='Character 3 of 6' />
        <OTPField.Separator />
        <OTPField.Input aria-label='Character 4 of 6' />
        <OTPField.Input aria-label='Character 5 of 6' />
        <OTPField.Input aria-label='Character 6 of 6' />
      </OTPField>
    );
    expectSlots(container, [
      'otp-field',
      'otp-field-input',
      'otp-field-separator'
    ]);
  });
});
