import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Field } from '../index';

describe('Field data-slot contract', () => {
  it('exposes slots for the simple API', () => {
    const { container } = render(
      <Field label='Email' description='We will not spam you' error='Required'>
        content
      </Field>
    );
    expectSlots(container, [
      'field',
      'field-label',
      'field-control',
      'field-helper',
      'field-error'
    ]);
  });

  it('exposes the description slot when there is no error', () => {
    const { container } = render(
      <Field label='Email' description='We will not spam you'>
        content
      </Field>
    );
    expect(getSlot(container, 'field-description')).not.toBeNull();
    expect(getSlot(container, 'field-error')).toBeNull();
  });

  it('omits the label and helper slots when their parts are absent', () => {
    const { container } = render(<Field>content</Field>);
    expect(getSlot(container, 'field-label')).toBeNull();
    expect(getSlot(container, 'field-helper')).toBeNull();
    expect(getSlot(container, 'field-control')).not.toBeNull();
  });

  it('exposes slots for the sub-component API', () => {
    const { container } = render(
      <Field invalid>
        <Field.Label>Username</Field.Label>
        <Field.Control />
        <Field.Description>Help text</Field.Description>
        <Field.Error match>Required</Field.Error>
      </Field>
    );
    expectSlots(container, [
      'field',
      'field-label',
      'field-input',
      'field-description',
      'field-error'
    ]);
  });
});
