import { TableState } from "@tanstack/table-core";
import {
  SortOrders,
  DataTableColumnDef,
  GroupedData,
  DataTableSort,
  DataTableQuery,
  RQLFilter,
  defaultGroupOption,
} from "../data-table.types";
import { FilterType } from "~/v1/types/filters";
import { getFilterFn, getFilterValue } from "./filter-operations";

export function queryToTableState(query: DataTableQuery): Partial<TableState> {
  const columnFilters =
    query.filters
      ?.filter((data) => data.value !== "")
      ?.map((data) => {
        const valueObject =
          data._type === FilterType.date
            ? { date: data.value }
            : { value: data.value };
        return {
          value: valueObject,
          id: data?.name,
        };
      }) || [];

  const sorting = query.sort?.map((data) => ({
    id: data?.name,
    desc: data?.order === SortOrders.DESC,
  }));
  return {
    columnFilters: columnFilters,
    sorting: sorting,
    globalFilter: query.search,
  };
}

export function getColumnsWithFilterFn<TData, TValue>(
  columns: DataTableColumnDef<TData, TValue>[] = [],
  filters: RQLFilter[] = []
): DataTableColumnDef<TData, TValue>[] {
  return columns.map((column) => {
    const colFilter = filters?.find(
      (filter) => filter.name === column.accessorKey
    );
    const filterFn = colFilter?.operator
      ? getFilterFn(column.filterType || FilterType.string, colFilter.operator)
      : undefined;

    return {
      ...column,
      filterFn,
    };
  });
}

type GroupedDataMap<T> = Record<string, T[]>;

export function groupData<TData>(
  data: TData[],
  group_by?: string,
  columns: DataTableColumnDef<TData, any>[] = []
): GroupedData<TData>[] {
  if (!data) return [];
  if (!group_by || group_by === defaultGroupOption.id)
    return data as GroupedData<TData>[];
  const group_by_map = data.reduce(
    (acc: GroupedDataMap<TData>, currentData: TData) => {
      const item = currentData as Record<string, string>;
      const keyValue = item[group_by];
      acc[keyValue] = acc[keyValue] || [];
      acc[keyValue].push(item as TData);
      return acc;
    },
    {} as GroupedDataMap<TData>
  );

  const columnDef = columns.find((col) => col.accessorKey === group_by);
  const sortOrder = columnDef?.groupSortOrder || SortOrders.ASC;
  const showGroupCount = columnDef?.showGroupCount || false;

  return Object.entries(group_by_map)
    .map(([key, value]) => ({
      group_key: key,
      subRows: value,
      count: columnDef?.groupCountMap?.[key] ?? value.length,
      showGroupCount,
    }))
    .sort((a, b) => {
      const sortValue = sortOrder === SortOrders.ASC ? 1 : -1;
      return a.group_key.localeCompare(b.group_key) * sortValue;
    });
}

const generateFilterMap = (filters: RQLFilter[] = []): Map<string, any> => {
  return new Map(
    filters
      ?.filter((data) => data._type === FilterType.select || data.value !== "")
      .map(({ name, operator, value }) => [`${name}-${operator}`, value])
  );
};

const generateSortMap = (sort: DataTableSort[] = []): Map<string, string> => {
  return new Map(sort.map(({ name, order }) => [name, order]));
};

const isFilterChanged = (
  oldFilters: RQLFilter[] = [],
  newFilters: RQLFilter[] = []
): boolean => {
  const oldFilterMap = generateFilterMap(oldFilters);
  const newFilterMap = generateFilterMap(newFilters);

  if (oldFilterMap.size !== newFilterMap.size) return true;

  return [...newFilterMap].some(
    ([key, value]) => oldFilterMap.get(key) !== value
  );
};

const isSortChanged = (
  oldSort: DataTableSort[] = [],
  newSort: DataTableSort[] = []
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
  return newGroupBy.some((item) => !oldGroupSet.has(item));
};

const isSearchChanged = (oldSearch?: string, newSearch?: string): boolean => {
  return oldSearch !== newSearch;
};

export const hasQueryChanged = (
  oldQuery: DataTableQuery | null,
  newQuery: DataTableQuery
): boolean => {
  if (!oldQuery) return true;
  return (
    isFilterChanged(oldQuery.filters, newQuery.filters) ||
    isSortChanged(oldQuery.sort, newQuery.sort) ||
    isGroupChanged(oldQuery.group_by, newQuery.group_by) ||
    isSearchChanged(oldQuery.search, newQuery.search)
  );
};

export function getInitialColumnVisibility<TData, TValue>(
  columns: DataTableColumnDef<TData, TValue>[] = []
): Record<string, boolean> | {} {
  return columns.reduce((acc, col) => {
    return {
      ...acc,
      [col.accessorKey]: col.defaultHidden ? false : true,
    };
  }, {});
}

export function sanitizeTableQuery(query: DataTableQuery): DataTableQuery {
  const {
    group_by = [],
    filters = [],
    sort = [],
    __group_by_sort = SortOrders.ASC,
    ...rest
  } = query;
  const sanitizedGroupBy = group_by?.filter(
    (key) => key !== defaultGroupOption.id
  );

  const sanitizedFilters =
    filters
      ?.filter((data) => data._type === FilterType.select || data.value !== "")
      ?.map((data) => ({
        name: data.name,
        operator: data.operator,
        ...getFilterValue({
          value: data.value,
          filterType: data._type,
          dataType: data._dataType,
        }),
      })) || [];

  const sortWithGroupBy = sanitizedGroupBy?.[0]
    ? [{ name: group_by[0], order: __group_by_sort }, ...sort]
    : sort;
  return {
    ...rest,
    sort: sortWithGroupBy,
    group_by: sanitizedGroupBy,
    filters: sanitizedFilters,
  };
}

export function getDefaultTableQuery(
  defaultSort: DataTableSort,
  oldQuery: DataTableQuery = {}
): DataTableQuery {
  return {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
    ...oldQuery,
  };
}
