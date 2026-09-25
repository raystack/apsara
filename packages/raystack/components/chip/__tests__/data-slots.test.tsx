import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Chip } from '../chip';

describe('Chip data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Chip leadingIcon={<span>l</span>} trailingIcon={<span>t</span>}>
        Label
      </Chip>
    );
    expectSlots(container, ['chip', 'chip-leading-icon', 'chip-trailing-icon']);
  });

  it('exposes dismiss slots when dismissible', () => {
    const { container } = render(
      <Chip isDismissible onDismiss={vi.fn()}>
        Label
      </Chip>
    );
    expectSlots(container, ['chip', 'chip-dismiss', 'chip-dismiss-icon']);
    expect(getSlot(container, 'chip-trailing-icon')).toBeNull();
  });

  it('keeps the root slot when rendered as an interactive button', () => {
    const { container } = render(<Chip onClick={vi.fn()}>Label</Chip>);
    expect(getSlot(container, 'chip')?.tagName).toBe('BUTTON');
  });

  it('omits optional slots when their parts are absent', () => {
    const { container } = render(<Chip>Label</Chip>);
    expect(getSlot(container, 'chip-leading-icon')).toBeNull();
    expect(getSlot(container, 'chip-trailing-icon')).toBeNull();
    expect(getSlot(container, 'chip-dismiss')).toBeNull();
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(<Chip data-slot='custom'>Label</Chip>);
    expect(getSlot(container, 'chip')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
