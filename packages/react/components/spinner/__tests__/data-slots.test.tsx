import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Spinner } from '../spinner';

describe('Spinner data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Spinner />);
    expectSlots(container, ['spinner', 'spinner-pole']);
  });

  it('reuses the pole slot name across all eight poles', () => {
    const { container } = render(<Spinner />);
    expect(getAllSlots(container, 'spinner-pole')).toHaveLength(8);
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(<Spinner data-slot='custom' />);
    expect(getSlot(container, 'spinner')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
