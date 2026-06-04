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
