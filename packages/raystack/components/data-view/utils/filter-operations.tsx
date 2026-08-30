import type { FilterFn } from '@tanstack/table-core';
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
import {
  isAfterDay,
  isBeforeDay,
  isSameDay,
  toDateLoose
} from '../../calendar-preview/date-adapter';
import { DataViewFilterValues } from '../data-view.types';

/*
 * Date comparisons go through the calendar adapter, which is the one place
 * that registers dayjs plugins. Extending them here as well made the module
 * order-dependent — the failure class behind the 0.49.0 P0.
 *
 * A row value that will not parse compares false against every operator,
 * which is what an unfilterable cell should do.
 */
const compare = (
  a: unknown,
  b: unknown,
  predicate: (left: Date, right: Date) => boolean
) => {
  const left = toDateLoose(a);
  const right = toDateLoose(b);
  return left && right ? predicate(left, right) : false;
};

export type FilterFunctionsMap = {
  number: Record<NumberFilterOperatorType, FilterFn<unknown>>;
  string: Record<StringFilterOperatorType, FilterFn<unknown>>;
  date: Record<DateFilterOperatorType, FilterFn<unknown>>;
  select: Record<SelectFilterOperatorType, FilterFn<unknown>>;
  multiselect: Record<MultiSelectFilterOperatorType, FilterFn<unknown>>;
};

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
    eq: (row, columnId, filterValue: FilterValue) =>
      compare(row.getValue(columnId), filterValue.date, isSameDay),
    neq: (row, columnId, filterValue: FilterValue) =>
      !compare(row.getValue(columnId), filterValue.date, isSameDay),
    lt: (row, columnId, filterValue: FilterValue) =>
      compare(row.getValue(columnId), filterValue.date, isBeforeDay),
    lte: (row, columnId, filterValue: FilterValue) =>
      compare(
        row.getValue(columnId),
        filterValue.date,
        (a, b) => !isAfterDay(a, b)
      ),
    gt: (row, columnId, filterValue: FilterValue) =>
      compare(row.getValue(columnId), filterValue.date, isAfterDay),
    gte: (row, columnId, filterValue: FilterValue) =>
      compare(
        row.getValue(columnId),
        filterValue.date,
        (a, b) => !isBeforeDay(a, b)
      )
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
      const dateValue = toDateLoose(value);
      let stringValue = '';
      if (dateValue) {
        try {
          stringValue = dateValue.toISOString();
        } catch {
          stringValue = '';
        }
      }
      return { value, stringValue };
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
