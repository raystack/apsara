import { TableState } from "@tanstack/table-core";
import {
  SortOrders,
  DataTableFilter,
  DataTableColumnDef,
  GroupedData,
  Sort,
  DataTableQuery,
} from "../data-table.types";
import { FilterType } from "~/v1/types/filters";
import { getFilterFn } from "./filter-operations";

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
    id: data?.key,
    desc: data?.order === SortOrders.DESC,
  }));
  return {
    columnFilters: columnFilters,
    sorting: sorting,
    globalFilter: query.search,
  };
}

export const defaultGroupOption = {
  id: "--",
  label: "No grouping",
};

export function getColumnsWithFilterFn<TData, TValue>(
  columns: DataTableColumnDef<TData, TValue>[] = [],
  filters: DataTableFilter[] = []
): DataTableColumnDef<TData, TValue>[] {
  return columns.map((column) => {
    const colFilter = filters?.find(
      (filter) => filter.name === column.accessorKey
    );
    const filterFn = colFilter?.operator
      ? getFilterFn(column.columnType, colFilter.operator)
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
  const groupOrdering = columnDef?.groupOrdering || [];
  const showGroupCount = columnDef?.showGroupCount || false;

  const groupOrderMap = groupOrdering.reduce(
    (acc: Record<string, number>, item: string, index: number) => {
      acc[item] = index || 0;
      return acc;
    },
    {}
  );

  return Object.entries(group_by_map)
    .map(([key, value]) => ({
      group_key: key,
      subRows: value,
      count: columnDef?.groupCountMap?.[key] ?? value.length,
      showGroupCount,
    }))
    .sort((a, b) => groupOrderMap[a.group_key] - groupOrderMap[b.group_key]);
}

const generateFilterMap = (
  filters: DataTableFilter[] = []
): Map<string, any> => {
  return new Map(
    filters
      ?.filter((fil) => fil.value !== "")
      .map(({ name, operator, value }) => [`${name}-${operator}`, value])
  );
};

const generateSortMap = (sort: Sort[] = []): Map<string, string> => {
  return new Map(sort.map(({ key, order }) => [key, order]));
};

const isFilterChanged = (
  oldFilters: DataTableFilter[] = [],
  newFilters: DataTableFilter[] = []
): boolean => {
  if (oldFilters.length !== newFilters.length) return true;

  const oldFilterMap = generateFilterMap(oldFilters);
  const newFilterMap = generateFilterMap(newFilters);

  return [...newFilterMap].some(
    ([key, value]) => oldFilterMap.get(key) !== value
  );
};

const isSortChanged = (oldSort: Sort[] = [], newSort: Sort[] = []): boolean => {
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
  const { group_by, ...rest } = query;
  const sanitizedGroupBy = group_by?.filter(
    (key) => key !== defaultGroupOption.id
  );
  const sanitizedFilters =
    query.filters?.filter((data) => data.value !== "") || [];
  return { ...rest, group_by: sanitizedGroupBy, filters: sanitizedFilters };
}

export function getDefaultTableQuery(
  defaultSort: Sort,
  oldQuery: DataTableQuery = {}
): DataTableQuery {
  return {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
    ...oldQuery,
  };
}
