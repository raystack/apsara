import { describe, expect, it } from 'vitest';
import type { FilterOperatorTypes, FilterTypes } from '~/types/filters';
import {
  dropDisallowedFilters,
  resolveFilterOperators
} from '../filter-operators';

const values = (filterType: FilterTypes, allowed?: FilterOperatorTypes[]) =>
  resolveFilterOperators(filterType, allowed).map(operator => operator.value);

describe('resolveFilterOperators', () => {
  it('keeps the listed operators in the order given', () => {
    expect(values('date', ['gte', 'lt'])).toEqual(['gte', 'lt']);
  });

  it('takes the labels from the filter type', () => {
    expect(resolveFilterOperators('date', ['lt'])[0].label).toBe('is before');
  });

  it('keeps the multiselect alternate label', () => {
    expect(
      resolveFilterOperators('multiselect', ['in'])[0].alternateLabel
    ).toBe('is');
  });

  it('ignores a value the filter type does not have', () => {
    expect(values('date', ['gte', 'contains'])).toEqual(['gte']);
  });

  it('ignores a repeated value', () => {
    expect(values('date', ['gte', 'gte'])).toEqual(['gte']);
  });

  it('falls back to the type when every value is ignored', () => {
    expect(values('select', ['contains'])).toEqual(['eq', 'neq']);
  });

  it('falls back to the type for an empty list', () => {
    expect(values('select', [])).toEqual(['eq', 'neq']);
  });

  it('returns every operator of the type when none are listed', () => {
    expect(values('date')).toEqual(['eq', 'neq', 'lt', 'lte', 'gt', 'gte']);
  });

  it('defaults to string when no type is given', () => {
    expect(resolveFilterOperators().map(operator => operator.value)).toEqual([
      'eq',
      'neq',
      'contains',
      'starts_with',
      'ends_with'
    ]);
  });
});

describe('dropDisallowedFilters', () => {
  const fields: {
    accessorKey: string;
    filterType: FilterTypes;
    filterOperators?: FilterOperatorTypes[];
  }[] = [
    { accessorKey: 'when', filterType: 'date', filterOperators: ['gte', 'lt'] },
    { accessorKey: 'name', filterType: 'string' },
    { accessorKey: 'size', filterType: 'number', filterOperators: ['contains'] }
  ];

  const filter = (name: string, operator: FilterOperatorTypes) => ({
    name,
    operator
  });

  it('keeps a filter whose operator the field lists', () => {
    const filters = [filter('when', 'gte')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('drops a filter whose operator the field does not list', () => {
    expect(dropDisallowedFilters([filter('when', 'eq')], fields)).toEqual([]);
  });

  it('keeps every filter on a field that lists no operators', () => {
    const filters = [filter('name', 'ends_with')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('keeps a filter on a field whose listed values are all ignored', () => {
    const filters = [filter('size', 'lte')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });

  it('keeps a filter for a field it does not know', () => {
    const filters = [filter('other', 'eq')];
    expect(dropDisallowedFilters(filters, fields)).toEqual(filters);
  });
});
