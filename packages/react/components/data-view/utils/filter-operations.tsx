import {
  dateFilterFns,
  type RowFilterPredicate,
  toDayKey
} from '~/shared/date-filters';
import {
  DateFilterOperatorType,
  EmptyFilterValue,
  FilterDataType,
  FilterOperatorTypes,
  FilterType,
  FilterTypes,
  MultiSelectFilterOperatorType,
  NumberFilterOperatorType,
  SelectFilterOperatorType,
  StringFilterOperatorType
} from '~/types/filters';
import type {
  DataViewFilterOperatorTypes,
  DataViewFilterValue,
  DataViewFilterValues
} from '../data-view.types';

export type FilterFunctionsMap = {
  number: Record<NumberFilterOperatorType, RowFilterPredicate>;
  string: Record<StringFilterOperatorType, RowFilterPredicate>;
  date: Record<DateFilterOperatorType, RowFilterPredicate>;
  select: Record<SelectFilterOperatorType, RowFilterPredicate>;
  multiselect: Record<MultiSelectFilterOperatorType, RowFilterPredicate>;
};

export const filterOperationsMap: FilterFunctionsMap = {
  number: {
    eq: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) === Number(filterValue.value),
    neq: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) !== Number(filterValue.value),
    lt: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) < Number(filterValue.value),
    lte: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) <= Number(filterValue.value),
    gt: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) > Number(filterValue.value),
    gte: (row, columnId, filterValue) =>
      Number(row.getValue(columnId)) >= Number(filterValue.value)
  },
  string: {
    eq: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase() ===
      String(filterValue.value).toLowerCase(),
    neq: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase() !==
      String(filterValue.value).toLowerCase(),
    contains: (row, columnId, filterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.includes(filterStr);
    },
    starts_with: (row, columnId, filterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.startsWith(filterStr);
    },
    ends_with: (row, columnId, filterValue) => {
      const columnValue = String(row.getValue(columnId)).toLowerCase();
      const filterStr = String(filterValue.value).toLowerCase();
      return columnValue.endsWith(filterStr);
    }
  },
  date: dateFilterFns,
  select: {
    eq: (row, columnId, filterValue) => {
      if (String(filterValue.value) === EmptyFilterValue)
        return row.getValue(columnId) === '';
      return String(row.getValue(columnId)) === String(filterValue.value);
    },
    neq: (row, columnId, filterValue) => {
      if (String(filterValue.value) === EmptyFilterValue)
        return row.getValue(columnId) !== '';
      return String(row.getValue(columnId)) !== String(filterValue.value);
    }
  },
  multiselect: {
    in: (row, columnId, filterValue) => {
      if (!Array.isArray(filterValue.value)) return false;
      return filterValue.value
        .map(value => (value === EmptyFilterValue ? '' : String(value)))
        .includes(String(row.getValue(columnId)));
    },
    notin: (row, columnId, filterValue) => {
      if (!Array.isArray(filterValue.value)) return false;
      return !filterValue.value
        .map(value => (value === EmptyFilterValue ? '' : String(value)))
        .includes(String(row.getValue(columnId)));
    }
  }
} as const;

export function getFilterFn(
  type: FilterTypes,
  operator: FilterOperatorTypes
): RowFilterPredicate | undefined {
  const predicates: Partial<Record<FilterOperatorTypes, RowFilterPredicate>> =
    filterOperationsMap[type];
  return predicates[operator];
}

const toStringValue = (value: DataViewFilterValue) =>
  value == null ? undefined : typeof value === 'string' ? value : String(value);

const handleStringBasedTypes = (
  filterType: FilterTypes,
  value: DataViewFilterValue,
  operator?: FilterOperatorTypes | DataViewFilterOperatorTypes
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
}): DataViewFilterOperatorTypes => {
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
  return operator as DataViewFilterOperatorTypes;
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
  operator?: FilterOperatorTypes | DataViewFilterOperatorTypes;
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
