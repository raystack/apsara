import { Column, FilterFn, TableState } from "@tanstack/table-core";
import {
  DataTableState,
  SortOrders,
  DataTableFilter,
  DataTableColumnDef,
} from "../data-table.types";
import { filterOperationsMap } from "~/v1/types/filters";

export function dataTableStateToReactTableState(
  dts: DataTableState
): Partial<TableState> {
  const columnFilters = dts.filters?.map((data) => ({
    value: { value: data.value },
    id: data?.name,
  }));

  const sorting = dts.sort?.map((data) => ({
    id: data?.key,
    desc: data?.order === SortOrders.DESC,
  }));
  return {
    columnFilters: columnFilters,
    sorting: sorting,
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
