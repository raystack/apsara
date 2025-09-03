import { describe, expect, it } from 'vitest';
import { FilterType } from '~/types/filters';
import { EmptyFilterValue } from '~/types/filters';
import {
  DataTableColumnDef,
  DataTableQuery,
  DataTableSort,
  InternalFilter,
  InternalQuery,
  SortOrders,
  defaultGroupOption
} from '../../data-table.types';
import {
  dataTableQueryToInternal,
  getColumnsWithFilterFn,
  getDefaultTableQuery,
  getInitialColumnVisibility,
  groupData,
  hasQueryChanged,
  queryToTableState,
  transformToDataTableQuery
} from '../index';

// Mock data for tests
const mockColumns: DataTableColumnDef<any, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    filterType: FilterType.string,
    enableColumnFilter: true,
    enableSorting: true
  },
  {
    accessorKey: 'age',
    header: 'Age',
    filterType: FilterType.number,
    enableColumnFilter: true,
    enableSorting: true
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterType: FilterType.select,
    enableColumnFilter: true,
    enableSorting: false
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    filterType: FilterType.date,
    enableColumnFilter: true,
    enableSorting: true
  },
  {
    accessorKey: 'hidden',
    header: 'Hidden Column',
    defaultHidden: true,
    enableColumnFilter: false
  }
];

const mockData = [
  {
    id: 1,
    name: 'Alice',
    age: 25,
    status: 'active',
    department: 'engineering'
  },
  { id: 2, name: 'Bob', age: 30, status: 'inactive', department: 'marketing' },
  {
    id: 3,
    name: 'Charlie',
    age: 35,
    status: 'active',
    department: 'engineering'
  },
  { id: 4, name: 'David', age: 28, status: 'active', department: 'sales' }
];

const mockFilters: InternalFilter[] = [
  {
    name: 'name',
    operator: 'contains',
    value: 'Alice',
    stringValue: 'Alice',
    _type: FilterType.string
  },
  {
    name: 'age',
    operator: 'gte',
    value: 25,
    numberValue: 25,
    _type: FilterType.number
  }
];

const mockSort: DataTableSort[] = [
  { name: 'name', order: SortOrders.ASC },
  { name: 'age', order: SortOrders.DESC }
];

describe('Data Table Utils', () => {
  describe('queryToTableState', () => {
    it('should convert empty query to table state', () => {
      const query: InternalQuery = {};
      const result = queryToTableState(query);

      expect(result).toEqual({
        columnFilters: [],
        sorting: undefined,
        globalFilter: undefined
      });
    });

    it('should convert query with filters to table state', () => {
      const query: InternalQuery = {
        filters: mockFilters
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toHaveLength(2);
      expect(result.columnFilters![0]).toEqual({
        id: 'name',
        value: { value: 'Alice' }
      });
      expect(result.columnFilters![1]).toEqual({
        id: 'age',
        value: { value: 25 }
      });
    });

    it('should convert date filters correctly', () => {
      const dateFilter: InternalFilter = {
        name: 'createdAt',
        operator: 'eq',
        value: '2023-12-01',
        _type: FilterType.date
      };

      const query: InternalQuery = {
        filters: [dateFilter]
      };
      const result = queryToTableState(query);

      expect(result.columnFilters![0]).toEqual({
        id: 'createdAt',
        value: { date: '2023-12-01' }
      });
    });

    it('should filter out empty string values', () => {
      const filtersWithEmpty: InternalFilter[] = [
        ...mockFilters,
        {
          name: 'status',
          operator: 'eq',
          value: '',
          _type: FilterType.string
        }
      ];

      const query: InternalQuery = {
        filters: filtersWithEmpty
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toHaveLength(2);
    });

    it('should convert sort to table state', () => {
      const query: InternalQuery = {
        sort: mockSort
      };
      const result = queryToTableState(query);

      expect(result.sorting).toEqual([
        { id: 'name', desc: false },
        { id: 'age', desc: true }
      ]);
    });

    it('should include global filter', () => {
      const query: InternalQuery = {
        search: 'test search'
      };
      const result = queryToTableState(query);

      expect(result.globalFilter).toBe('test search');
    });

    it('should handle null/undefined filters', () => {
      const query: InternalQuery = {
        filters: null as any
      };
      const result = queryToTableState(query);

      expect(result.columnFilters).toEqual([]);
    });

    it('should handle null/undefined sort', () => {
      const query: InternalQuery = {
        sort: null as any
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
      const filtersWithoutOperator: InternalFilter[] = [
        {
          name: 'name',
          operator: '' as any,
          value: 'Alice',
          _type: FilterType.string
        }
      ];

      const result = getColumnsWithFilterFn(
        mockColumns,
        filtersWithoutOperator
      );
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

      const engineeringGroup = result.find(
        group => group.group_key === 'engineering'
      );
      const marketingGroup = result.find(
        group => group.group_key === 'marketing'
      );
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
            engineering: 'Engineering Team',
            marketing: 'Marketing Team'
          }
        }
      ];

      const result = groupData(mockData, 'department', columnsWithLabels);

      const engineeringGroup = result.find(
        group => group.group_key === 'engineering'
      );
      const marketingGroup = result.find(
        group => group.group_key === 'marketing'
      );
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
            engineering: 10,
            marketing: 5
          }
        }
      ];

      const result = groupData(mockData, 'department', columnsWithCount);

      const engineeringGroup = result.find(
        group => group.group_key === 'engineering'
      );
      const marketingGroup = result.find(
        group => group.group_key === 'marketing'
      );
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
          showGroupCount: true
        }
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
        { id: 2, name: 'Bob', age: 30 }
      ];

      const result = groupData(
        dataWithoutGroupField,
        'department',
        mockColumns
      );
      expect(result).toHaveLength(1);
      expect(result[0].group_key).toBe(undefined);
      expect(result[0].subRows).toHaveLength(2);
    });
  });

  describe('hasQueryChanged', () => {
    const baseQuery: InternalQuery = {
      filters: mockFilters,
      sort: mockSort,
      group_by: ['department'],
      search: 'test'
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
            _type: FilterType.string
          }
        ]
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
            _type: FilterType.string
          }
        ]
      };

      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect filter changes - different count', () => {
      const newQuery = {
        ...baseQuery,
        filters: [mockFilters[0]] // Only one filter instead of two
      };

      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect sort changes', () => {
      const newQuery = {
        ...baseQuery,
        sort: [{ name: 'age', order: SortOrders.ASC }]
      };

      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect group_by changes', () => {
      const newQuery = {
        ...baseQuery,
        group_by: ['status']
      };

      expect(hasQueryChanged(baseQuery, newQuery)).toBe(true);
    });

    it('should detect search changes', () => {
      const newQuery = {
        ...baseQuery,
        search: 'different search'
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
            _type: FilterType.select
          }
        ]
      };

      const newQuery = {
        ...baseQuery,
        filters: [
          {
            name: 'status',
            operator: 'eq' as const,
            value: EmptyFilterValue,
            _type: FilterType.select
          }
        ]
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
        hidden: false // defaultHidden: true
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
          header: 'Actions'
          // No accessorKey
        } as any
      ];

      const result = getInitialColumnVisibility(columnsWithoutAccessor);
      expect(result).toEqual({
        undefined: true
      });
    });

    it('should default to true when defaultHidden is not specified', () => {
      const columnsWithoutDefault = [
        {
          accessorKey: 'visible',
          header: 'Visible Column'
        }
      ];

      const result = getInitialColumnVisibility(columnsWithoutDefault);
      expect(result).toEqual({
        visible: true
      });
    });
  });

  describe('transformToDataTableQuery', () => {
    it('should remove default group option', () => {
      const query: InternalQuery = {
        group_by: [defaultGroupOption.id, 'department']
      };

      const result = transformToDataTableQuery(query);
      expect(result.group_by).toEqual(['department']);
    });

    it('should filter out empty string filters', () => {
      const filtersWithEmpty: InternalFilter[] = [
        {
          name: 'name',
          operator: 'eq',
          value: 'Alice',
          _type: FilterType.string
        },
        {
          name: 'status',
          operator: 'eq',
          value: '',
          _type: FilterType.string
        }
      ];

      const query: InternalQuery = {
        filters: filtersWithEmpty
      };

      const result = transformToDataTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0].name).toBe('name');
    });

    it('should keep select filters even with empty values', () => {
      const selectFilter: InternalFilter = {
        name: 'status',
        operator: 'eq',
        value: EmptyFilterValue,
        _type: FilterType.select
      };

      const query: InternalQuery = {
        filters: [selectFilter]
      };

      const result = transformToDataTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0].name).toBe('status');
    });

    it('should preserve other query properties', () => {
      const query: InternalQuery = {
        search: 'test search',
        limit: 50,
        offset: 10,
        filters: mockFilters,
        sort: mockSort,
        group_by: ['department']
      };

      const result = transformToDataTableQuery(query);
      expect(result.search).toBe('test search');
      expect(result.limit).toBe(50);
      expect(result.offset).toBe(10);
      expect(result.sort).toEqual(mockSort);
      expect(result.group_by).toEqual(['department']);
    });

    it('should handle empty query', () => {
      const query: InternalQuery = {};

      const result = transformToDataTableQuery(query);
      expect(result).toEqual({
        group_by: [],
        filters: [],
        sort: []
      });
    });

    it('should call getFilterOperator and getFilterValue for each filter', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'age',
            operator: 'gt',
            value: 25,
            _type: FilterType.number,
            _dataType: 'number'
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      expect(result.filters).toHaveLength(1);
      expect(result.filters![0]).toEqual({
        name: 'age',
        operator: 'gt',
        numberValue: 25,
        value: 25
      });
    });
  });

  describe('getDefaultTableQuery', () => {
    const defaultSort: DataTableSort = {
      name: 'createdAt',
      order: SortOrders.DESC
    };

    it('should return query with default sort and group', () => {
      const result = getDefaultTableQuery(defaultSort);

      expect(result).toEqual({
        sort: [defaultSort],
        group_by: [defaultGroupOption.id]
      });
    });

    it('should merge with existing query', () => {
      const existingQuery: DataTableQuery = {
        search: 'existing search',
        // DataTableQuery uses DataTableFilter which doesn't have internal fields
        filters: [
          {
            name: 'name',
            operator: 'ilike',
            value: 'Alice',
            stringValue: '%Alice%'
          }
        ]
      };

      const result = getDefaultTableQuery(defaultSort, existingQuery);

      expect(result).toEqual({
        sort: [defaultSort],
        group_by: [defaultGroupOption.id],
        search: 'existing search',
        // After transformation, should have InternalFilter with UI operators
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: 'Alice',
            // stringValue is not preserved in InternalFilter after transformation
            _type: undefined,
            _dataType: undefined
          }
        ]
      });
    });

    it('should not override sort and group_by from existing query', () => {
      const existingQuery: DataTableQuery = {
        sort: [{ name: 'name', order: SortOrders.ASC }],
        group_by: ['department'],
        search: 'existing search'
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
        group_by: [defaultGroupOption.id]
      });
    });
  });

  describe('dataTableQueryToInternal', () => {
    it('should transform ilike with %value% to contains operator', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'title',
            operator: 'ilike',
            value: 'test',
            stringValue: '%test%'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'title',
          operator: 'contains',
          value: 'test',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should transform ilike with value% to starts_with operator', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'email',
            operator: 'ilike',
            value: 'john',
            stringValue: 'john%'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'email',
          operator: 'starts_with',
          value: 'john',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should transform ilike with %value to ends_with operator', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'filename',
            operator: 'ilike',
            value: '.pdf',
            stringValue: '%.pdf'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'filename',
          operator: 'ends_with',
          value: '.pdf',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should preserve non-ilike operators as-is', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'age',
            operator: 'gte',
            value: 25,
            numberValue: 25
          },
          {
            name: 'status',
            operator: 'eq',
            value: 'active',
            stringValue: 'active'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'age',
          operator: 'gte',
          value: 25,
          numberValue: 25,
          _type: undefined,
          _dataType: undefined
        },
        {
          name: 'status',
          operator: 'eq',
          value: 'active',
          stringValue: 'active',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle query without filters', () => {
      const query: DataTableQuery = {
        sort: [{ name: 'createdAt', order: SortOrders.DESC }],
        search: 'test'
      };

      const result = dataTableQueryToInternal(query);

      expect(result).toEqual({
        sort: [{ name: 'createdAt', order: SortOrders.DESC }],
        search: 'test'
      });
    });

    it('should handle ilike without wildcards (edge case)', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'description',
            operator: 'ilike',
            value: 'plain',
            stringValue: 'plain'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'description',
          operator: 'contains', // defaults to contains when no wildcards
          value: 'plain',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle empty stringValue for ilike operator', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'name',
            operator: 'ilike',
            value: 'test',
            stringValue: ''
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'name',
          operator: 'ilike',
          value: 'test',
          stringValue: '',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle ilike operator without stringValue', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'name',
            operator: 'ilike',
            value: 'test'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'name',
          operator: 'ilike',
          value: 'test',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle mixed DataTableFilter value fields for non-ilike operators', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'mixed',
            operator: 'eq',
            value: 'test',
            stringValue: 'test',
            numberValue: 123,
            boolValue: true
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'mixed',
          operator: 'eq',
          value: 'test',
          stringValue: 'test',
          numberValue: 123,
          boolValue: true,
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle wildcard patterns with special characters', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'special',
            operator: 'ilike',
            value: 'test@domain.com',
            stringValue: '%test@domain.com%'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'special',
          operator: 'contains',
          value: 'test@domain.com',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });
  });

  describe('transformToDataTableQuery with new operators', () => {
    it('should transform contains operator to ilike with %value%', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'title',
            operator: 'contains',
            value: 'test',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([
        {
          name: 'title',
          operator: 'ilike',
          value: 'test',
          stringValue: '%test%'
        }
      ]);
    });

    it('should transform starts_with operator to ilike with value%', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'email',
            operator: 'starts_with',
            value: 'john',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([
        {
          name: 'email',
          operator: 'ilike',
          value: 'john',
          stringValue: 'john%'
        }
      ]);
    });

    it('should transform ends_with operator to ilike with %value', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'filename',
            operator: 'ends_with',
            value: '.pdf',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([
        {
          name: 'filename',
          operator: 'ilike',
          value: '.pdf',
          stringValue: '%.pdf'
        }
      ]);
    });

    it('should handle mixed operators correctly', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'title',
            operator: 'contains',
            value: 'test',
            _type: FilterType.string
          },
          {
            name: 'description',
            operator: 'starts_with',
            value: 'The',
            _type: FilterType.string
          },
          {
            name: 'tags',
            operator: 'ends_with',
            value: 'ing',
            _type: FilterType.string
          },
          {
            name: 'author',
            operator: 'eq',
            value: 'John Doe',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([
        {
          name: 'title',
          operator: 'ilike',
          value: 'test',
          stringValue: '%test%'
        },
        {
          name: 'description',
          operator: 'ilike',
          value: 'The',
          stringValue: 'The%'
        },
        {
          name: 'tags',
          operator: 'ilike',
          value: 'ing',
          stringValue: '%ing'
        },
        {
          name: 'author',
          operator: 'eq',
          value: 'John Doe',
          stringValue: 'John Doe'
        }
      ]);
    });

    it('should handle empty values for string operators', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: '',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([]);
    });

    it('should handle select filters with empty values', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'status',
            operator: 'eq',
            value: '',
            _type: FilterType.select
          }
        ]
      };

      const result = transformToDataTableQuery(query);

      expect(result.filters).toEqual([
        {
          name: 'status',
          operator: 'eq',
          value: '',
          stringValue: ''
        }
      ]);
    });

    it('should handle filters without _type', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: 'test'
          } as InternalFilter
        ]
      };

      const result = transformToDataTableQuery(query);

      // Without _type, the function still processes it as string type
      expect(result.filters).toEqual([
        {
          name: 'name',
          operator: 'contains',
          value: 'test',
          stringValue: '%test%'
        }
      ]);
    });

    it('should preserve other query properties', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'title',
            operator: 'contains',
            value: 'test',
            _type: FilterType.string
          }
        ],
        sort: [{ name: 'createdAt', order: 'desc' as const }],
        group_by: ['status'],
        offset: 10,
        limit: 25,
        search: 'global search'
      };

      const result = transformToDataTableQuery(query);

      expect(result.sort).toEqual([{ name: 'createdAt', order: 'desc' }]);
      expect(result.group_by).toEqual(['status']);
      expect(result.offset).toBe(10);
      expect(result.limit).toBe(25);
      expect(result.search).toBe('global search');
    });
  });

  describe('Bidirectional transformation', () => {
    it('should correctly round-trip contains operator', () => {
      const original: InternalQuery = {
        filters: [
          {
            name: 'content',
            operator: 'contains',
            value: 'search term',
            _type: FilterType.string
          }
        ]
      };

      const toDataTableQuery = transformToDataTableQuery(original);
      const backToInternal = dataTableQueryToInternal(toDataTableQuery);

      expect(backToInternal.filters![0]).toMatchObject({
        name: 'content',
        operator: 'contains',
        value: 'search term'
      });
    });

    it('should correctly round-trip starts_with operator', () => {
      const original: InternalQuery = {
        filters: [
          {
            name: 'url',
            operator: 'starts_with',
            value: 'https://',
            _type: FilterType.string
          }
        ]
      };

      const toDataTableQuery = transformToDataTableQuery(original);
      const backToInternal = dataTableQueryToInternal(toDataTableQuery);

      expect(backToInternal.filters![0]).toMatchObject({
        name: 'url',
        operator: 'starts_with',
        value: 'https://'
      });
    });

    it('should correctly round-trip ends_with operator', () => {
      const original: InternalQuery = {
        filters: [
          {
            name: 'extension',
            operator: 'ends_with',
            value: '.tsx',
            _type: FilterType.string
          }
        ]
      };

      const toDataTableQuery = transformToDataTableQuery(original);
      const backToInternal = dataTableQueryToInternal(toDataTableQuery);

      expect(backToInternal.filters![0]).toMatchObject({
        name: 'extension',
        operator: 'ends_with',
        value: '.tsx'
      });
    });
  });

  describe('Wildcard and special character handling', () => {
    it('should handle malformed wildcard patterns', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'weird',
            operator: 'ilike',
            value: 'test',
            stringValue: '%%test%%' // Double wildcards
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'weird',
          operator: 'contains',
          value: '%test%', // Should strip outer % only
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle single % wildcard', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'single',
            operator: 'ilike',
            value: 'test',
            stringValue: '%'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      // Single '%' matches both startsWith('%') and endsWith('%'),
      // so it's treated as 'contains' with empty value
      expect(result.filters).toEqual([
        {
          name: 'single',
          operator: 'contains',
          value: '',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle only wildcards', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'wildcards',
            operator: 'ilike',
            value: '',
            stringValue: '%%'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters).toEqual([
        {
          name: 'wildcards',
          operator: 'contains',
          value: '',
          _type: undefined,
          _dataType: undefined
        }
      ]);
    });

    it('should handle very long string values', () => {
      const longString = 'a'.repeat(1000);
      const query: InternalQuery = {
        filters: [
          {
            name: 'long',
            operator: 'contains',
            value: longString,
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      const backToInternal = dataTableQueryToInternal(result);

      expect(backToInternal.filters![0].value).toBe(longString);
    });

    it('should handle special regex characters in filter values', () => {
      const specialChars = '.*+?^${}()|[]\\';
      const query: InternalQuery = {
        filters: [
          {
            name: 'special',
            operator: 'contains',
            value: specialChars,
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      const backToInternal = dataTableQueryToInternal(result);

      expect(backToInternal.filters![0].value).toBe(specialChars);
    });

    it('should handle unicode characters', () => {
      const unicode = '测试 🚀 émojis ñáñá';
      const query: InternalQuery = {
        filters: [
          {
            name: 'unicode',
            operator: 'starts_with',
            value: unicode,
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      const backToInternal = dataTableQueryToInternal(result);

      expect(backToInternal.filters![0].value).toBe(unicode);
      expect(backToInternal.filters![0].operator).toBe('starts_with');
    });
  });

  describe('Error boundary tests', () => {
    it('should handle null and undefined values gracefully', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'nullValue',
            operator: 'eq',
            value: null,
            _type: FilterType.string
          },
          {
            name: 'undefinedValue',
            operator: 'contains',
            value: undefined,
            _type: FilterType.string
          }
        ]
      };

      expect(() => transformToDataTableQuery(query)).not.toThrow();
    });

    it('should handle circular references in filter values', () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      const query: InternalQuery = {
        filters: [
          {
            name: 'circular',
            operator: 'eq',
            value: circularObj,
            _type: FilterType.select
          }
        ]
      };

      expect(() => transformToDataTableQuery(query)).not.toThrow();
    });
  });

  describe('Type coercion and conversion tests', () => {
    it('should handle string numbers in numeric comparisons', () => {
      const query: DataTableQuery = {
        filters: [
          {
            name: 'age',
            operator: 'gte',
            value: '25',
            stringValue: '25'
          }
        ]
      };

      const result = dataTableQueryToInternal(query);

      expect(result.filters![0].value).toBe('25');
      expect(result.filters![0].stringValue).toBe('25');
    });

    it('should handle boolean values as strings', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'isActive',
            operator: 'eq',
            value: 'true',
            _type: FilterType.select
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      const backToInternal = dataTableQueryToInternal(result);

      expect(backToInternal.filters![0].value).toBe('true');
    });
  });

  describe('Integration with hasQueryChanged', () => {
    it('should detect changes in new string operators', () => {
      const oldQuery: InternalQuery = {
        filters: [
          {
            name: 'title',
            operator: 'contains',
            value: 'test',
            _type: FilterType.string
          }
        ]
      };

      const newQuery: InternalQuery = {
        filters: [
          {
            name: 'title',
            operator: 'starts_with',
            value: 'test',
            _type: FilterType.string
          }
        ]
      };

      expect(hasQueryChanged(oldQuery, newQuery)).toBe(true);
    });

    it('should not detect changes when operators are functionally equivalent', () => {
      const query1: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: 'john',
            _type: FilterType.string
          }
        ]
      };

      const query2: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: 'john',
            _type: FilterType.string
          }
        ]
      };

      expect(hasQueryChanged(query1, query2)).toBe(false);
    });

    it('should handle mixed old and new filter formats', () => {
      const oldQuery: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'eq',
            value: 'john',
            _type: FilterType.string
          }
        ]
      };

      const newQuery: InternalQuery = {
        filters: [
          {
            name: 'name',
            operator: 'contains',
            value: 'john',
            _type: FilterType.string
          }
        ]
      };

      expect(hasQueryChanged(oldQuery, newQuery)).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle email search patterns', () => {
      const scenarios = [
        {
          value: 'john@',
          operator: 'starts_with' as const,
          expected: 'john@%'
        },
        {
          value: '@domain.com',
          operator: 'ends_with' as const,
          expected: '%@domain.com'
        },
        { value: '@', operator: 'contains' as const, expected: '%@%' }
      ];

      scenarios.forEach(({ value, operator, expected }) => {
        const query: InternalQuery = {
          filters: [
            {
              name: 'email',
              operator,
              value,
              _type: FilterType.string
            }
          ]
        };

        const result = transformToDataTableQuery(query);
        expect(result.filters![0].stringValue).toBe(expected);
      });
    });

    it('should handle file extension searches', () => {
      const query: InternalQuery = {
        filters: [
          {
            name: 'filename',
            operator: 'ends_with',
            value: '.pdf',
            _type: FilterType.string
          }
        ]
      };

      const result = transformToDataTableQuery(query);
      const backToInternal = dataTableQueryToInternal(result);

      expect(result.filters![0].stringValue).toBe('%.pdf');
      expect(backToInternal.filters![0].operator).toBe('ends_with');
      expect(backToInternal.filters![0].value).toBe('.pdf');
    });

    it('should handle user search with partial names', () => {
      const searchTerms = ['John', 'john doe', 'J. Smith', "O'Connor"];

      searchTerms.forEach(term => {
        const query: InternalQuery = {
          filters: [
            {
              name: 'fullName',
              operator: 'contains',
              value: term,
              _type: FilterType.string
            }
          ]
        };

        const result = transformToDataTableQuery(query);
        const backToInternal = dataTableQueryToInternal(result);

        expect(backToInternal.filters![0].value).toBe(term);
        expect(result.filters![0].stringValue).toBe(`%${term}%`);
      });
    });
  });
});
