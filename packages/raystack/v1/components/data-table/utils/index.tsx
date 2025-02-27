import { TableState } from "@tanstack/table-core";
import {
  DataTableState,
  SortOrders,
  DataTableFilter,
  DataTableColumnDef,
  GroupedData,
} from "../data-table.types";
import { filterOperationsMap } from "~/v1/types/filters";

export function dataTableStateToReactTableState(
  dts: DataTableState
): Partial<TableState> {
  const columnFilters =
    dts.filters?.map((data) => ({
      value: { value: data.value },
      id: data?.name,
    })) || [];

  const sorting = dts.sort?.map((data) => ({
    id: data?.key,
    desc: data?.order === SortOrders.DESC,
  }));
  return {
    columnFilters: columnFilters,
    sorting: sorting,
    globalFilter: dts.search,
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
    const filterFn = filterOperationsMap[column.columnType]?.find(
      (operation) => operation.value === colFilter?.operator
    )?.fn;
    return {
      ...column,
      filterFn,
    };
  });
}

type GroupedDataMap<T> = Record<string, T[]>;

export function groupData<TData>(
  data: TData[],
  group_by?: string
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
  return Object.entries(group_by_map).map(([key, value]) => ({
    group_key: key,
    subRows: value,
  }));
}

export function getLoaderRows<TData>(rowCount: number): TData[] {
  return Array.from({ length: rowCount }).map(
    (_, i) =>
      ({
        id: "loading-row-" + i,
      } as TData)
  );
}
