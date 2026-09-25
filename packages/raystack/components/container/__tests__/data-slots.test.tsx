import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Container } from '../container';

describe('Container data-slot contract', () => {
  it('exposes the root slot', () => {
    const { container } = render(<Container>content</Container>);
    expectSlots(container, ['container']);
    expect(getSlot(container, 'container')?.tagName).toBe('DIV');
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Container data-slot='custom' />);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'container')).toBeNull();
  });
});
