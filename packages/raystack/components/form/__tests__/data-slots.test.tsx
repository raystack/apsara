import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { Form } from '../form';

describe('Form data-slot contract', () => {
  it('exposes a slot on the form element', () => {
    const { container } = render(<Form>content</Form>);
    expectSlots(container, ['form']);
  });
});
