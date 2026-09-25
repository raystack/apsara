import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Skeleton } from '../skeleton';

describe('Skeleton data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Skeleton />);
    expectSlots(container, ['skeleton', 'skeleton-item']);
  });

  it('reuses the item slot name across repeated bars', () => {
    const { container } = render(<Skeleton count={3} />);
    expect(getAllSlots(container, 'skeleton-item')).toHaveLength(3);
  });

  it('keeps the root slot on the inline container', () => {
    const { container } = render(<Skeleton inline />);
    expect(getSlot(container, 'skeleton')?.tagName).toBe('SPAN');
  });
});
