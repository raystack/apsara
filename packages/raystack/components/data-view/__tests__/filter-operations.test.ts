import { describe, expect, it } from 'vitest';
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

    it('emits ISO string for valid dates', () => {
      const d = new Date('2024-01-15T00:00:00Z');
      const v = getFilterValue({
        value: d,
        filterType: 'date',
        operator: 'eq'
      });
      expect(v.stringValue).toBe(d.toISOString());
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

/* A `ScaleValue` has a `.date`, so a coarse value used to parse happily and
   then compare as a single day. Every operator is asserted at both scales so
   that cannot ship green again. */
describe('date filters by period', () => {
  const run = (
    operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte',
    filterDate: unknown,
    rowValue: unknown
  ) => {
    const fn = getFilterFn('date', operator);
    const row = { getValue: () => rowValue } as never;
    return fn(row, 'when', { date: filterDate } as never, () => {});
  };

  const DAY = new Date(2026, 7, 15);
  const MONTH = { date: '2026-08-01', scale: 'month' } as const;

  describe('at day scale the day itself is the period', () => {
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
  });

  describe('at month scale the whole month is the period', () => {
    it.each([
      /* The bug: a day inside the month must match `eq`, not just the 1st. */
      ['eq', '2026-08-15', true],
      ['eq', '2026-08-01', true],
      ['eq', '2026-08-31', true],
      ['eq', '2026-07-31', false],
      ['eq', '2026-09-01', false],
      ['neq', '2026-08-15', false],
      ['neq', '2026-09-01', true],
      /* before the period start, not before its anchor */
      ['lt', '2026-07-31', true],
      ['lt', '2026-08-01', false],
      ['lt', '2026-08-15', false],
      ['lte', '2026-08-31', true],
      ['lte', '2026-09-01', false],
      /* after the period end, not after its anchor */
      ['gt', '2026-09-01', true],
      ['gt', '2026-08-31', false],
      ['gt', '2026-08-15', false],
      ['gte', '2026-08-01', true],
      ['gte', '2026-07-31', false]
    ] as const)('%s against %s', (operator, row, expected) => {
      expect(run(operator, MONTH, row)).toBe(expected);
    });
  });

  it.each([
    ['quarter', { date: '2026-07-01', scale: 'quarter' }, '2026-09-30', true],
    ['quarter', { date: '2026-07-01', scale: 'quarter' }, '2026-10-01', false],
    ['halfYear', { date: '2026-01-01', scale: 'halfYear' }, '2026-06-30', true],
    [
      'halfYear',
      { date: '2026-01-01', scale: 'halfYear' },
      '2026-07-01',
      false
    ],
    ['year', { date: '2026-01-01', scale: 'year' }, '2026-12-31', true],
    ['year', { date: '2026-01-01', scale: 'year' }, '2027-01-01', false]
  ] as const)('spans a whole %s', (_scale, filterDate, row, expected) => {
    expect(run('eq', filterDate, row)).toBe(expected);
  });

  /* The stored value is the anchor and the period is derived from it, so a
     trailing-edge anchor resolves to the same span as a leading-edge one. */
  it('reaches both ends whichever edge was stored', () => {
    const leading = { date: '2026-08-01', scale: 'month' } as const;
    const trailing = { date: '2026-08-31', scale: 'month' } as const;
    for (const row of ['2026-08-01', '2026-08-15', '2026-08-31']) {
      expect(run('eq', leading, row)).toBe(true);
      expect(run('eq', trailing, row)).toBe(true);
    }
  });

  it('matches nothing when the row cannot be read, and neq matches it', () => {
    expect(run('eq', DAY, 'not a date')).toBe(false);
    expect(run('neq', DAY, 'not a date')).toBe(true);
    expect(run('gt', DAY, undefined)).toBe(false);
  });

  /* dayjs read a missing filter date as "now", so an unset filter quietly
     matched today's rows. */
  it('does not fall back to today when the filter has no date', () => {
    expect(run('eq', undefined, '2026-08-15')).toBe(false);
  });
});
