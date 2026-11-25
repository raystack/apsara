import { describe, expect, it } from 'vitest';
import type { FilterOperatorTypes, FilterTypes } from '~/types/filters';
import {
  dropDisallowedFilters,
  type FilterOperations,
  resolveFilterOperations
} from '../filter-operations';

const values = (filterType: FilterTypes, operations?: FilterOperations) =>
  resolveFilterOperations(filterType, operations).map(
    operation => operation.value
  );

describe('resolveFilterOperations', () => {
  it('returns every operation of the type when none are given', () => {
    expect(values('date')).toEqual(['eq', 'neq', 'lt', 'lte', 'gt', 'gte']);
  });

  it('defaults to string when no type is given', () => {
    expect(resolveFilterOperations().map(operation => operation.value)).toEqual(
      ['eq', 'neq', 'contains', 'starts_with', 'ends_with']
    );
  });

  it('replaces the operations with the array given', () => {
    expect(
      values('date', [
        { value: 'gte', label: 'from' },
        { value: 'lt', label: 'until' }
      ])
    ).toEqual(['gte', 'lt']);
  });

  it('keeps the labels the array gives', () => {
    expect(
      resolveFilterOperations('date', [{ value: 'gte', label: 'from' }])[0]
        .label
    ).toBe('from');
  });

  it('calls the function with the operations of the type', () => {
    expect(values('select', defaults => defaults.slice(0, 1))).toEqual(['eq']);
  });

  it('keeps an operation the function adds', () => {
    expect(
      values('select', defaults => [
        ...defaults,
        { value: 'contains', label: 'has somewhere' }
      ])
    ).toEqual(['eq', 'neq', 'contains']);
  });

  it('does not change the operations of the type', () => {
    resolveFilterOperations('date', defaults => defaults.reverse());
    expect(values('date')).toEqual(['eq', 'neq', 'lt', 'lte', 'gt', 'gte']);
  });

  it('does not change the labels of the type', () => {
    resolveFilterOperations('date', defaults => {
      defaults[0].label = 'matches';
      return defaults;
    });
    expect(resolveFilterOperations('date')[0].label).toBe('is');
  });

  it('falls back to the type for an empty array', () => {
    expect(values('select', [])).toEqual(['eq', 'neq']);
  });

  it('falls back to the type when the function returns nothing', () => {
    expect(values('select', () => [])).toEqual(['eq', 'neq']);
  });
});

describe('dropDisallowedFilters', () => {
  const fields: {
    accessorKey: string;
    filterType: FilterTypes;
    filterOperations?: FilterOperations;
  }[] = [
    {
      accessorKey: 'when',
      filterType: 'date',
      filterOperations: [
        { value: 'gte', label: 'from' },
        { value: 'lt', label: 'until' }
      ]
    },
    { accessorKey: 'name', filterType: 'string' },
    {
      accessorKey: 'size',
      filterType: 'number',
      filterOperations: defaults => defaults.slice(0, 1)
    },
    {
      accessorKey: 'team',
      filterType: 'select',
      filterOperations: [{ value: 'eq', label: 'is' }]
    }
  ];

  const filter = (name: string, operator: FilterOperatorTypes) => ({
    name,
    operator
  });

  it('keeps a filter whose operation the field offers', () => {
    const filters = [filter('when', 'gte')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('drops a filter whose operation the field does not offer', () => {
    expect(dropDisallowedFilters([filter('when', 'eq')], fields)).toEqual([]);
  });

  it('reads the list a function returns', () => {
    expect(dropDisallowedFilters([filter('size', 'eq')], fields)).toEqual([
      filter('size', 'eq')
    ]);
    expect(dropDisallowedFilters([filter('size', 'neq')], fields)).toEqual([]);
  });

  it('keeps every filter on a field that sets no operations', () => {
    const filters = [filter('name', 'ends_with')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('keeps an empty filter on a select, which no type lists', () => {
    const filters = [filter('team', 'empty')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('drops an empty filter on a field of another type', () => {
    expect(dropDisallowedFilters([filter('when', 'empty')], fields)).toEqual(
      []
    );
  });

  it('keeps a filter for a field it does not know', () => {
    const filters = [filter('other', 'eq')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });
});
