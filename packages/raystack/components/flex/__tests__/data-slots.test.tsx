import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Flex } from '../flex';

describe('Flex data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Flex>content</Flex>);
    expectSlots(container, ['flex']);
    expect(getSlot(container, 'flex')?.tagName).toBe('DIV');
  });

  it('keeps the slot on the rendered element with a custom render', () => {
    const { container } = render(<Flex render={<section />} />);
    expect(getSlot(container, 'flex')?.tagName).toBe('SECTION');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Flex data-slot='custom' />);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'flex')).toBeNull();
  });
});
