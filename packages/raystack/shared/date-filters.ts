import type { FilterFn } from '@tanstack/table-core';
import { format, isExists, isValid, parseISO } from 'date-fns';
import type {
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
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'number') {
    const fromEpoch = new Date(value);
    return isValid(fromEpoch) ? fromEpoch : null;
  }
  if (typeof value !== 'string') return null;
  const iso = parseISO(value);
  if (isValid(iso)) return iso;
  const isoDay = ISO_DAY.exec(value);
  if (isoDay) {
    const [, year, month, day] = isoDay.map(Number);
    if (!isExists(year, month - 1, day)) return null;
  }
  const parts = LOCAL_SHAPE.exec(value);
  if (parts) return fromLocalParts(parts);
  const native = new Date(value);
  return isValid(native) && writesMonthOf(value, native) ? native : null;
}

/* `new Date` rolls an impossible day over, whatever suffix follows it. */
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})/;

/* A numeric offset counts only after GMT, UTC or a time, so `2-30-2026`
   does not read as offset -20:26. The names are the zones V8 reads. The
   prefixes are tested in code: Safari before 16.4 has no regex lookbehind. */
const OFFSET = /([+-])(\d{2}):?(\d{2})(?!\d)/g;
const AFTER_ZONE_NAME = /\b(?:GMT|UTC|UT)\s*$/i;
const AFTER_TIME = /\d:\d{2}(?::\d{2}(?:\.\d+)?)?\s?$/;
const ZONE_NAME = /\b(UTC|UT|GMT|[ECMP][SD]T)\b/gi;
const ZULU = /\d(Z)\b/gi;
const ZONE_OFFSETS: Record<string, number> = {
  UT: 0,
  UTC: 0,
  GMT: 0,
  Z: 0,
  EST: -300,
  EDT: -240,
  CST: -360,
  CDT: -300,
  MST: -420,
  MDT: -360,
  PST: -480,
  PDT: -420
};
const TIME = /\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?/g;
const MONTH_PREFIXES = 'janfebmaraprmayjunjulaugsepoctnovdec';

type Zone = { start: number; end: number; offset: number };

/* The leftmost zone, and the longest at that position. */
function findZone(value: string): Zone | null {
  const zones: Zone[] = [];
  for (const match of value.matchAll(OFFSET)) {
    const before = value.slice(0, match.index);
    const name = AFTER_ZONE_NAME.exec(before);
    if (!name && !AFTER_TIME.test(before)) continue;
    const sign = match[1] === '-' ? -1 : 1;
    zones.push({
      start: name ? name.index : match.index,
      end: match.index + match[0].length,
      offset: sign * (Number(match[2]) * 60 + Number(match[3]))
    });
  }
  for (const match of value.matchAll(ZONE_NAME)) {
    zones.push({
      start: match.index,
      end: match.index + match[0].length,
      offset: ZONE_OFFSETS[match[1].toUpperCase()]
    });
  }
  for (const match of value.matchAll(ZULU)) {
    zones.push({ start: match.index + 1, end: match.index + 2, offset: 0 });
  }
  zones.sort((a, b) => a.start - b.start || b.end - a.end);
  return zones[0] ?? null;
}

/* The month a named month word writes, or `null` for none. */
function monthOfWord(word: string): number | null {
  if (word.length < 3) return null;
  const at = MONTH_PREFIXES.indexOf(word.slice(0, 3).toLowerCase());
  return at >= 0 && at % 3 === 0 ? at / 3 : null;
}

/* `new Date` rolls an impossible day into the next month, in any form it
   reads. A result in a month the string never writes is that rollover. */
function writesMonthOf(value: string, date: Date): boolean {
  const zone = findZone(value);
  const month = zone
    ? new Date(date.getTime() + zone.offset * 60_000).getUTCMonth()
    : date.getMonth();
  const datePart = (
    zone ? `${value.slice(0, zone.start)} ${value.slice(zone.end)}` : value
  ).replace(TIME, ' ');
  const named = (datePart.match(/[A-Za-z]+/g) ?? [])
    .map(monthOfWord)
    .filter(word => word !== null);
  if (named.length > 0) return named.includes(month);
  /* A number after the year is not a month, so `2/30/2026 3` is not March. */
  const numbers = datePart.match(/\d+/g) ?? [];
  const yearAt = numbers.findIndex(number => number.length >= 3);
  const candidates =
    yearAt === 0
      ? numbers.slice(1, 3)
      : yearAt > 0
        ? numbers.slice(0, yearAt)
        : numbers;
  return candidates.map(Number).includes(month + 1);
}

/* The shape dayjs parsed as local time. `new Date` reads some of these as UTC
   and rolls out-of-range fields over, so they never reach it. */
const LOCAL_SHAPE =
  /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;

function fromLocalParts(parts: RegExpExecArray): Date | null {
  const year = Number(parts[1]);
  const [month = 1, day = 1, hour = 0, minute = 0, second = 0] = parts
    .slice(2, 7)
    .map(part => (part ? Number(part) : undefined));
  const ms = Number((parts[7] ?? '0').slice(0, 3));
  const date = new Date(year, month - 1, day, hour, minute, second, ms);
  const readsBack =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second;
  return readsBack ? date : null;
}

/* An unreadable row cannot be placed before or after a day, so it matches none
   of these. */
export function onDay(
  test: (day: string, filterDay: string) => boolean
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
