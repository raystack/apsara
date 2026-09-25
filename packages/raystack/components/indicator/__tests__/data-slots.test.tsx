import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Indicator } from '../indicator';

describe('Indicator data-slot contract', () => {
  it('exposes slots for every rendered part (with label)', () => {
    const { container } = render(
      <Indicator label='9'>
        <button type='button'>Inbox</button>
      </Indicator>
    );
    expectSlots(container, ['indicator', 'indicator-badge', 'indicator-label']);
    expect(getSlot(container, 'indicator-dot')).toBeNull();
  });

  it('renders the dot slot when no label is set', () => {
    const { container } = render(
      <Indicator>
        <button type='button'>Inbox</button>
      </Indicator>
    );
    expectSlots(container, ['indicator', 'indicator-badge', 'indicator-dot']);
    expect(getSlot(container, 'indicator-label')).toBeNull();
  });
});
