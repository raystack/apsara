import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { Kbd } from '../kbd';

describe('Kbd data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Kbd.Group>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>
    );
    expectSlots(container, ['kbd-group', 'kbd']);
  });

  it('marks each key with the same slot name', () => {
    const { container } = render(
      <Kbd.Group>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>
    );
    expect(getAllSlots(container, 'kbd')).toHaveLength(2);
  });

  it('drops the group slot when no group is rendered', () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    expectSlots(container, ['kbd']);
    expect(getSlot(container, 'kbd-group')).toBeNull();
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Kbd data-slot='custom'>Esc</Kbd>);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'kbd')).toBeNull();
  });
});
