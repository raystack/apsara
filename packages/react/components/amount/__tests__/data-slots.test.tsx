import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Amount } from '../amount';

describe('Amount data-slot contract', () => {
  it('exposes the root slot on the span element', () => {
    const { container } = render(<Amount value={1299} />);
    expectSlots(container, ['amount']);
    expect(getSlot(container, 'amount')?.tagName).toBe('SPAN');
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(<Amount value={1299} data-slot='custom' />);
    expect(getSlot(container, 'amount')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
