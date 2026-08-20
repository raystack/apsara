import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Separator } from '../separator';

describe('Separator data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Separator />);
    expectSlots(container, ['separator']);
  });

  it('keeps the slot when decorative', () => {
    const { container } = render(<Separator decorative />);
    expect(getSlot(container, 'separator')).not.toBeNull();
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Separator data-slot='custom' />);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'separator')).toBeNull();
  });
});
