import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { CopyButton } from '../copy-button';

describe('CopyButton data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<CopyButton text='hello' />);
    expectSlots(container, [
      'copy-button',
      'copy-button-icons',
      'copy-button-copy-icon',
      'copy-button-check-icon',
      'copy-button-status'
    ]);
  });

  it('puts the root slot on the button element itself', () => {
    const { container } = render(<CopyButton text='hello' />);
    expect(getSlot(container, 'copy-button')?.tagName).toBe('BUTTON');
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(
      <CopyButton text='hello' data-slot='custom' />
    );
    expect(getSlot(container, 'copy-button')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
