import type { FilterFn } from "@tanstack/table-core";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const FilterType = {
  number: "number",
  text: "text",
  datetime: "datetime",
  select: "select",
} as const;

export interface FilterValue {
  value?: string | number | boolean;
  // values?: Array<string | number>;
  date?: Date;
  // dateRange?: DateRange;
}

export type FilterOperation = {
  value: string;
  label: string;
  fn: FilterFn<FilterValue>;
};

type FilterOperationsMap = {
  [key in keyof typeof FilterType]: FilterOperation[];
};

export const filterOperationsMap: FilterOperationsMap = {
  number: [
    {
      value: "eq",
      label: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) === Number(filterValue.value);
      },
    },
    {
      value: "neq",
      label: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) !== Number(filterValue.value);
      },
    },
    {
      value: "lt",
      label: "less than",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) < Number(filterValue.value);
      },
    },
    {
      value: "lte",
      label: "less than or equal",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) <= Number(filterValue.value);
      },
    },
    {
      value: "gt",
      label: "greater than",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) > Number(filterValue.value);
      },
    },
    {
      value: "gte",
      label: "greater than or equal",
      fn: (row, columnId, filterValue: FilterValue) => {
        return Number(row.getValue(columnId)) >= Number(filterValue.value);
      },
    },
  ],
  text: [
    {
      value: "eq",
      label: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return String(row.getValue(columnId)) === String(filterValue.value);
      },
    },
    {
      value: "neq",
      label: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return String(row.getValue(columnId)) !== String(filterValue.value);
      },
    },
    {
      value: "like",
      label: "contains",
      fn: (row, columnId, filterValue: FilterValue) => {
        const columnValue = (row.getValue(columnId) as string).toLowerCase();
        const filterStr = (filterValue.value as string).toLowerCase();
        return columnValue.includes(filterStr);
      },
    },
  ],
  datetime: [
    {
      value: "eq",
      label: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isSame(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      value: "neq",
      label: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return !dayjs(row.getValue(columnId)).isSame(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      value: "lt",
      label: "is before",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isBefore(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      value: "lte",
      label: "is on or before",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isSameOrBefore(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      value: "gt",
      label: "is after",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isAfter(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
    {
      value: "gte",
      label: "is on or after",
      fn: (row, columnId, filterValue: FilterValue) => {
        return dayjs(row.getValue(columnId)).isSameOrAfter(
          dayjs(filterValue.date),
          "day"
        );
      },
    },
  ],
  select: [
    {
      value: "eq",
      label: "is",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) === filterValue.value;
      },
    },
    {
      value: "neq",
      label: "is not",
      fn: (row, columnId, filterValue: FilterValue) => {
        return row.getValue(columnId) !== filterValue.value;
      },
    },
  ],
} as const;

export type FilterTypes = keyof typeof FilterType;

export type Filter = {
  type: FilterTypes;
  filterOperation: string;
  value: string;
};

export interface FilterSelectOption {
  value: any;
  label: string;
}
