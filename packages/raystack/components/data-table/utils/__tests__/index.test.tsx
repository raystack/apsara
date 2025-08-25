import { describe, it, expect } from 'vitest';
import { FilterType } from '~/types/filters';
import {
  queryToTableState,
  getColumnsWithFilterFn,
  groupData,
  hasQueryChanged,
  getInitialColumnVisibility,
  sanitizeTableQuery,
  getDefaultTableQuery,
} from '../index';
import {
  DataTableQuery,
  DataTableColumnDef,
  DataTableSort,
  SortOrders,
  RQLFilter,
  defaultGroupOption,
  EmptyFilterValue,
} from '../../data-table.types';

// Mock data for tests
const mockColumns: DataTableColumnDef<any, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    filterType: FilterType.string,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    filterType: FilterType.number,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterType: FilterType.select,
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    filterType: FilterType.date,
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: 'hidden',
    header: 'Hidden Column',
    defaultHidden: true,
    enableColumnFilter: false,
  },
];

const mockData = [
  { id: 1, name: 'Alice', age: 25, status: 'active', department: 'engineering' },
  { id: 2, name: 'Bob', age: 30, status: 'inactive', department: 'marketing' },
  { id: 3, name: 'Charlie', age: 35, status: 'active', department: 'engineering' },
  { id: 4, name: 'David', age: 28, status: 'active', department: 'sales' },
];

const mockFilters: RQLFilter[] = [
  {
    name: 'name',
    operator: 'like',
    value: 'Alice',
    stringValue: 'Alice',
    _type: FilterType.string,
  },
  {
    name: 'age',
    operator: 'gte',
    value: 25,
    numberValue: 25,
    _type: FilterType.number,
  },
];

const mockSort: DataTableSort[] = [
  { name: 'name', order: SortOrders.ASC },
  { name: 'age', order: SortOrders.DESC },
];

describe('Data Table Utils', () => {
  describe('queryToTableState', () => {
    it('should convert empty query to table state', () => {
      const query: DataTableQuery = {};
      const result = queryToTableState(query);

      expect(result).toEqual({
        columnFilters: [],
        sorting: undefined,
        globalFilter: undefined,
      });
    });

    it('should convert query with filters to table state', () => {
      const query: DataTableQuery = {
        filters: mockFilters,
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toHaveLength(2);
      expect(result.columnFilters![0]).toEqual({
        id: 'name',
        value: { value: 'Alice' },
      });
      expect(result.columnFilters![1]).toEqual({
        id: 'age',
        value: { value: 25 },
      });
    });

    it('should convert date filters correctly', () => {
      const dateFilter: RQLFilter = {
        name: 'createdAt',
        operator: 'eq',
        value: '2023-12-01',
        _type: FilterType.date,
      };
      
      const query: DataTableQuery = {
        filters: [dateFilter],
      };
      const result = queryToTableState(query);

      expect(result.columnFilters![0]).toEqual({
        id: 'createdAt',
        value: { date: '2023-12-01' },
      });
    });

    it('should filter out empty string values', () => {
      const filtersWithEmpty: RQLFilter[] = [
        ...mockFilters,
        {
          name: 'status',
          operator: 'eq',
          value: '',
          _type: FilterType.string,
        },
      ];

      const query: DataTableQuery = {
        filters: filtersWithEmpty,
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toHaveLength(2);
    });

    it('should convert sort to table state', () => {
      const query: DataTableQuery = {
        sort: mockSort,
      };
      const result = queryToTableState(query);

      expect(result.sorting).toEqual([
        { id: 'name', desc: false },
        { id: 'age', desc: true },
      ]);
    });

    it('should include global filter', () => {
      const query: DataTableQuery = {
        search: 'test search',
      };
      const result = queryToTableState(query);

      expect(result.globalFilter).toBe('test search');
    });

    it('should handle null/undefined filters', () => {
      const query: DataTableQuery = {
        filters: null as any,
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toEqual([]);
    });

    it('should handle null/undefined sort', () => {
      const query: DataTableQuery = {
        sort: null as any,
      };
      const result = queryToTableState(query);

      expect(result.sorting).toBeUndefined();
    });
  });

  describe('getColumnsWithFilterFn', () => {
    it('should return columns without filter functions when no filters provided', () => {
      const result = getColumnsWithFilterFn(mockColumns);

      expect(result).toHaveLength(mockColumns.length);
      result.forEach(column => {
        expect(column.filterFn).toBeUndefined();
      });
    });

    it('should add filter functions for matching columns', () => {
      const result = getColumnsWithFilterFn(mockColumns, mockFilters);

      const nameColumn = result.find(col => col.accessorKey === 'name');
      const ageColumn = result.find(col => col.accessorKey === 'age');
      const statusColumn = result.find(col => col.accessorKey === 'status');

      expect(nameColumn?.filterFn).toBeDefined();
      expect(ageColumn?.filterFn).toBeDefined();
      expect(statusColumn?.filterFn).toBeUndefined();
    });

    it('should handle empty columns array', () => {
      const result = getColumnsWithFilterFn([], mockFilters);
      expect(result).toEqual([]);
    });

    it('should handle empty filters array', () => {
      const result = getColumnsWithFilterFn(mockColumns, []);
      
      result.forEach(column => {
        expect(column.filterFn).toBeUndefined();
      });
    });

    it('should handle undefined columns', () => {
      const result = getColumnsWithFilterFn(undefined, mockFilters);
      expect(result).toEqual([]);
    });

    it('should handle undefined filters', () => {
      const result = getColumnsWithFilterFn(mockColumns, undefined);
      
      result.forEach(column => {
        expect(column.filterFn).toBeUndefined();
      });
    });

    it('should only add filter function when operator exists', () => {
      const filtersWithoutOperator: RQLFilter[] = [
        {
          name: 'name',
          operator: '' as any,
          value: 'Alice',
          _type: FilterType.string,
        },
      ];

      const result = getColumnsWithFilterFn(mockColumns, filtersWithoutOperator);
      const nameColumn = result.find(col => col.accessorKey === 'name');
      
      expect(nameColumn?.filterFn).toBeUndefined();
    });
  });

  describe('groupData', () => {
    it('should return ungrouped data when no group_by specified', () => {
      const result = groupData(mockData);
      expect(result).toEqual(mockData);
    });

    it('should return ungrouped data when group_by is default option', () => {
      const result = groupData(mockData, defaultGroupOption.id, mockColumns);
      expect(result).toEqual(mockData);
    });

    it('should group data by specified field', () => {
      const result = groupData(mockData, 'department', mockColumns);

      expect(result).toHaveLength(3);
      
      const engineeringGroup = result.find(group => group.group_key === 'engineering');
      const marketingGroup = result.find(group => group.group_key === 'marketing');
      const salesGroup = result.find(group => group.group_key === 'sales');

      expect(engineeringGroup).toBeDefined();
      expect(engineeringGroup!.subRows).toHaveLength(2);
      expect(engineeringGroup!.label).toBe('engineering');
      expect(engineeringGroup!.count).toBe(2);

      expect(marketingGroup).toBeDefined();
      expect(marketingGroup!.subRows).toHaveLength(1);
      
      expect(salesGroup).toBeDefined();
      expect(salesGroup!.subRows).toHaveLength(1);
    });

    it('should use groupLabelsMap when provided', () => {
      const columnsWithLabels: DataTableColumnDef<any, any>[] = [
        {
          accessorKey: 'department',
          header: 'Department',
          groupLabelsMap: {
            'engineering': 'Engineering Team',
            'marketing': 'Marketing Team',
          },
        },
      ];

      const result = groupData(mockData, 'department', columnsWithLabels);
      
      const engineeringGroup = result.find(group => group.group_key === 'engineering');
      const marketingGroup = result.find(group => group.group_key === 'marketing');
      const salesGroup = result.find(group => group.group_key === 'sales');

      expect(engineeringGroup!.label).toBe('Engineering Team');
      expect(marketingGroup!.label).toBe('Marketing Team');
      expect(salesGroup!.label).toBe('sales'); // No mapping, uses original
    });

    it('should use groupCountMap when provided', () => {
      const columnsWithCount: DataTableColumnDef<any, any>[] = [
        {
          accessorKey: 'department',
          header: 'Department',
          groupCountMap: {
            'engineering': 10,
            'marketing': 5,
          },
        },
      ];

      const result = groupData(mockData, 'department', columnsWithCount);
      
      const engineeringGroup = result.find(group => group.group_key === 'engineering');
      const marketingGroup = result.find(group => group.group_key === 'marketing');
      const salesGroup = result.find(group => group.group_key === 'sales');

      expect(engineeringGroup!.count).toBe(10);
      expect(marketingGroup!.count).toBe(5);
      expect(salesGroup!.count).toBe(1); // Falls back to actual length
    });

    it('should handle showGroupCount flag', () => {
      const columnsWithShowCount: DataTableColumnDef<any, any>[] = [
        {
          accessorKey: 'department',
          header: 'Department',
          showGroupCount: true,
        },
      ];

      const result = groupData(mockData, 'department', columnsWithShowCount);
      
      result.forEach(group => {
        expect(group.showGroupCount).toBe(true);
      });
    });

    it('should return empty array for null/undefined data', () => {
      expect(groupData(null as any)).toEqual([]);
      expect(groupData(undefined as any)).toEqual([]);
    });

    it('should handle empty data array', () => {
      const result = groupData([], 'department', mockColumns);
      expect(result).toEqual([]);
    });

    it('should handle missing group field in data', () => {
      const dataWithoutGroupField = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
      ];

      const result = groupData(dataWithoutGroupField, 'department', mockColumns);
      expect(result).toHaveLength(1);
      expect(result[0].group_key).toBe(undefined);
      expect(result[0].subRows).toHaveLength(2);
    });
  });

  describe('hasQueryChanged', () => {
    const baseQuery: DataTableQuery = {
      filters: mockFilters,
      sort: mockSort,
      group_by: ['department'],
      search: 'test',
    };

    it('should return true when old query is null', () => {
      expect(hasQueryChanged(null, baseQuery)).toBe(true);
    });

    it('should return false when queries are identical', () => {
      const newQuery = { ...baseQuery };
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(false);
    });

    it('should detect filter changes - different values', () => {
      const newQuery = {
        ...baseQuery,
        filters: [
          {
            name: 'name',
            operator: 'eq' as const,
            value: 'Different',
            stringValue: 'Different',
            _type: FilterType.string,
          },
        ],
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect filter changes - different operators', () => {
      const newQuery = {
        ...baseQuery,
        filters: [
          {
            name: 'name',
            operator: 'eq' as const,
            value: 'Alice',
            stringValue: 'Alice',
            _type: FilterType.string,
          },
        ],
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect filter changes - different count', () => {
      const newQuery = {
        ...baseQuery,
        filters: [mockFilters[0]], // Only one filter instead of two
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect sort changes', () => {
      const newQuery = {
        ...baseQuery,
        sort: [{ name: 'age', order: SortOrders.ASC }],
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect group_by changes', () => {
      const newQuery = {
        ...baseQuery,
        group_by: ['status'],
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect search changes', () => {
      const newQuery = {
        ...baseQuery,
        search: 'different search',
      };
      
      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should handle undefined filters', () => {
      const queryWithoutFilters = { ...baseQuery, filters: undefined };
      const newQuery = { ...baseQuery, filters: [] };
      
      expect(hasQueryChanged(queryWithoutFilters, newQuery)).toBe(false);
    });

    it('should handle select filters with empty values', () => {
      const queryWithSelectFilter = {
        ...baseQuery,
        filters: [
          {
            name: 'status',
            operator: 'eq' as const,
            value: EmptyFilterValue,
            _type: FilterType.select,
          },
        ],
      };

      const newQuery = {
        ...baseQuery,
        filters: [
          {
            name: 'status',
            operator: 'eq' as const,
            value: EmptyFilterValue,
            _type: FilterType.select,
          },
        ],
      };
      
      expect(hasQueryChanged(queryWithSelectFilter, newQuery)).toBe(false);
    });
  });

  describe('getInitialColumnVisibility', () => {
    it('should return visibility object for columns', () => {
      const result = getInitialColumnVisibility(mockColumns);
      
      expect(result).toEqual({
        name: true,
        age: true,
        status: true,
        createdAt: true,
        hidden: false, // defaultHidden: true
      });
    });

    it('should handle empty columns array', () => {
      const result = getInitialColumnVisibility([]);
      expect(result).toEqual({});
    });

    it('should handle undefined columns', () => {
      const result = getInitialColumnVisibility();
      expect(result).toEqual({});
    });

    it('should handle columns without accessorKey', () => {
      const columnsWithoutAccessor = [
        {
          header: 'Actions',
          // No accessorKey
        } as any,
      ];

      const result = getInitialColumnVisibility(columnsWithoutAccessor);
      expect(result).toEqual({
        undefined: true,
      });
    });

    it('should default to true when defaultHidden is not specified', () => {
      const columnsWithoutDefault = [
        {
          accessorKey: 'visible',
          header: 'Visible Column',
        },
      ];

      const result = getInitialColumnVisibility(columnsWithoutDefault);
      expect(result).toEqual({
        visible: true,
      });
    });
  });

  describe('sanitizeTableQuery', () => {
    it('should remove default group option', () => {
      const query: DataTableQuery = {
        group_by: [defaultGroupOption.id, 'department'],
      };
      
      const result = sanitizeTableQuery(query);
      expect(result.group_by).toEqual(['department']);
    });

    it('should filter out empty string filters', () => {
      const filtersWithEmpty: RQLFilter[] = [
        {
          name: 'name',
          operator: 'eq',
          value: 'Alice',
          _type: FilterType.string,
        },
        {
          name: 'status',
          operator: 'eq',
          value: '',
          _type: FilterType.string,
        },
      ];

      const query: DataTableQuery = {
        filters: filtersWithEmpty,
      };
      
      const result = sanitizeTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0].name).toBe('name');
    });

    it('should keep select filters even with empty values', () => {
      const selectFilter: RQLFilter = {
        name: 'status',
        operator: 'eq',
        value: EmptyFilterValue,
        _type: FilterType.select,
      };

      const query: DataTableQuery = {
        filters: [selectFilter],
      };
      
      const result = sanitizeTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0].name).toBe('status');
    });

    it('should preserve other query properties', () => {
      const query: DataTableQuery = {
        search: 'test search',
        limit: 50,
        offset: 10,
        filters: mockFilters,
        sort: mockSort,
        group_by: ['department'],
      };
      
      const result = sanitizeTableQuery(query);
      expect(result.search).toBe('test search');
      expect(result.limit).toBe(50);
      expect(result.offset).toBe(10);
      expect(result.sort).toEqual(mockSort);
      expect(result.group_by).toEqual(['department']);
    });

    it('should handle empty query', () => {
      const query: DataTableQuery = {};
      
      const result = sanitizeTableQuery(query);
      expect(result).toEqual({
        group_by: [],
        filters: [],
        sort: [],
      });
    });

    it('should call getFilterOperator and getFilterValue for each filter', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'age',
            operator: 'gt',
            value: 25,
            _type: FilterType.number,
            _dataType: 'number',
          },
        ],
      };
      
      const result = sanitizeTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0]).toEqual({
        name: 'age',
        operator: 'gt',
        numberValue: 25,
        value: 25,
      });
    });
  });

  describe('getDefaultTableQuery', () => {
    const defaultSort: DataTableSort = {
      name: 'createdAt',
      order: SortOrders.DESC,
    };

    it('should return query with default sort and group', () => {
      const result = getDefaultTableQuery(defaultSort);
      
      expect(result).toEqual({
        sort: [defaultSort],
        group_by: [defaultGroupOption.id],
      });
    });

    it('should merge with existing query', () => {
      const existingQuery: DataTableQuery = {
        search: 'existing search',
        filters: mockFilters,
      };
      
      const result = getDefaultTableQuery(defaultSort, existingQuery);
      
      expect(result).toEqual({
        sort: [defaultSort],
        group_by: [defaultGroupOption.id],
        search: 'existing search',
        filters: mockFilters,
      });
    });

    it('should not override sort and group_by from existing query', () => {
      const existingQuery: DataTableQuery = {
        sort: [{ name: 'name', order: SortOrders.ASC }],
        group_by: ['department'],
        search: 'existing search',
      };
      
      const result = getDefaultTableQuery(defaultSort, existingQuery);
      
      // The function spreads oldQuery after defaults, so existing values override defaults
      expect(result.sort).toEqual([{ name: 'name', order: SortOrders.ASC }]);
      expect(result.group_by).toEqual(['department']);
      expect(result.search).toBe('existing search');
    });

    it('should handle empty existing query', () => {
      const result = getDefaultTableQuery(defaultSort, {});
      
      expect(result).toEqual({
        sort: [defaultSort],
        group_by: [defaultGroupOption.id],
      });
    });
  });
});