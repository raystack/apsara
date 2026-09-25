import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Grid } from '..';

describe('Grid data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Grid columns={2}>
        <Grid.Item>one</Grid.Item>
        <Grid.Item>two</Grid.Item>
      </Grid>
    );
    expectSlots(container, ['grid', 'grid-item']);
    expect(getSlot(container, 'grid')?.tagName).toBe('DIV');
  });

  it('reuses the item slot name for every item', () => {
    const { container } = render(
      <Grid>
        <Grid.Item>one</Grid.Item>
        <Grid.Item>two</Grid.Item>
      </Grid>
    );
    expect(container.querySelectorAll('[data-slot="grid-item"]')).toHaveLength(
      2
    );
  });

  it('lets callers override the slot name', () => {
    const { container } = render(<Grid data-slot='custom' />);
    expect(getSlot(container, 'custom')).not.toBeNull();
    expect(getSlot(container, 'grid')).toBeNull();
  });
});
