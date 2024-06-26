import { FilterFn } from "@tanstack/table-core";
import {
  columnTypes,
  columnTypesMap,
  FilterValue,
  filterValueType,
} from "./datatables.types";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export interface FilterOperation {
  label: string;
  value: string;
  fn?: FilterFn<FilterValue>;
  hideValueField?: boolean;
  component?: filterValueType;
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
      label: "contains",
      value: "contains",
      fn: (row, columnId, filterValue: FilterValue) => {
        const columnValue = (row.getValue(columnId) as string).toLowerCase();
        const filterStr = (filterValue.value as string).toLowerCase();
        return columnValue.includes(filterStr);
      },
    },
    {
      label: "does not contains",
      value: "does not contains",
      fn: (row, columnId, filterValue: FilterValue) => {
        const columnValue = (row.getValue(columnId) as string).toLowerCase();
        const filterStr = (filterValue.value as string).toLowerCase();
        return !columnValue.includes(filterStr);
      },
    },
    {
      label: "starts with",
      value: "starts with",
      fn: (row, columnId, filterValue: FilterValue) => {
        const columnValue = (row.getValue(columnId) as string).toLowerCase();
        const filterStr = (filterValue.value as string).toLowerCase();
        return columnValue.startsWith(filterStr);
      },
    },
    {
      label: "ends with",
      value: "ends with",
      fn: (row, columnId, filterValue: FilterValue) => {
        const columnValue = (row.getValue(columnId) as string).toLowerCase();
        const filterStr = (filterValue.value as string).toLowerCase();
        return columnValue.endsWith(filterStr);
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
  [columnTypesMap.date]: [
    {
      label: "is",
      value: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isSame(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      label: "is before",
      value: "is before",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isBefore(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      label: "is after",
      value: "is after",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isAfter(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      label: "is between",
      value: "is between",
      fn: (row, columnId, filterValue: FilterValue) => {
        return (
          dayjs(row.getValue(columnId)).isSameOrAfter(
            dayjs(filterValue.dateRange?.from),
            "day"
          ) &&
          dayjs(row.getValue(columnId)).isSameOrBefore(
            dayjs(filterValue.dateRange?.to),
            "day"
          )
        );
      },
      component: "rangePicker",
    },
  ],
};
