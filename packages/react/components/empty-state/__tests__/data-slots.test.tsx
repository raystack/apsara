import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { EmptyState } from '../empty-state';

describe('EmptyState data-slot contract', () => {
  it('exposes slots for every rendered part (compact variant)', () => {
    const { container } = render(
      <EmptyState
        icon={<div>Icon</div>}
        heading='No data found'
        subHeading='Try adjusting your filters'
      />
    );
    expectSlots(container, [
      'empty-state',
      'empty-state-icon-container',
      'empty-state-icon',
      'empty-state-content',
      'empty-state-heading',
      'empty-state-subheading'
    ]);
  });

  it('omits heading and subheading slots when absent', () => {
    const { container } = render(<EmptyState icon={<div>Icon</div>} />);
    expect(getSlot(container, 'empty-state-heading')).toBeNull();
    expect(getSlot(container, 'empty-state-subheading')).toBeNull();
  });

  it('exposes slots for every rendered part (page variant)', () => {
    const { container } = render(
      <EmptyState
        icon={<div>Icon</div>}
        heading='No data found'
        subHeading='Try adjusting your filters'
        primaryAction={<button type='button'>Retry</button>}
        secondaryAction={<button type='button'>Cancel</button>}
        variant='page'
      />
    );
    expectSlots(container, [
      'empty-state',
      'empty-state-icon-container',
      'empty-state-icon',
      'empty-state-content',
      'empty-state-heading',
      'empty-state-subheading',
      'empty-state-actions'
    ]);
  });
});
