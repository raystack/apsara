/**
 * Every date operation in `CalendarPreview` goes through this module.
 *
 * Two reasons it exists. First, `dayjs.extend()` is global and order-dependent
 * — `timezone` needs `utc` loaded first — so the old calendar family spread
 * four independent `extend()` calls across four modules and relied on import
 * order holding. Doing it once, here, makes that failure class impossible.
 * Second, nothing outside this file names a date library, so swapping the
 * implementation (date-fns, or Temporal later) is a one-file change.
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// `timezone` depends on `utc`: this order is load-bearing.
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/** The one canonical display and input format. */
export const DEFAULT_FORMAT = 'DD MMM YYYY';

const zoned = (date: Date, timeZone?: string) =>
  timeZone ? dayjs(date).tz(timeZone) : dayjs(date);

/**
 * A stable identity for a calendar day, for memo keys and effect deps.
 * Two `Date`s for the same day compare equal here; by reference they never do,
 * which is what forced the old family's `biome-ignore`s.
 */
export function dayKey(date: Date, timeZone?: string): string {
  return zoned(date, timeZone).format('YYYY-MM-DD');
}

/** Millisecond identity, for deps that must track time as well as day. */
export function epoch(date: Date): number {
  return date.getTime();
}

export function startOfMonth(date: Date, timeZone?: string): Date {
  return zoned(date, timeZone).startOf('month').toDate();
}

export function addMonths(date: Date, count: number, timeZone?: string): Date {
  return zoned(date, timeZone).add(count, 'month').toDate();
}

export function isSameDay(a: Date, b: Date, timeZone?: string): boolean {
  return dayKey(a, timeZone) === dayKey(b, timeZone);
}

export function formatDate(
  date: Date,
  format: string = DEFAULT_FORMAT,
  timeZone?: string
): string {
  return zoned(date, timeZone).format(format);
}

/**
 * Strict parse — `customParseFormat`'s third argument. Anything the format
 * does not describe exactly comes back `null` rather than a coerced date.
 */
export function parseDate(
  input: string,
  format: string = DEFAULT_FORMAT,
  timeZone?: string
): Date | null {
  const parsed = timeZone
    ? dayjs.tz(input, format, timeZone)
    : dayjs(input, format, true);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function isWithinBounds(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const value = dayjs(date);
  if (minDate && !value.isSameOrAfter(dayjs(minDate), 'day')) return false;
  if (maxDate && !value.isSameOrBefore(dayjs(maxDate), 'day')) return false;
  return true;
}
