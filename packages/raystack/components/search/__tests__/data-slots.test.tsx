import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Search } from '../search';

describe('Search data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<Search showClearButton />);
    expectSlots(container, [
      'search',
      'search-input',
      'search-clear',
      'search-clear-button'
    ]);
  });

  it('puts the input slot on the input element itself', () => {
    const { container } = render(<Search />);
    expect(getSlot(container, 'search-input')?.tagName).toBe('INPUT');
  });

  it('omits clear slots when the clear button is hidden', () => {
    const { container } = render(<Search />);
    expect(getSlot(container, 'search-clear')).toBeNull();
    expect(getSlot(container, 'search-clear-button')).toBeNull();
  });
});
