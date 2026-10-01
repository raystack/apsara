import type { FilterFn } from '@tanstack/table-core';
import {
  type DayKey,
  toDayKey
} from '~/components/calendar-preview/date-adapter';
import type {
  FilterTypes,
  FilterValue,
  FilterValueType
} from '~/types/filters';
import { FilterType } from '~/types/filters';

/* An unreadable row cannot be placed before or after a day, so it matches none
   of these. */
export function onDay(
  test: (day: DayKey, filterDay: DayKey) => boolean
): FilterFn<unknown> {
  return (row, columnId, filterValue: FilterValue) => {
    const day = toDayKey(row.getValue(columnId));
    const filterDay = toDayKey(filterValue.date);
    return day !== null && filterDay !== null && test(day, filterDay);
  };
}

/* A row with no readable date is still not the filter's day. */
export const notOnDay: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: FilterValue
) => {
  const filterDay = toDayKey(filterValue.date);
  return filterDay !== null && toDayKey(row.getValue(columnId)) !== filterDay;
};

type TypedFilter = {
  name: string;
  _type?: FilterTypes;
  _dataType?: FilterValueType;
};

/* A query from the consumer carries no filter types, and a date filter without
   one never reaches the date comparisons. Only dates are typed here, because a
   type changes how string and number filters are sent. A date filter sends
   its day key as a string. */
export function withDateFilterTypes<Filter extends TypedFilter>(
  filters: Filter[],
  fields: { accessorKey?: unknown; filterType?: FilterTypes }[]
): Filter[] {
  return filters.map(filter => {
    const field = fields.find(f => f.accessorKey === filter.name);
    if (filter._type || field?.filterType !== FilterType.date) return filter;
    return { ...filter, _type: FilterType.date, _dataType: 'string' };
  });
}
