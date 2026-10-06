import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Link } from '../link';

describe('Link data-slot contract', () => {
  it('exposes the root slot on the anchor itself', () => {
    const { container } = render(<Link href='#'>Docs</Link>);
    expectSlots(container, ['link']);
    expect(getSlot(container, 'link')?.tagName).toBe('A');
    // Link's slot replaces the underlying Text slot.
    expect(getSlot(container, 'text')).toBeNull();
  });

  it('lets callers override the slot name', () => {
    const { container } = render(
      <Link href='#' data-slot='custom'>
        Docs
      </Link>
    );
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'link')).toBeNull();
  });
});
