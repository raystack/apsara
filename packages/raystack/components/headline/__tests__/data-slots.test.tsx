import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Headline } from '../headline';

describe('Headline data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Headline>Title</Headline>);
    expectSlots(container, ['headline']);
    expect(getSlot(container, 'headline')?.tagName).toBe('H2');
  });

  it('keeps the slot on the rendered element with a custom render', () => {
    const { container } = render(<Headline render={<h1 />}>Title</Headline>);
    expect(getSlot(container, 'headline')?.tagName).toBe('H1');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Headline data-slot='custom'>Title</Headline>);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'headline')).toBeNull();
  });
});
