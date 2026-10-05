import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Box } from '../box';

describe('Box data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Box>content</Box>);
    expectSlots(container, ['box']);
    expect(getSlot(container, 'box')?.tagName).toBe('DIV');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Box data-slot='custom' />);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'box')).toBeNull();
  });
});
