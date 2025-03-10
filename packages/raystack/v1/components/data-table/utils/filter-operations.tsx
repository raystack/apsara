import type { FilterFn } from "@tanstack/table-core";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import {
  DateFilterOperatorType,
  FilterOperatorTypes,
  FilterValue,
  NumberFilterOperatorType,
  SelectFilterOperatorType,
  TextFilterOperatorType,
} from "~/v1/types/filters";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export type FilterFunctionsMap = {
  number: Record<NumberFilterOperatorType, FilterFn<any>>;
  text: Record<TextFilterOperatorType, FilterFn<any>>;
  date: Record<DateFilterOperatorType, FilterFn<any>>;
  select: Record<SelectFilterOperatorType, FilterFn<any>>;
};

export const filterOperationsMap: FilterFunctionsMap = {
  number: {
    eq: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) === Number(filterValue.value);
    },
    neq: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) !== Number(filterValue.value);
    },
    lt: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) < Number(filterValue.value);
    },
    lte: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) <= Number(filterValue.value);
    },
    gt: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) > Number(filterValue.value);
    },
    gte: (row, columnId, filterValue: FilterValue) => {
      return Number(row.getValue(columnId)) >= Number(filterValue.value);
    },
  },
  text: {
    eq: (row, columnId, filterValue: FilterValue) => {
      return (
        String(row.getValue(columnId)).toLowerCase() ===
        String(filterValue.value).toLowerCase()
      );
    },
    neq: (row, columnId, filterValue: FilterValue) => {
      return (
        String(row.getValue(columnId)).toLowerCase() !==
        String(filterValue.value).toLowerCase()
      );
    },
    like: (row, columnId, filterValue: FilterValue) => {
      const columnValue = (row.getValue(columnId) as string).toLowerCase();
      const filterStr = (filterValue.value as string).toLowerCase();
      return columnValue.includes(filterStr);
    },
  },
  date: {
    eq: (row, columnId, filterValue: FilterValue) => {
      return dayjs(row.getValue(columnId)).isSame(
        dayjs(filterValue.date),
        "day"
      );
    },
    neq: (row, columnId, filterValue: FilterValue) => {
      return !dayjs(row.getValue(columnId)).isSame(
        dayjs(filterValue.date),
        "day"
      );
    },
    lt: (row, columnId, filterValue: FilterValue) => {
      return dayjs(row.getValue(columnId)).isBefore(
        dayjs(filterValue.date),
        "day"
      );
    },
    lte: (row, columnId, filterValue: FilterValue) => {
      return dayjs(row.getValue(columnId)).isSameOrBefore(
        dayjs(filterValue.date),
        "day"
      );
    },
    gt: (row, columnId, filterValue: FilterValue) => {
      return dayjs(row.getValue(columnId)).isAfter(
        dayjs(filterValue.date),
        "day"
      );
    },
    gte: (row, columnId, filterValue: FilterValue) => {
      return dayjs(row.getValue(columnId)).isSameOrAfter(
        dayjs(filterValue.date),
        "day"
      );
    },
  },
  select: {
    eq: (row, columnId, filterValue: FilterValue) => {
      // Select only supports string values
      return String(row.getValue(columnId)) === String(filterValue.value);
    },
    neq: (row, columnId, filterValue: FilterValue) => {
      // Select only supports string values
      return String(row.getValue(columnId)) !== String(filterValue.value);
    },
  },
} as const;

export function getFilterFn<T extends keyof FilterFunctionsMap>(
  type: T,
  operator: FilterOperatorTypes
) {
  // @ts-expect-error FilterOperatorTypes is union of all possible operators
  return filterOperationsMap[type][operator];
}
