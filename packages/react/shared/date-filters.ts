import type { FilterFn } from '@tanstack/table-core';
import { format, isExists, isValid, parseISO } from 'date-fns';
import type {
  DateFilterOperatorType,
  FilterTypes,
  FilterValue,
  FilterValueType
} from '~/types/filters';
import { FilterType } from '~/types/filters';

/* `uuuu`, not `yyyy`: year-of-era formats JS year 0 as `'0001'`. */
const DAY_KEY_FORMAT = 'uuuu-MM-dd';
const DAY_KEY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

/** The `yyyy-MM-dd` day of a row or filter value in the viewer's zone. */
export function toDayKey(value: unknown): string | null {
  const date = toInstant(value);
  if (!date) return null;
  const key = format(date, DAY_KEY_FORMAT);
  return DAY_KEY_SHAPE.test(key) ? key : null;
}

export function toInstant(value: unknown): Date | null {
  /* A date-library object reads as its numeric `valueOf`. */
  if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
    let epoch: unknown;
    try {
      epoch = typeof value.valueOf === 'function' ? value.valueOf() : undefined;
    } catch {
      return null;
    }
    return typeof epoch === 'number' && Number.isFinite(epoch)
      ? new Date(epoch)
      : null;
  }
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'number') {
    const fromEpoch = new Date(value);
    return isValid(fromEpoch) ? fromEpoch : null;
  }
  if (typeof value !== 'string') return null;
  const iso = parseISO(value.replace(ZONE_ANNOTATION, ''));
  if (isValid(iso)) return iso;
  const isoDay = ISO_DAY.exec(value);
  if (isoDay) {
    const [, year, month, day] = isoDay.map(Number);
    if (!isExists(year, month - 1, day)) return null;
  }
  const parts = LOCAL_SHAPE.exec(value);
  if (parts) return fromLocalParts(parts);
  const native = new Date(value);
  return isValid(native) ? native : null;
}

/* RFC 9557, as in `2026-08-15T23:00+05:30[Asia/Kolkata]`. parseISO rejects it. */
const ZONE_ANNOTATION = /(\[[^\]]*\])+$/;

/* `new Date` rolls an impossible day over, whatever suffix follows it. */
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})/;

/* Year-first strings read as local time. `new Date` reads some of these as UTC
   and rolls out-of-range fields over, so they never reach it. */
const LOCAL_SHAPE =
  /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;

function fromLocalParts(parts: RegExpExecArray): Date | null {
  const year = Number(parts[1]);
  const [month = 1, day = 1, hour = 0, minute = 0, second = 0] = parts
    .slice(2, 7)
    .map(part => (part ? Number(part) : undefined));
  const ms = Number((parts[7] ?? '0').slice(0, 3));
  if (hour > 23 || minute > 59 || second > 59) return null;
  /* A time in a daylight-saving gap moves forward, so only the day is read
     back. */
  const date = new Date(year, month - 1, day, hour, minute, second, ms);
  const readsBack =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return readsBack ? date : null;
}

/* An unreadable row cannot be placed before or after a day, so it matches none
   of these. */
function onDay(
  test: (day: string, filterDay: string) => boolean
): FilterFn<unknown> {
  return (row, columnId, filterValue: FilterValue) => {
    const day = toDayKey(row.getValue(columnId));
    const filterDay = toDayKey(filterValue.date);
    return day !== null && filterDay !== null && test(day, filterDay);
  };
}

/* A row with no readable date is still not the filter's day. */
const notOnDay: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: FilterValue
) => {
  const filterDay = toDayKey(filterValue.date);
  return filterDay !== null && toDayKey(row.getValue(columnId)) !== filterDay;
};

export const dateFilterFns: Record<
  DateFilterOperatorType,
  FilterFn<unknown>
> = {
  eq: onDay((day, filterDay) => day === filterDay),
  neq: notOnDay,
  lt: onDay((day, filterDay) => day < filterDay),
  lte: onDay((day, filterDay) => day <= filterDay),
  gt: onDay((day, filterDay) => day > filterDay),
  gte: onDay((day, filterDay) => day >= filterDay)
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
