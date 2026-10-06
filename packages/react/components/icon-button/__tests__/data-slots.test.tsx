import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { IconButton } from '../icon-button';

describe('IconButton data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <IconButton aria-label='Close'>
        <span>x</span>
      </IconButton>
    );
    expectSlots(container, ['icon-button', 'icon-button-icon']);
  });

  it('puts the root slot on the button element itself', () => {
    const { container } = render(
      <IconButton aria-label='Close'>
        <span>x</span>
      </IconButton>
    );
    expect(getSlot(container, 'icon-button')?.tagName).toBe('BUTTON');
  });

  it('lets callers override the root slot via props', () => {
    const { container } = render(
      <IconButton aria-label='Close' data-slot='custom'>
        <span>x</span>
      </IconButton>
    );
    expect(getSlot(container, 'icon-button')).toBeNull();
    expect(getSlot(container, 'custom')).not.toBeNull();
  });
});
