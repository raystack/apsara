import { FilterFn } from "@tanstack/table-core";
import { columnTypes, columnTypesMap, FilterValue } from "./datatables.types";

export interface FilterOperation {
  label: string;
  value: string;
  fn?: FilterFn<FilterValue>;
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
    { label: "is", value: "is" },
    { label: "is not", value: "is not" },
    { label: "contains", value: "contains" },
    { label: "does not contains", value: "does not contains" },
    { label: "starts with", value: "starts with" },
    { label: "ends with", value: "ends with" },
    { label: "is empty", value: "is empty" },
    { label: "is not empty", value: "is not empty" },
  ],
};
