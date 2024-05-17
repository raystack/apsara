import { FilterFn } from "@tanstack/table-core";
import { columnTypes, columnTypesMap, FilterValue } from "./datatables.types";

export interface FilterOperation {
  label: string;
  value: string;
  fn?: FilterFn<FilterValue>;
  hideValueField?: boolean;
}

export const operationsOptions: Record<columnTypes, Array<FilterOperation>> = {
  [columnTypesMap.select]: [
    {
      label: "is",
      value: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) === filterValue.value;
      },
    },
    {
      label: "is not",
      value: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) !== filterValue.value;
      },
    },
  ],
  [columnTypesMap.number]: [
    {
      label: "=",
      value: "=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) === Number(filterValue.value);
      },
    },
    {
      label: "!=",
      value: "!=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) !== Number(filterValue.value);
      },
    },
    {
      label: ">",
      value: ">",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) > Number(filterValue.value);
      },
    },
    {
      label: ">=",
      value: ">=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) >= Number(filterValue.value);
      },
    },
    {
      label: "<",
      value: "<",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) < Number(filterValue.value);
      },
    },
    {
      label: "<=",
      value: "<=",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) <= Number(filterValue.value);
      },
    },
  ],
  [columnTypesMap.text]: [
    {
      label: "is",
      value: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) === filterValue.value;
      },
    },
    {
      label: "is not",
      value: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) !== filterValue.value;
      },
    },
    {
      label: "contains",
      value: "contains",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (row.getValue(columnId) as string).includes(
          filterValue.value as string
        );
      },
    },
    {
      label: "does not contains",
      value: "does not contains",
      fn: (row, columnId, filterValue: FilterValue) => {
        return !(row.getValue(columnId) as string).includes(
          filterValue.value as string
        );
      },
    },
    {
      label: "starts with",
      value: "starts with",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (row.getValue(columnId) as string).startsWith(
          filterValue.value as string
        );
      },
    },
    {
      label: "ends with",
      value: "ends with",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (row.getValue(columnId) as string).endsWith(
          filterValue.value as string
        );
      },
    },
    {
      label: "is empty",
      value: "is empty",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (row.getValue(columnId) as string).length === 0;
      },
      hideValueField: true,
    },
    {
      label: "is not empty",
      value: "is not empty",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (row.getValue(columnId) as string).length > 0;
      },
      hideValueField: true,
    },
  ],
};
