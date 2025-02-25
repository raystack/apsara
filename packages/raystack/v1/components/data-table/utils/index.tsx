import { TableState } from "@tanstack/table-core";
import { DataTableState, SortOrders } from "../data-table.types";

export function dataTableStateToReactTableState(
  dts: DataTableState
): Partial<TableState> {
  const columnFilters = dts.filters?.map((data) => ({
    value: data.value,
    id: data?.name,
  }));

  const sorting = dts.sort?.map((data) => ({
    id: data?.key,
    desc: data?.order === SortOrders.DESC,
  }));
  return {
    columnFilters: columnFilters,
    sorting: sorting,
    grouping: dts.group_by,
  };
}

export const defaultGroupOption = {
  id: "--",
  label: "No grouping",
};
