import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Image } from '../image';

describe('Image data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Image src='a.png' alt='A' />);
    expectSlots(container, ['image']);
    expect(getSlot(container, 'image')?.tagName).toBe('IMG');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(
      <Image src='a.png' alt='A' data-slot='custom' />
    );
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'image')).toBeNull();
  });
});
