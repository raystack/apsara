import type { ColumnDef, Row, Table } from '@tanstack/react-table';
import { TableState } from '@tanstack/table-core';
import dayjs from 'dayjs';

import { FilterOperatorTypes, FilterType } from '~/types/filters';
import {
  DataViewField,
  DataViewQuery,
  DataViewSort,
  defaultGroupOption,
  GroupByResolver,
  GroupedData,
  InternalFilter,
  InternalQuery,
  SortOrders
} from '../data-view.types';
import {
  getFilterFn,
  getFilterOperator,
  getFilterValue
} from './filter-operations';

export function queryToTableState(query: InternalQuery): Partial<TableState> {
  const columnFilters =
    query.filters
      ?.filter(data => {
        if (data._type === FilterType.date) return dayjs(data.value).isValid();
        if (data.value !== '') return true;
        return false;
      })
      ?.map(data => {
        const valueObject =
          data._type === FilterType.date
            ? { date: data.value }
            : { value: data.value };
        return { value: valueObject, id: data?.name };
      }) || [];

  const sorting = query.sort?.map(data => ({
    id: data?.name,
    desc: data?.order === SortOrders.DESC
  }));
  return {
    columnFilters,
    sorting,
    globalFilter: query.search
  };
}

/**
 * Convert field metadata to TanStack ColumnDefs. These carry filter/sort/group/
 * visibility capability and the filter predicate. The `header` falls back to
 * `field.label` so renderers that bypass their column spec still get the right
 * default header text.
 */
export function fieldsToColumnDefs<TData>(
  fields: DataViewField<TData>[] = [],
  filters: InternalFilter[] = []
): ColumnDef<TData>[] {
  return fields.map(field => {
    const colFilter = filters?.find(f => f.name === field.accessorKey);
    const filterFn = colFilter?.operator
      ? getFilterFn(field.filterType || FilterType.string, colFilter.operator)
      : undefined;

    return {
      id: field.accessorKey,
      accessorKey: field.accessorKey,
      header: field.label,
      enableColumnFilter: field.filterable ?? false,
      enableSorting: field.sortable ?? false,
      enableGrouping: field.groupable ?? false,
      enableHiding: field.hideable ?? false,
      filterFn
    } as ColumnDef<TData>;
  });
}

/**
 * Bucket data into `GroupedData` entries keyed by `group_by`. When a resolver
 * is supplied for that key, the resolver runs per-row; otherwise the field is
 * accessed directly. Used in client mode only.
 */
export function groupData<TData>(
  data: TData[],
  group_by?: string,
  fields: DataViewField<TData>[] = [],
  resolvers: Record<string, GroupByResolver<TData>> = {}
): GroupedData<TData>[] {
  if (!data) return [];
  if (!group_by || group_by === defaultGroupOption.id)
    return data as GroupedData<TData>[];

  const resolver = resolvers[group_by];

  const groupMap = new Map<string, TData[]>();
  data.forEach(currentData => {
    const keyValue = resolver
      ? resolver(currentData)
      : ((currentData as Record<string, unknown>)[group_by] as string);
    const bucketKey = keyValue == null ? '' : String(keyValue);
    if (!groupMap.has(bucketKey)) groupMap.set(bucketKey, []);
    groupMap.get(bucketKey)?.push(currentData);
  });

  const field = fields.find(f => f.accessorKey === group_by);
  const showGroupCount = field?.showGroupCount || false;
  const groupLabelsMap = field?.groupLabelsMap || {};
  const groupCountMap = field?.groupCountMap || {};
  const groupedData: GroupedData<TData>[] = [];

  groupMap.forEach((value, key) => {
    groupedData.push({
      label: groupLabelsMap[key] || key,
      group_key: key,
      subRows: value,
      count: groupCountMap[key] ?? value.length,
      showGroupCount
    });
  });

  return groupedData;
}

const generateFilterMap = (
  filters: InternalFilter[] = []
): Map<string, any> => {
  return new Map(
    filters
      ?.filter(data => data._type === FilterType.select || data.value !== '')
      .map(({ name, operator, value }) => [`${name}-${operator}`, value])
  );
};

const generateSortMap = (sort: DataViewSort[] = []): Map<string, string> => {
  return new Map(sort.map(({ name, order }) => [name, order]));
};

const isFilterChanged = (
  oldFilters: InternalFilter[] = [],
  newFilters: InternalFilter[] = []
): boolean => {
  const oldFilterMap = generateFilterMap(oldFilters);
  const newFilterMap = generateFilterMap(newFilters);
  if (oldFilterMap.size !== newFilterMap.size) return true;
  return [...newFilterMap].some(
    ([key, value]) => oldFilterMap.get(key) !== value
  );
};

const isSortChanged = (
  oldSort: DataViewSort[] = [],
  newSort: DataViewSort[] = []
): boolean => {
  if (oldSort.length !== newSort.length) return true;
  const oldSortMap = generateSortMap(oldSort);
  const newSortMap = generateSortMap(newSort);
  return [...newSortMap].some(([key, order]) => oldSortMap.get(key) !== order);
};

const isGroupChanged = (
  oldGroupBy: string[] = [],
  newGroupBy: string[] = []
): boolean => {
  if (oldGroupBy.length !== newGroupBy.length) return true;
  const oldGroupSet = new Set(oldGroupBy);
  return newGroupBy.some(item => !oldGroupSet.has(item));
};

const isSearchChanged = (oldSearch?: string, newSearch?: string): boolean =>
  oldSearch !== newSearch;

/**
 * True when there's an active filter, search, or sort/group differing from the
 * declared defaults. Used to distinguish zero state from empty state.
 */
export const hasActiveQuery = (
  tableQuery: InternalQuery,
  defaultSort: DataViewSort
): boolean => {
  const hasFilters =
    (tableQuery?.filters && tableQuery.filters.length > 0) || false;
  const hasSearch = Boolean(
    tableQuery?.search && tableQuery.search.trim() !== ''
  );
  const sortChanged = isSortChanged([defaultSort], tableQuery.sort || []);
  const groupChanged = isGroupChanged(
    [defaultGroupOption.id],
    tableQuery.group_by || []
  );
  return hasFilters || hasSearch || sortChanged || groupChanged;
};

export const hasQueryChanged = (
  oldQuery: InternalQuery | null,
  newQuery: InternalQuery
): boolean => {
  if (!oldQuery) return true;
  return (
    isFilterChanged(oldQuery.filters, newQuery.filters) ||
    isSortChanged(oldQuery.sort, newQuery.sort) ||
    isGroupChanged(oldQuery.group_by, newQuery.group_by) ||
    isSearchChanged(oldQuery.search, newQuery.search)
  );
};

export function getInitialColumnVisibility<TData>(
  fields: DataViewField<TData>[] = []
): Record<string, boolean> {
  return fields.reduce<Record<string, boolean>>((acc, field) => {
    acc[field.accessorKey] = field.defaultHidden ? false : true;
    return acc;
  }, {});
}

export function transformToDataViewQuery(query: InternalQuery): DataViewQuery {
  const { group_by = [], filters = [], sort = [], ...rest } = query;
  const sanitizedGroupBy = group_by?.filter(
    key => key !== defaultGroupOption.id
  );

  const sanitizedFilters =
    filters
      ?.filter(data => {
        if (data._type === FilterType.select) return true;
        if (data._type === FilterType.date) return dayjs(data.value).isValid();
        if (data.value !== '') return true;
        return false;
      })
      ?.map(data => ({
        name: data.name,
        operator: getFilterOperator({
          operator: data.operator,
          value: data.value,
          filterType: data._type
        }),
        ...getFilterValue({
          value: data.value,
          filterType: data._type,
          dataType: data._dataType,
          operator: data.operator
        })
      })) || [];

  return {
    ...rest,
    sort,
    group_by: sanitizedGroupBy,
    filters: sanitizedFilters
  };
}

/**
 * Reverse of `transformToDataViewQuery`. The UI re-applies type information
 * from field metadata once it sees a column, since the wire format strips it.
 */
export function dataViewQueryToInternal(query: DataViewQuery): InternalQuery {
  const { filters, ...rest } = query;
  if (!filters) return rest;

  const internalFilters: InternalFilter[] = filters.map(filter => {
    const {
      operator,
      value,
      stringValue,
      numberValue,
      boolValue,
      ...filterRest
    } = filter;

    let transformedFilter = {
      operator: operator as FilterOperatorTypes,
      value,
      ...(stringValue !== undefined && { stringValue }),
      ...(numberValue !== undefined && { numberValue }),
      ...(boolValue !== undefined && { boolValue })
    };

    if (operator === 'ilike' && stringValue) {
      if (stringValue.startsWith('%') && stringValue.endsWith('%')) {
        transformedFilter = {
          operator: 'contains',
          value: stringValue.slice(1, -1)
        };
      } else if (stringValue.endsWith('%')) {
        transformedFilter = {
          operator: 'starts_with',
          value: stringValue.slice(0, -1)
        };
      } else if (stringValue.startsWith('%')) {
        transformedFilter = {
          operator: 'ends_with',
          value: stringValue.slice(1)
        };
      } else {
        transformedFilter = { operator: 'contains', value: stringValue };
      }
    }

    return {
      ...filterRest,
      ...transformedFilter,
      _type: undefined,
      _dataType: undefined
    } as InternalFilter;
  });

  return { ...rest, filters: internalFilters };
}

/** Leaf count from the row tree. Not `flatRows`: with `filterFromLeafRows`, TanStack's filtered model leaves `flatRows` empty while `rows` is correct. */
export function countLeafRows<T>(rows: Row<T>[]): number {
  return rows.reduce(
    (n, row) => n + (row.subRows?.length ? countLeafRows(row.subRows) : 1),
    0
  );
}

/** Difference between pre- and post-filter leaf rows (client mode only). */
export function getClientHiddenLeafRowCount<T>(table: Table<T>): number {
  const pre = table.getPreFilteredRowModel();
  const post = table.getFilteredRowModel();
  return Math.max(0, countLeafRows(pre.rows) - countLeafRows(post.rows));
}

export function hasActiveTableFiltering<T>(table: Table<T>): boolean {
  const state = table.getState();
  if (state.columnFilters?.length > 0) return true;
  const gf = state.globalFilter;
  if (gf === undefined || gf === null) return false;
  return String(gf).trim() !== '';
}

export function getDefaultTableQuery(
  defaultSort: DataViewSort,
  oldQuery: DataViewQuery = {}
): InternalQuery {
  const internalQuery = dataViewQueryToInternal(oldQuery);
  return {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
    ...internalQuery
  };
}
