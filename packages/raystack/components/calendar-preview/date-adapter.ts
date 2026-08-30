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
 * which is what forced the old family's lint suppressions.
 */
export function dayKey(date: Date, timeZone?: string): string {
  return zoned(date, timeZone).format('YYYY-MM-DD');
}

export function startOfMonth(date: Date, timeZone?: string): Date {
  return zoned(date, timeZone).startOf('month').toDate();
}

export function addMonths(date: Date, count: number, timeZone?: string): Date {
  return zoned(date, timeZone).add(count, 'month').toDate();
}

/** First instant of a month, built from parts rather than parsed. */
export function firstOfMonth(
  year: number,
  monthIndex: number,
  timeZone?: string
): Date {
  const iso = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
  return timeZone
    ? dayjs.tz(iso, 'YYYY-MM-DD', timeZone).toDate()
    : dayjs(iso, 'YYYY-MM-DD', true).toDate();
}

export function getHours(date: Date, timeZone?: string): number {
  return zoned(date, timeZone).hour();
}

export function getMinutes(date: Date, timeZone?: string): number {
  return zoned(date, timeZone).minute();
}

/** The same calendar day, at a different time of day. */
export function setTime(
  date: Date,
  hours: number,
  minutes: number,
  timeZone?: string
): Date {
  return zoned(date, timeZone)
    .hour(hours)
    .minute(minutes)
    .second(0)
    .millisecond(0)
    .toDate();
}

export function getYear(date: Date, timeZone?: string): number {
  return zoned(date, timeZone).year();
}

export function endOfMonth(date: Date, timeZone?: string): Date {
  return zoned(date, timeZone).endOf('month').toDate();
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
  /*
   * Validate with the strict, zone-free parse first. `dayjs.tz` does not
   * validate — handed something unparseable it throws `RangeError: Invalid
   * time value` rather than returning an invalid dayjs — so it must never see
   * input that has not already been proven good. This is the same failure
   * class as the 0.49.0 P0: a throw on an ordinary keystroke.
   */
  const strict = dayjs(input, format, true);
  if (!strict.isValid()) return null;
  if (!timeZone) return strict.toDate();

  const zonedParse = dayjs.tz(input, format, timeZone);
  return zonedParse.isValid() ? zonedParse.toDate() : null;
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
