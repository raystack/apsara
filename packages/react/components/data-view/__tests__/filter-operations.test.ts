import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryToTableState, transformToDataViewQuery } from '../utils';
import {
  getDataType,
  getFilterFn,
  getFilterOperator,
  getFilterValue
} from '../utils/filter-operations';

describe('filter-operations', () => {
  describe('getFilterFn', () => {
    it('returns predicates for known types', () => {
      expect(typeof getFilterFn('string', 'contains')).toBe('function');
      expect(typeof getFilterFn('number', 'gte')).toBe('function');
      expect(typeof getFilterFn('select', 'eq')).toBe('function');
    });
  });

  describe('getFilterOperator', () => {
    it('maps string contains/starts_with/ends_with to ilike', () => {
      expect(
        getFilterOperator({
          value: 'a',
          filterType: 'string',
          operator: 'contains'
        })
      ).toBe('ilike');
      expect(
        getFilterOperator({
          value: 'a',
          filterType: 'string',
          operator: 'starts_with'
        })
      ).toBe('ilike');
    });

    it('returns "empty" for the empty sentinel on select', () => {
      expect(
        getFilterOperator({
          value: '--empty--',
          filterType: 'select',
          operator: 'eq'
        })
      ).toBe('empty');
    });
  });

  describe('getFilterValue', () => {
    it('wraps string contains with %…%', () => {
      const v = getFilterValue({
        value: 'foo',
        filterType: 'string',
        operator: 'contains'
      });
      expect(v.stringValue).toBe('%foo%');
      expect(v.value).toBe('foo');
    });

    it('wraps starts_with with foo%', () => {
      const v = getFilterValue({
        value: 'foo',
        filterType: 'string',
        operator: 'starts_with'
      });
      expect(v.stringValue).toBe('foo%');
    });

    it('emits a day key for valid dates and passes the value through', () => {
      const value = new Date(2024, 0, 15, 23, 30);
      const v = getFilterValue({ value, filterType: 'date', operator: 'eq' });
      expect(v.value).toBe(value);
      expect(v.stringValue).toBe('2024-01-15');
    });

    it('emits boolValue for boolean dataType', () => {
      const v = getFilterValue({
        value: true,
        dataType: 'boolean',
        operator: 'eq'
      });
      expect(v.boolValue).toBe(true);
    });

    it('emits numberValue for number dataType', () => {
      const v = getFilterValue({
        value: 42,
        dataType: 'number',
        operator: 'eq'
      });
      expect(v.numberValue).toBe(42);
    });
  });

  describe('getDataType', () => {
    it('uses dataType for select/multiselect', () => {
      expect(getDataType({ filterType: 'select', dataType: 'number' })).toBe(
        'number'
      );
    });
    it('forces string for date', () => {
      expect(getDataType({ filterType: 'date' })).toBe('string');
    });
    it('returns the filterType for primitives', () => {
      expect(getDataType({ filterType: 'string' })).toBe('string');
      expect(getDataType({ filterType: 'number' })).toBe('number');
    });
  });
});

describe('date filters', () => {
  const run = (
    operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte',
    filterDate: unknown,
    rowValue: unknown
  ) => {
    const fn = getFilterFn('date', operator);
    const row = { getValue: () => rowValue } as never;
    return fn(row, 'when', { date: filterDate } as never, vi.fn());
  };

  const DAY = new Date(2026, 7, 15);

  it.each([
    ['eq', '2026-08-15', true],
    ['eq', '2026-08-14', false],
    ['neq', '2026-08-15', false],
    ['neq', '2026-08-14', true],
    ['lt', '2026-08-14', true],
    ['lt', '2026-08-15', false],
    ['lte', '2026-08-15', true],
    ['lte', '2026-08-16', false],
    ['gt', '2026-08-16', true],
    ['gt', '2026-08-15', false],
    ['gte', '2026-08-15', true],
    ['gte', '2026-08-14', false]
  ] as const)('%s against %s', (operator, row, expected) => {
    expect(run(operator, DAY, row)).toBe(expected);
  });

  it.each([
    'eq',
    'lt',
    'lte',
    'gt',
    'gte'
  ] as const)('does not match an unreadable row with %s', operator => {
    expect(run(operator, DAY, 'not a date')).toBe(false);
    expect(run(operator, DAY, undefined)).toBe(false);
  });

  it('matches an unreadable row with neq', () => {
    expect(run('neq', DAY, 'not a date')).toBe(true);
    expect(run('neq', DAY, undefined)).toBe(true);
    expect(run('neq', DAY, '2026-02-30')).toBe(true);
  });

  it('does not match with neq when the filter date is unreadable', () => {
    expect(run('neq', 'not a date', '2026-08-15')).toBe(false);
  });

  it('does not fall back to today when the filter has no date', () => {
    expect(run('eq', undefined, '2026-08-15')).toBe(false);
  });
});

/* Filters stored before day keys hold an ISO instant of local midnight. */
describe('stored date filters', () => {
  const originalTimeZone = process.env.TZ;
  afterEach(() => {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  });

  const matches = (stored: unknown, row: string) =>
    getFilterFn('date', 'eq')(
      { getValue: () => row } as never,
      'when',
      { date: stored } as never,
      vi.fn()
    );

  it('reads a stored ISO instant as the day the viewer picked', () => {
    process.env.TZ = 'Asia/Kolkata';
    expect(matches('2026-08-14T18:30:00.000Z', '2026-08-15')).toBe(true);
    expect(matches('2026-08-14T18:30:00.000Z', '2026-08-14')).toBe(false);
  });

  it.each([
    'UTC',
    'Asia/Kolkata',
    'America/Los_Angeles',
    'Pacific/Kiritimati'
  ])('reads a stored day key as the same day in %s', timeZone => {
    process.env.TZ = timeZone;
    expect(matches('2026-08-15', '2026-08-15')).toBe(true);
    expect(matches('2026-08-15', '2026-08-14')).toBe(false);
  });

  it('writes a stored ISO instant as its day and keeps the value', () => {
    process.env.TZ = 'Asia/Kolkata';
    const value = '2026-08-14T18:30:00.000Z';
    const v = getFilterValue({ value, filterType: 'date' });
    expect(v.value).toBe(value);
    expect(v.stringValue).toBe('2026-08-15');
  });
});

describe('date filter with no value', () => {
  const query = {
    filters: [{ name: 'when', operator: 'eq', value: undefined, _type: 'date' }]
  } as never;

  it('is dropped from the table state', () => {
    expect(queryToTableState(query).columnFilters).toEqual([]);
  });

  it('is dropped from the emitted query', () => {
    expect(transformToDataViewQuery(query).filters).toEqual([]);
  });
});
