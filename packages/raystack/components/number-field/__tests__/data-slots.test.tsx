import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { NumberField } from '../number-field';

describe('NumberField data-slot contract', () => {
  it('exposes slots for every rendered part (default layout)', () => {
    const { container } = render(<NumberField defaultValue={5} />);
    expectSlots(container, [
      'number-field',
      'number-field-group',
      'number-field-input',
      'number-field-decrement',
      'number-field-decrement-icon',
      'number-field-increment',
      'number-field-increment-icon'
    ]);
  });

  it('exposes slots when composed explicitly', () => {
    const { container } = render(
      <NumberField defaultValue={5}>
        <NumberField.ScrubArea label='Amount' />
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
    );
    expectSlots(container, [
      'number-field',
      'number-field-group',
      'number-field-input',
      'number-field-decrement',
      'number-field-increment',
      'number-field-scrub-area',
      'number-field-scrub-area-label'
    ]);
    // The scrub cursor only mounts while the pointer is scrubbing.
    expect(getSlot(container, 'number-field-scrub-area-cursor')).toBeNull();
  });

  it('omits the default stepper icons when custom children are passed', () => {
    const { container } = render(
      <NumberField defaultValue={5}>
        <NumberField.Group>
          <NumberField.Decrement>-</NumberField.Decrement>
          <NumberField.Input />
          <NumberField.Increment>+</NumberField.Increment>
        </NumberField.Group>
      </NumberField>
    );
    expect(getSlot(container, 'number-field-decrement-icon')).toBeNull();
    expect(getSlot(container, 'number-field-increment-icon')).toBeNull();
  });
});
