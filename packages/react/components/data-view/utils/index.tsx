import type {
  ColumnDef,
  FilterFn,
  RowData,
  TableState
} from '@tanstack/react-table';

import {
  type RowFilterValue,
  toDayKey,
  withDateFilterTypes
} from '~/shared/date-filters';
import { dropDisallowedFilters } from '~/shared/filter-operations';
import { FilterOperatorTypes, FilterType, FilterTypes } from '~/types/filters';
import {
  DataViewField,
  DataViewFilterValue,
  DataViewQuery,
  DataViewRow,
  DataViewSort,
  DataViewTable,
  defaultGroupOption,
  GroupByResolver,
  GroupedData,
  InternalFilter,
  InternalQuery,
  SortOrders
} from '../data-view.types';
import type { DataViewFeatures } from '../features';
import {
  getFilterFn,
  getFilterOperator,
  getFilterValue
} from './filter-operations';
import { orderBucketKeys } from './order-bucket-keys';

/** The value of a TanStack column filter. It carries the operator, so column defs stay the same while filters change. */
interface ColumnFilterValue extends RowFilterValue {
  operator: FilterOperatorTypes;
}

export function queryToTableState(
  query: InternalQuery
): Partial<TableState<DataViewFeatures>> {
  const columnFilters =
    query.filters
      ?.filter(data => {
        if (data._type === FilterType.date)
          return toDayKey(data.value) !== null;
        if (data.value !== '') return true;
        return false;
      })
      ?.map(data => {
        const value: ColumnFilterValue =
          data._type === FilterType.date
            ? { operator: data.operator, date: data.value }
            : { operator: data.operator, value: data.value };
        return { value, id: data?.name };
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
 * Convert field metadata to TanStack ColumnDefs. These carry filter/sort/
 * visibility capability, the filter predicate and the sort comparator. The
 * `header` falls back to `field.label` so renderers that bypass their column
 * spec still get the right default header text.
 */
export function fieldsToColumnDefs<TData extends RowData>(
  fields: DataViewField<TData>[] = []
): ColumnDef<DataViewFeatures, TData>[] {
  return fields.map(field => ({
    id: field.accessorKey,
    accessorKey: field.accessorKey,
    header: field.label,
    enableColumnFilter: field.filterable ?? false,
    enableSorting: field.sortable ?? false,
    enableHiding: field.hideable ?? false,
    filterFn: createColumnFilterFn<TData>(
      field.filterType ?? FilterType.string
    ),
    sortFn: compareValues
  }));
}

function createColumnFilterFn<TData extends RowData>(
  filterType: FilterTypes
): FilterFn<DataViewFeatures, TData> {
  return (row, columnId, filterValue: ColumnFilterValue) => {
    // A group row has no values, so a negative operator such as `neq` would
    // match it and keep the group after all its rows are filtered out.
    if (isGroupRowData(row.original)) return false;
    const predicate = getFilterFn(filterType, filterValue.operator);
    return predicate ? predicate(row, columnId, filterValue) : true;
  };
}

const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

/** Compares numbers and dates by value, and everything else as text without case, with digits in number order. */
export function compareValues<TData extends RowData>(
  rowA: DataViewRow<TData>,
  rowB: DataViewRow<TData>,
  columnId: string
): number {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return textCollator.compare(String(a ?? ''), String(b ?? ''));
}

/**
 * Bucket data into `GroupedData` entries keyed by `group_by`. When a resolver
 * is supplied for that key, the resolver runs per-row; otherwise the field is
 * accessed directly. Used in client mode only.
 *
 * Sections come out in the field's `groupOrder` where it declares one, with
 * undeclared values following in first-seen order and the null-valued bucket
 * last. See `orderBucketKeys`.
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

  // Section order: the field's declared `groupOrder` first, then undeclared
  // values in first-seen order, then the empty (null-valued) bucket last.
  for (const key of orderBucketKeys([...groupMap.keys()], field?.groupOrder)) {
    const value = groupMap.get(key) as TData[];
    groupedData.push({
      label: groupLabelsMap[key] || key,
      group_key: key,
      subRows: value,
      count: groupCountMap[key] ?? value.length,
      showGroupCount
    });
  }

  return groupedData;
}

export const GROUP_ROW_ID_PREFIX = '__group__:';

export function isGroupRowData<TData>(row: unknown): row is GroupedData<TData> {
  if (!row || typeof row !== 'object') return false;
  const candidate = row as GroupedData<TData>;
  return (
    Array.isArray(candidate.subRows) && typeof candidate.group_key === 'string'
  );
}

/**
 * Keys group buckets by `group_key` so their ids can't collide with data row
 * ids. Leaves delegate to `getRowId`, falling back to TanStack's positional
 * default (which supplying any resolver would otherwise replace).
 */
export function createRowIdResolver<TData extends RowData>(
  getRowId?: (row: TData, index: number) => string
) {
  return (row: TData, index: number, parent?: DataViewRow<TData>): string => {
    if (isGroupRowData<TData>(row)) {
      return `${GROUP_ROW_ID_PREFIX}${row.group_key}`;
    }
    if (getRowId) return getRowId(row, index);
    return parent ? `${parent.id}.${index}` : String(index);
  };
}

const generateFilterMap = (
  filters: InternalFilter[] = []
): Map<string, DataViewFilterValue> => {
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

/** Compares two wire queries by value, so a JSON copy matches its source. */
export const isSameQuery = (a?: DataViewQuery, b?: DataViewQuery): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

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
        if (data._type === FilterType.date)
          return toDayKey(data.value) !== null;
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

/** Leaf count from the row tree. Kept recursive so it stays correct for the grouped tree, where `flatRows` also counts group rows. */
export function countLeafRows<TData extends RowData>(
  rows: DataViewRow<TData>[]
): number {
  return rows.reduce(
    (n, row) => n + (row.subRows?.length ? countLeafRows(row.subRows) : 1),
    0
  );
}

/** Difference between pre- and post-filter leaf rows (client mode only). */
export function getClientHiddenLeafRowCount<TData extends RowData>(
  table: DataViewTable<TData>
): number {
  const pre = table.getPreFilteredRowModel();
  const post = table.getFilteredRowModel();
  return Math.max(0, countLeafRows(pre.rows) - countLeafRows(post.rows));
}

export function hasActiveTableFiltering<TData extends RowData>(
  table: DataViewTable<TData>
): boolean {
  const { state } = table;
  if (state.columnFilters?.length > 0) return true;
  const gf = state.globalFilter;
  if (gf === undefined || gf === null) return false;
  return String(gf).trim() !== '';
}

export function getDefaultTableQuery(
  defaultSort: DataViewSort,
  oldQuery: DataViewQuery = {},
  fields: Pick<
    DataViewField,
    'accessorKey' | 'filterType' | 'filterOperations'
  >[] = []
): InternalQuery {
  const internalQuery = dataViewQueryToInternal(oldQuery);
  return {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
    ...internalQuery,
    ...(internalQuery.filters && {
      filters: dropDisallowedFilters(
        withDateFilterTypes(internalQuery.filters, fields),
        fields
      )
    })
  };
}
