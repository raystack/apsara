import type { FilterFn } from '@tanstack/table-core';

import {
  type DayKey,
  toDayKey,
  toInstant
} from '~/components/calendar-preview/date-adapter';
import { type Period, periodOf } from '~/components/calendar-preview/lib/scale';
import {
  DataTableFilterOperatorTypes,
  DateFilterOperatorType,
  EmptyFilterValue,
  FilterOperatorTypes,
  FilterType,
  FilterTypes,
  FilterValue,
  FilterValueType,
  MultiSelectFilterOperatorType,
  NumberFilterOperatorType,
  SelectFilterOperatorType,
  StringFilterOperatorType
} from '~/types/filters';
import { DataViewFilterValues } from '../data-view.types';

export type FilterFunctionsMap = {
  number: Record<NumberFilterOperatorType, FilterFn<unknown>>;
  string: Record<StringFilterOperatorType, FilterFn<unknown>>;
  date: Record<DateFilterOperatorType, FilterFn<unknown>>;
  select: Record<SelectFilterOperatorType, FilterFn<unknown>>;
  multiselect: Record<MultiSelectFilterOperatorType, FilterFn<unknown>>;
};

/* A day value filters on its day; a coarser one filters on the whole period it
   names, so a month cannot compare as a single day. `trailingValue` never
   reaches here: the period is derived from whichever edge was stored, so both
   anchors resolve to the same span. */
function periodFor(value: FilterValue['date']): Period | null {
  if (value == null) return null;
  if (
    typeof value === 'object' &&
    !(value instanceof Date) &&
    'scale' in value
  ) {
    const anchor = toDayKey(value.date);
    return anchor ? periodOf(anchor, value.scale) : null;
  }
  const day = toDayKey(value);
  return day ? { start: day, end: day } : null;
}

/* An unreadable row or filter matches nothing, and `neq` negates that, so
   `whenUnreadable` keeps a bad value from matching every row instead. */
function onPeriod(
  test: (day: DayKey, period: Period) => boolean,
  whenUnreadable = false
): FilterFn<unknown> {
  return (row, columnId, filterValue: FilterValue) => {
    const period = periodFor(filterValue.date);
    const day = toDayKey(row.getValue(columnId));
    if (!period || !day) return whenUnreadable;
    return test(day, period);
  };
}

export const filterOperationsMap: FilterFunctionsMap = {
  number: {
    eq: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) === Number(filterValue.value),
    neq: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) !== Number(filterValue.value),
    lt: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) < Number(filterValue.value),
    lte: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) <= Number(filterValue.value),
    gt: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) > Number(filterValue.value),
    gte: (row, columnId, filterValue: FilterValue) =>
      Number(row.getValue(columnId)) >= Number(filterValue.value)
  },
  string: {
    eq: (row, columnId, filterValue: FilterValue) =>
      String(row.getValue(columnId)).toLowerCase() ===
      String(filterValue.value).toLowerCase(),
    neq: (row, columnId, filterValue: FilterValue) =>
      String(row.getValue(columnId)).toLowerCase() !==
      String(filterValue.value).toLowerCase(),
    contains: (row, columnId, filterValue: FilterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.includes(filterStr);
    },
    starts_with: (row, columnId, filterValue: FilterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.startsWith(filterStr);
    },
    ends_with: (row, columnId, filterValue: FilterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.endsWith(filterStr);
    }
  },
  date: {
    eq: onPeriod((day, period) => day >= period.start && day <= period.end),
    neq: onPeriod(
      (day, period) => day < period.start || day > period.end,
      true
    ),
    lt: onPeriod((day, period) => day < period.start),
    lte: onPeriod((day, period) => day <= period.end),
    gt: onPeriod((day, period) => day > period.end),
    gte: onPeriod((day, period) => day >= period.start)
  },
  select: {
    eq: (row, columnId, filterValue: FilterValue) => {
      if (String(filterValue.value) === EmptyFilterValue)
        return row.getValue(columnId) === '';
      return String(row.getValue(columnId)) === String(filterValue.value);
    },
    neq: (row, columnId, filterValue: FilterValue) => {
      if (String(filterValue.value) === EmptyFilterValue)
        return row.getValue(columnId) !== '';
      return String(row.getValue(columnId)) !== String(filterValue.value);
    }
  },
  multiselect: {
    in: (row, columnId, filterValue: FilterValue) => {
      if (!Array.isArray(filterValue.value)) return false;
      return filterValue.value
        .map(value => (value === EmptyFilterValue ? '' : String(value)))
        .includes(String(row.getValue(columnId)));
    },
    notin: (row, columnId, filterValue: FilterValue) => {
      if (!Array.isArray(filterValue.value)) return false;
      return !filterValue.value
        .map(value => (value === EmptyFilterValue ? '' : String(value)))
        .includes(String(row.getValue(columnId)));
    }
  }
} as const;

export function getFilterFn<T extends keyof FilterFunctionsMap>(
  type: T,
  operator: FilterOperatorTypes
) {
  // @ts-expect-error FilterOperatorTypes is a union of all possible operators
  return filterOperationsMap[type][operator];
}

const handleStringBasedTypes = (
  filterType: FilterTypes,
  value: any,
  operator?: FilterOperatorTypes | DataTableFilterOperatorTypes
): DataViewFilterValues => {
  switch (filterType) {
    case FilterType.date: {
      const anchor =
        value && typeof value === 'object' && 'scale' in value
          ? value.date
          : value;
      return { value, stringValue: toInstant(anchor)?.toISOString() ?? '' };
    }
    case FilterType.select:
      return {
        stringValue: value === EmptyFilterValue ? '' : value,
        value
      };
    case FilterType.multiselect:
      return {
        value,
        stringValue: value
          .map((v: any) => (v === EmptyFilterValue ? '' : String(v)))
          .join()
      };
    case FilterType.string: {
      let processedValue = value;
      if (operator === 'contains') processedValue = `%${value}%`;
      else if (operator === 'starts_with') processedValue = `${value}%`;
      else if (operator === 'ends_with') processedValue = `%${value}`;
      else if (operator === 'ilike') {
        if (!value.includes('%')) processedValue = `%${value}%`;
      }
      return { stringValue: processedValue, value };
    }
    default:
      return { stringValue: value, value };
  }
};

export const getFilterOperator = ({
  value,
  filterType,
  operator
}: {
  value: any;
  filterType?: FilterTypes;
  operator: FilterOperatorTypes;
}): DataTableFilterOperatorTypes => {
  if (value === EmptyFilterValue && filterType === FilterType.select)
    return 'empty';
  if (
    filterType === FilterType.string &&
    (operator === 'contains' ||
      operator === 'starts_with' ||
      operator === 'ends_with')
  ) {
    return 'ilike';
  }
  return operator as DataTableFilterOperatorTypes;
};

export const getFilterValue = ({
  value,
  dataType = 'string',
  filterType = FilterType.string,
  operator
}: {
  value: any;
  dataType?: FilterValueType;
  filterType?: FilterTypes;
  operator?: FilterOperatorTypes | DataTableFilterOperatorTypes;
}): DataViewFilterValues => {
  if (dataType === 'boolean') return { boolValue: value, value };
  if (dataType === 'number') return { numberValue: value, value };
  return handleStringBasedTypes(filterType, value, operator);
};

export const getDataType = ({
  filterType = FilterType.string,
  dataType = 'string'
}: {
  dataType?: FilterValueType;
  filterType?: FilterTypes;
}): FilterValueType => {
  switch (filterType) {
    case FilterType.multiselect:
    case FilterType.select:
      return dataType;
    case FilterType.date:
      return 'string';
    default:
      return filterType;
  }
};
