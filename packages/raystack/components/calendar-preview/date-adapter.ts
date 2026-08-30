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

/**
 * How a value reads at each granularity, mirroring the reference app: a month
 * shows `Jun 2026`, a quarter `Q3 2026`, a half-year `H1 2026`, a year `2025`.
 * Only `day` uses the consumer's `format`.
 */
export function formatForGranularity(
  date: Date,
  granularity: string,
  format: string = DEFAULT_FORMAT,
  timeZone?: string
): string {
  const year = zoned(date, timeZone).year();
  const month = zoned(date, timeZone).month();
  switch (granularity) {
    case 'month':
      return formatDate(date, 'MMM YYYY', timeZone);
    case 'quarter':
      return `Q${Math.floor(month / 3) + 1} ${year}`;
    case 'half-year':
      return `H${month < 6 ? 1 : 2} ${year}`;
    case 'year':
      return String(year);
    default:
      return formatDate(date, format, timeZone);
  }
}

/** The hint shown in an empty field, per granularity. */
export function patternForGranularity(
  granularity: string,
  format: string = DEFAULT_FORMAT
): string {
  switch (granularity) {
    case 'month':
      return 'MMM YYYY';
    case 'quarter':
      return 'Q# YYYY';
    case 'half-year':
      return 'H# YYYY';
    case 'year':
      return 'YYYY';
    default:
      return format;
  }
}

const QUARTER = /^Q([1-4])(?:\s+(\d{4}))?$/i;
const HALF_YEAR = /^H([12])(?:\s+(\d{4}))?$/i;
const YEAR = /^(\d{4})$/;

/**
 * Parses what the field displays at the active granularity, and resolves to
 * the first day of that period — the same instant the grid would emit.
 */
export function parseForGranularity(
  input: string,
  granularity: string,
  format: string = DEFAULT_FORMAT,
  timeZone?: string,
  /** Year used when the text omits one, as bare `Q4` does. */
  fallbackYear: number = new Date().getFullYear()
): Date | null {
  const text = input.trim();
  switch (granularity) {
    case 'month':
      return parseDate(text, 'MMM YYYY', timeZone);
    case 'quarter': {
      const match = QUARTER.exec(text);
      if (!match) return null;
      return firstOfMonth(
        match[2] ? Number(match[2]) : fallbackYear,
        (Number(match[1]) - 1) * 3,
        timeZone
      );
    }
    case 'half-year': {
      const match = HALF_YEAR.exec(text);
      if (!match) return null;
      return firstOfMonth(
        match[2] ? Number(match[2]) : fallbackYear,
        (Number(match[1]) - 1) * 6,
        timeZone
      );
    }
    case 'year': {
      const match = YEAR.exec(text);
      if (!match) return null;
      return firstOfMonth(Number(match[1]), 0, timeZone);
    }
    default:
      return parseDate(text, format, timeZone);
  }
}

/**
 * Most specific first: a day format like `15 Jun 2026` must not be mistaken
 * for a year, and `Q4` must beat a bare-number read. Only granularities the
 * picker actually offers are tried, so typing `Q4` into a day-only picker
 * stays unparseable rather than silently switching to a tab that is not there.
 */
const PARSE_ORDER = ['day', 'quarter', 'half-year', 'month', 'year'] as const;

export interface CrossGranularityMatch {
  date: Date;
  granularity: string;
}

export function parseAcrossGranularities(
  input: string,
  allowed: readonly string[],
  format: string = DEFAULT_FORMAT,
  timeZone?: string,
  fallbackYear?: number
): CrossGranularityMatch | null {
  for (const granularity of PARSE_ORDER) {
    if (!allowed.includes(granularity)) continue;
    const date = parseForGranularity(
      input,
      granularity,
      format,
      timeZone,
      fallbackYear
    );
    if (date) return { date, granularity };
  }
  return null;
}

/**
 * The same day identity as `dayKey`, as a sortable integer — `20240417`.
 *
 * The comparisons below used to format both sides to `YYYY-MM-DD` and compare
 * the strings. Correct, but formatting is the slow half of dayjs, and these
 * three are now the date predicates behind `DataTable` and `DataView`
 * filtering, where they run once per row per filter. Reading the three fields
 * costs no string building and orders identically.
 *
 * `dayKey` keeps returning the string: it is a React key and a `data-*` value
 * as much as a comparison key, and it reads as a date when debugging.
 */
function dayOrdinal(date: Date, timeZone?: string): number {
  const value = zoned(date, timeZone);
  return value.year() * 10000 + (value.month() + 1) * 100 + value.date();
}

/** Day-granularity comparisons, so callers never touch a date library. */
export function isSameDay(a: Date, b: Date, timeZone?: string): boolean {
  return dayOrdinal(a, timeZone) === dayOrdinal(b, timeZone);
}

export function isBeforeDay(a: Date, b: Date, timeZone?: string): boolean {
  return dayOrdinal(a, timeZone) < dayOrdinal(b, timeZone);
}

export function isAfterDay(a: Date, b: Date, timeZone?: string): boolean {
  return dayOrdinal(a, timeZone) > dayOrdinal(b, timeZone);
}

/**
 * Best-effort parse for values arriving from outside the component — a
 * serialized query string, an epoch number, an ISO timestamp. Deliberately
 * loose, unlike `parseDate`, which is strict against a display format.
 */
export function toDateLoose(value: unknown): Date | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function isWithinBounds(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  timeZone?: string
): boolean {
  // Compared by zoned day, inclusive at both ends. The previous
  // `isSameOrAfter` pair worked on unzoned dayjs objects, so near midnight the
  // typed field and the grid disagreed about whether a date was in range.
  if (minDate && isBeforeDay(date, minDate, timeZone)) return false;
  if (maxDate && isAfterDay(date, maxDate, timeZone)) return false;
  return true;
}
