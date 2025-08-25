import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import {
  filterOperationsMap,
  getFilterFn,
  getFilterOperator,
  getFilterValue,
  getDataType,
} from '../filter-operations';
import { FilterType } from '~/types/filters';
import { EmptyFilterValue } from '../../data-table.types';

describe('Filter Operations', () => {
  const addMeta = vi.fn();
  
  // Simple mock row that only implements what we need
  const createMockRow = (value: unknown) => ({
    getValue: vi.fn().mockReturnValue(value)
  }) as any;

  describe('Number Filter Operations', () => {
    it('should handle eq (equals) operation', () => {
      const mockRow = createMockRow(25);
      const result = filterOperationsMap.number.eq(mockRow, 'age', { value: 25 }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow(30);
      const result2 = filterOperationsMap.number.eq(mockRow2, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle neq (not equals) operation', () => {
      const mockRow = createMockRow(25);
      const result = filterOperationsMap.number.neq(mockRow, 'age', { value: 30 }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.number.neq(mockRow, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle lt (less than) operation', () => {
      const mockRow = createMockRow(20);
      const result = filterOperationsMap.number.lt(mockRow, 'age', { value: 25 }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow(30);
      const result2 = filterOperationsMap.number.lt(mockRow2, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle lte (less than or equal) operation', () => {
      const mockRow = createMockRow(25);
      const result = filterOperationsMap.number.lte(mockRow, 'age', { value: 25 }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow(30);
      const result2 = filterOperationsMap.number.lte(mockRow2, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle gt (greater than) operation', () => {
      const mockRow = createMockRow(30);
      const result = filterOperationsMap.number.gt(mockRow, 'age', { value: 25 }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow(20);
      const result2 = filterOperationsMap.number.gt(mockRow2, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle gte (greater than or equal) operation', () => {
      const mockRow = createMockRow(25);
      const result = filterOperationsMap.number.gte(mockRow, 'age', { value: 25 }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow(20);
      const result2 = filterOperationsMap.number.gte(mockRow2, 'age', { value: 25 }, addMeta);
      expect(result2).toBe(false);
    });

    it('should convert string values to numbers', () => {
      const mockRow = createMockRow('25');
      const result = filterOperationsMap.number.eq(mockRow, 'age', { value: '25' }, addMeta);
      expect(result).toBe(true);
    });
  });

  describe('String Filter Operations', () => {
    it('should handle eq (equals) operation case-insensitively', () => {
      const mockRow = createMockRow('Alice');
      const result = filterOperationsMap.string.eq(mockRow, 'name', { value: 'alice' }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.string.eq(mockRow, 'name', { value: 'bob' }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle neq (not equals) operation case-insensitively', () => {
      const mockRow = createMockRow('Alice');
      const result = filterOperationsMap.string.neq(mockRow, 'name', { value: 'bob' }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.string.neq(mockRow, 'name', { value: 'alice' }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle like (contains) operation case-insensitively', () => {
      const mockRow = createMockRow('Alice Johnson');
      const result = filterOperationsMap.string.like(mockRow, 'name', { value: 'alice' }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.string.like(mockRow, 'name', { value: 'johnson' }, addMeta);
      expect(result2).toBe(true);

      const result3 = filterOperationsMap.string.like(mockRow, 'name', { value: 'bob' }, addMeta);
      expect(result3).toBe(false);
    });
  });

  describe('Date Filter Operations', () => {
    it('should handle eq (equals) operation', () => {
      const mockRow = createMockRow('2023-12-01');
      const result = filterOperationsMap.date.eq(mockRow, 'createdAt', { date: '2023-12-01' }, addMeta);
      
      expect(result).toBe(true);
    });

    it('should handle neq (not equals) operation', () => {
      const mockRow = createMockRow('2023-12-01');
      const result = filterOperationsMap.date.neq(mockRow, 'createdAt', { date: '2023-12-02' }, addMeta);
      
      expect(result).toBe(true);
    });

    it('should handle lt (before) operation', () => {
      const mockRow = createMockRow('2023-11-30');
      const result = filterOperationsMap.date.lt(mockRow, 'createdAt', { date: '2023-12-01' }, addMeta);
      
      expect(result).toBe(true);
    });

    it('should handle lte (before or same) operation', () => {
      const mockRow = createMockRow('2023-12-01');
      const result = filterOperationsMap.date.lte(mockRow, 'createdAt', { date: '2023-12-01' }, addMeta);
      
      expect(result).toBe(true);
    });

    it('should handle gt (after) operation', () => {
      const mockRow = createMockRow('2023-12-02');
      const result = filterOperationsMap.date.gt(mockRow, 'createdAt', { date: '2023-12-01' }, addMeta);
      
      expect(result).toBe(true);
    });

    it('should handle gte (after or same) operation', () => {
      const mockRow = createMockRow('2023-12-01');
      const result = filterOperationsMap.date.gte(mockRow, 'createdAt', { date: '2023-12-01' }, addMeta);
      
      expect(result).toBe(true);
    });
  });

  describe('Select Filter Operations', () => {
    it('should handle eq (equals) operation', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.select.eq(mockRow, 'status', { value: 'active' }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.select.eq(mockRow, 'status', { value: 'inactive' }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle neq (not equals) operation', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.select.neq(mockRow, 'status', { value: 'inactive' }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.select.neq(mockRow, 'status', { value: 'active' }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle empty filter value for eq operation', () => {
      const mockRow = createMockRow('');
      const result = filterOperationsMap.select.eq(mockRow, 'status', { value: EmptyFilterValue }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow('active');
      const result2 = filterOperationsMap.select.eq(mockRow2, 'status', { value: EmptyFilterValue }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle empty filter value for neq operation', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.select.neq(mockRow, 'status', { value: EmptyFilterValue }, addMeta);
      expect(result).toBe(true);

      const mockRow2 = createMockRow('');
      const result2 = filterOperationsMap.select.neq(mockRow2, 'status', { value: EmptyFilterValue }, addMeta);
      expect(result2).toBe(false);
    });

    it('should convert values to strings', () => {
      const mockRow = createMockRow(1);
      const result = filterOperationsMap.select.eq(mockRow, 'id', { value: '1' }, addMeta);
      expect(result).toBe(true);
    });
  });

  describe('Multiselect Filter Operations', () => {
    it('should handle in operation', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.multiselect.in(mockRow, 'status', { 
        value: ['active', 'pending'] 
      }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.multiselect.in(mockRow, 'status', { 
        value: ['inactive', 'suspended'] 
      }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle notin operation', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.multiselect.notin(mockRow, 'status', { 
        value: ['inactive', 'suspended'] 
      }, addMeta);
      expect(result).toBe(true);

      const result2 = filterOperationsMap.multiselect.notin(mockRow, 'status', { 
        value: ['active', 'pending'] 
      }, addMeta);
      expect(result2).toBe(false);
    });

    it('should handle empty filter value in multiselect', () => {
      const mockRow = createMockRow('');
      const result = filterOperationsMap.multiselect.in(mockRow, 'status', { 
        value: [EmptyFilterValue, 'active'] 
      }, addMeta);
      expect(result).toBe(true);
    });

    it('should return false for non-array values', () => {
      const mockRow = createMockRow('active');
      const result = filterOperationsMap.multiselect.in(mockRow, 'status', { 
        value: 'not-an-array' as any 
      }, addMeta);
      expect(result).toBe(false);

      const result2 = filterOperationsMap.multiselect.notin(mockRow, 'status', { 
        value: 'not-an-array' as any 
      }, addMeta);
      expect(result2).toBe(false);
    });

    it('should convert values to strings', () => {
      const mockRow = createMockRow(1);
      const result = filterOperationsMap.multiselect.in(mockRow, 'id', { 
        value: ['1', '2'] 
      }, addMeta);
      expect(result).toBe(true);
    });
  });

  describe('getFilterFn', () => {
    it('should return the correct filter function', () => {
      const stringEqFn = getFilterFn(FilterType.string, 'eq');
      expect(stringEqFn).toBe(filterOperationsMap.string.eq);

      const numberGtFn = getFilterFn(FilterType.number, 'gt');
      expect(numberGtFn).toBe(filterOperationsMap.number.gt);

      const dateNeqFn = getFilterFn(FilterType.date, 'neq');
      expect(dateNeqFn).toBe(filterOperationsMap.date.neq);

      const selectEqFn = getFilterFn(FilterType.select, 'eq');
      expect(selectEqFn).toBe(filterOperationsMap.select.eq);

      const multiselectInFn = getFilterFn(FilterType.multiselect, 'in');
      expect(multiselectInFn).toBe(filterOperationsMap.multiselect.in);
    });
  });

  describe('getFilterOperator', () => {
    it('should return empty operator for EmptyFilterValue with select filter', () => {
      const result = getFilterOperator({
        value: EmptyFilterValue,
        filterType: FilterType.select,
        operator: 'eq',
      });
      expect(result).toBe('empty');
    });

    it('should return original operator for non-empty values', () => {
      const result = getFilterOperator({
        value: 'active',
        filterType: FilterType.select,
        operator: 'eq',
      });
      expect(result).toBe('eq');
    });

    it('should return original operator for non-select filters', () => {
      const result = getFilterOperator({
        value: EmptyFilterValue,
        filterType: FilterType.string,
        operator: 'like',
      });
      expect(result).toBe('like');
    });

    it('should handle undefined filterType', () => {
      const result = getFilterOperator({
        value: EmptyFilterValue,
        operator: 'eq',
      });
      expect(result).toBe('eq');
    });
  });

  describe('getFilterValue', () => {
    it('should handle boolean data type', () => {
      const result = getFilterValue({
        value: true,
        dataType: 'boolean',
      });
      expect(result).toEqual({
        boolValue: true,
        value: true,
      });
    });

    it('should handle number data type', () => {
      const result = getFilterValue({
        value: 42,
        dataType: 'number',
      });
      expect(result).toEqual({
        numberValue: 42,
        value: 42,
      });
    });

    it('should handle date filter type', () => {
      const date = new Date('2023-12-01');
      const result = getFilterValue({
        value: date,
        filterType: FilterType.date,
      });
      expect(result).toEqual({
        value: date,
        stringValue: date.toISOString(),
      });
    });

    it('should handle select filter type with EmptyFilterValue', () => {
      const result = getFilterValue({
        value: EmptyFilterValue,
        filterType: FilterType.select,
      });
      expect(result).toEqual({
        stringValue: '',
        value: EmptyFilterValue,
      });
    });

    it('should handle select filter type with regular value', () => {
      const result = getFilterValue({
        value: 'active',
        filterType: FilterType.select,
      });
      expect(result).toEqual({
        stringValue: 'active',
        value: 'active',
      });
    });

    it('should handle multiselect filter type', () => {
      const result = getFilterValue({
        value: ['active', EmptyFilterValue, 'pending'],
        filterType: FilterType.multiselect,
      });
      expect(result).toEqual({
        value: ['active', EmptyFilterValue, 'pending'],
        stringValue: 'active,,pending',
      });
    });

    it('should handle default string case', () => {
      const result = getFilterValue({
        value: 'test string',
      });
      expect(result).toEqual({
        stringValue: 'test string',
        value: 'test string',
      });
    });

    it('should handle default parameters', () => {
      const result = getFilterValue({
        value: 'test',
      });
      expect(result).toEqual({
        stringValue: 'test',
        value: 'test',
      });
    });
  });

  describe('getDataType', () => {
    it('should return dataType for multiselect', () => {
      const result = getDataType({
        filterType: FilterType.multiselect,
        dataType: 'number',
      });
      expect(result).toBe('number');
    });

    it('should return dataType for select', () => {
      const result = getDataType({
        filterType: FilterType.select,
        dataType: 'boolean',
      });
      expect(result).toBe('boolean');
    });

    it('should return string for date filter type', () => {
      const result = getDataType({
        filterType: FilterType.date,
        dataType: 'number', // This should be overridden
      });
      expect(result).toBe('string');
    });

    it('should return filter type for other cases', () => {
      const result = getDataType({
        filterType: FilterType.number,
        dataType: 'string', // This should be overridden
      });
      expect(result).toBe('number');

      const result2 = getDataType({
        filterType: FilterType.string,
        dataType: 'number', // This should be overridden
      });
      expect(result2).toBe('string');
    });

    it('should use defaults when parameters not provided', () => {
      const result = getDataType({});
      expect(result).toBe('string');
    });

    it('should handle undefined filterType', () => {
      const result = getDataType({
        dataType: 'number',
      });
      expect(result).toBe('string'); // Falls back to default filterType which is string
    });
  });
});