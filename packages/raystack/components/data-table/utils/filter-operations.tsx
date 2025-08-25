import type { FilterFn } from '@tanstack/table-core';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {
  DateFilterOperatorType,
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
import { EmptyFilterValue, RQLFilterValues } from '../data-table.types';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export type FilterFunctionsMap = {
  number: Record<NumberFilterOperatorType, FilterFn<unknown>>;
  string: Record<StringFilterOperatorType, FilterFn<unknown>>;
  date: Record<DateFilterOperatorType, FilterFn<unknown>>;
  select: Record<SelectFilterOperatorType, FilterFn<unknown>>;
  multiselect: Record<MultiSelectFilterOperatorType, FilterFn<unknown>>;
};

export const filterOperationsMap: FilterFunctionsMap = {
  number: {
    eq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) === Number(filterValue.value);
    },
    neq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) !== Number(filterValue.value);
    },
    lt: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) < Number(filterValue.value);
    },
    lte: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) <= Number(filterValue.value);
    },
    gt: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) > Number(filterValue.value);
    },
    gte: (row, columnId, filterValue: FilterValue, addMeta) => {
      return Number(row.getValue(columnId)) >= Number(filterValue.value);
    }
  },
  string: {
    eq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return (
        String(row.getValue(columnId)).toLowerCase() ===
        String(filterValue.value).toLowerCase()
      );
    },
    neq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return (
        String(row.getValue(columnId)).toLowerCase() !==
        String(filterValue.value).toLowerCase()
      );
    },
    like: (row, columnId, filterValue: FilterValue, addMeta) => {
      const columnValue = (row.getValue(columnId) as string).toLowerCase();
      const filterStr = (filterValue.value as string).toLowerCase();
      return columnValue.includes(filterStr);
    }
  },
  date: {
    eq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return dayjs(row.getValue(columnId)).isSame(
        dayjs(filterValue.date),
        'day'
      );
    },
    neq: (row, columnId, filterValue: FilterValue, addMeta) => {
      return !dayjs(row.getValue(columnId)).isSame(
        dayjs(filterValue.date),
        'day'
      );
    },
    lt: (row, columnId, filterValue: FilterValue, addMeta) => {
      return dayjs(row.getValue(columnId)).isBefore(
        dayjs(filterValue.date),
        'day'
      );
    },
    lte: (row, columnId, filterValue: FilterValue, addMeta) => {
      return dayjs(row.getValue(columnId)).isSameOrBefore(
        dayjs(filterValue.date),
        'day'
      );
    },
    gt: (row, columnId, filterValue: FilterValue, addMeta) => {
      return dayjs(row.getValue(columnId)).isAfter(
        dayjs(filterValue.date),
        'day'
      );
    },
    gte: (row, columnId, filterValue: FilterValue, addMeta) => {
      return dayjs(row.getValue(columnId)).isSameOrAfter(
        dayjs(filterValue.date),
        'day'
      );
    }
  },
  select: {
    eq: (row, columnId, filterValue: FilterValue, addMeta) => {
      if (String(filterValue.value) === EmptyFilterValue) {
        return row.getValue(columnId) === '';
      }
      // Select only supports string values
      return String(row.getValue(columnId)) === String(filterValue.value);
    },
    neq: (row, columnId, filterValue: FilterValue, addMeta) => {
      if (String(filterValue.value) === EmptyFilterValue) {
        return row.getValue(columnId) !== '';
      }
      // Select only supports string values
      return String(row.getValue(columnId)) !== String(filterValue.value);
    }
  },
  multiselect: {
    in: (row, columnId, filterValue: FilterValue, addMeta) => {
      if (!Array.isArray(filterValue.value)) return false;

      return filterValue.value
        .map(value => (value === EmptyFilterValue ? '' : String(value)))
        .includes(String(row.getValue(columnId)));
    },
    notin: (row, columnId, filterValue: FilterValue, addMeta) => {
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
  // @ts-expect-error FilterOperatorTypes is union of all possible operators
  return filterOperationsMap[type][operator];
}

const handleStringBasedTypes = (
  filterType: FilterTypes,
  value: any
): RQLFilterValues => {
  switch (filterType) {
    case FilterType.date:
      return {
        value,
        stringValue: (value as Date).toISOString()
      };
    case FilterType.select:
      return {
        stringValue: value === EmptyFilterValue ? '' : value,
        value
      };
    case FilterType.multiselect:
      return {
        value,
        stringValue: value
          .map((value: any) =>
            value === EmptyFilterValue ? '' : String(value)
          )
          .join()
      };
    default:
      return {
        stringValue: value,
        value
      };
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
}): FilterOperatorTypes => {
  return value === EmptyFilterValue && filterType === FilterType.select
    ? 'empty'
    : operator;
};

export const getFilterValue = ({
  value,
  dataType = 'string',
  filterType = FilterType.string
}: {
  value: any;
  dataType?: FilterValueType;
  filterType?: FilterTypes;
}): RQLFilterValues => {
  if (dataType === 'boolean') {
    return { boolValue: value, value };
  }
  if (dataType === 'number') {
    return { numberValue: value, value };
  }

  // Handle string-based types
  return handleStringBasedTypes(filterType, value);
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
