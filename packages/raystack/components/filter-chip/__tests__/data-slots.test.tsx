import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { FilterType } from '~/types/filters';
import { FilterChip } from '../filter-chip';

describe('FilterChip data-slot contract', () => {
  it('exposes slots for every rendered part (string column)', () => {
    const { container } = render(
      <FilterChip
        label='Name'
        leadingIcon={<span>i</span>}
        onRemove={vi.fn()}
      />
    );
    expectSlots(container, [
      'filter-chip',
      'filter-chip-label',
      'filter-chip-label-text',
      'filter-chip-leading-icon',
      'filter-chip-operation',
      'filter-chip-operation-text',
      'filter-chip-value',
      'filter-chip-remove',
      'filter-chip-remove-icon'
    ]);
  });

  it('keeps the value slot across column types', () => {
    for (const columnType of [
      FilterType.string,
      FilterType.date,
      FilterType.select
    ]) {
      const { container, unmount } = render(
        <FilterChip
          label='Field'
          columnType={columnType}
          options={[{ label: 'A', value: 'string' }]}
        />
      );
      expect(
        getSlot(container, 'filter-chip-value'),
        `missing filter-chip-value for columnType=${columnType}`
      ).not.toBeNull();
      unmount();
    }
  });

  it('omits optional slots when their parts are absent', () => {
    const { container } = render(<FilterChip label='Name' />);
    expect(getSlot(container, 'filter-chip-leading-icon')).toBeNull();
    expect(getSlot(container, 'filter-chip-remove')).toBeNull();
  });
});
