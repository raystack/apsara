import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Text } from '../text';

describe('Text data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Text>content</Text>);
    expectSlots(container, ['text']);
    expect(getSlot(container, 'text')?.tagName).toBe('SPAN');
  });

  it('keeps the slot on the rendered element with a custom render', () => {
    const { container } = render(<Text render={<p />}>content</Text>);
    expect(getSlot(container, 'text')?.tagName).toBe('P');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Text data-slot='custom'>content</Text>);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'text')).toBeNull();
  });
});
