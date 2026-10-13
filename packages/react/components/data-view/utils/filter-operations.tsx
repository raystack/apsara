import type { FilterFn } from '@tanstack/table-core';

import { dateFilterFns, toDayKey } from '~/shared/date-filters';
import {
  DataTableFilterOperatorTypes,
  DateFilterOperatorType,
  EmptyFilterValue,
  FilterDataType,
  FilterOperatorTypes,
  FilterType,
  FilterTypes,
  FilterValue,
  MultiSelectFilterOperatorType,
  NumberFilterOperatorType,
  SelectFilterOperatorType,
  StringFilterOperatorType
} from '~/types/filters';
import type {
  DataViewFilterValue,
  DataViewFilterValues
} from '../data-view.types';

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
  date: dateFilterFns,
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

const toStringValue = (value: DataViewFilterValue) =>
  value == null ? undefined : typeof value === 'string' ? value : String(value);

const handleStringBasedTypes = (
  filterType: FilterTypes,
  value: DataViewFilterValue,
  operator?: FilterOperatorTypes | DataTableFilterOperatorTypes
): DataViewFilterValues => {
  switch (filterType) {
    case FilterType.date: {
      const day = toDayKey(value);
      return { value, stringValue: day ?? '' };
    }
    case FilterType.select:
      return {
        stringValue: value === EmptyFilterValue ? '' : toStringValue(value),
        value
      };
    case FilterType.multiselect:
      return {
        value,
        stringValue: (Array.isArray(value) ? value : [])
          .map(v => (v === EmptyFilterValue ? '' : v))
          .join()
      };
    case FilterType.string: {
      const text = toStringValue(value) ?? '';
      let processedValue = toStringValue(value);
      if (operator === 'contains') processedValue = `%${text}%`;
      else if (operator === 'starts_with') processedValue = `${text}%`;
      else if (operator === 'ends_with') processedValue = `%${text}`;
      else if (operator === 'ilike') {
        if (!text.includes('%')) processedValue = `%${text}%`;
      }
      return { stringValue: processedValue, value };
    }
    default:
      return { stringValue: toStringValue(value), value };
  }
};

export const getFilterOperator = ({
  value,
  filterType,
  operator
}: {
  value: DataViewFilterValue;
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
  value: DataViewFilterValue;
  dataType?: FilterDataType;
  filterType?: FilterTypes;
  operator?: FilterOperatorTypes | DataTableFilterOperatorTypes;
}): DataViewFilterValues => {
  if (dataType === 'boolean') return { boolValue: value as boolean, value };
  if (dataType === 'number') return { numberValue: value as number, value };
  return handleStringBasedTypes(filterType, value, operator);
};

export const getDataType = ({
  filterType = FilterType.string,
  dataType = 'string'
}: {
  dataType?: FilterDataType;
  filterType?: FilterTypes;
}): FilterDataType => {
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
