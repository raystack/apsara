/*
 * The one module in `calendar-preview/` allowed to call a date library.
 *
 * Everything else — `lib/scale.ts`, `lib/parse.ts` and, from phase 1, the parts
 * — goes through this surface. Two reasons, both from RFC 005:
 *
 *  1. `dayjs.extend()` is import-order dependent. A module that formats a
 *     quarter works or throws depending on whether some *other* module has
 *     already run its `extend()`. date-fns has no plugin registry, so the
 *     failure class disappears — but only while a single file owns the
 *     imports. Adding a date-library import elsewhere in `calendar-preview/`
 *     re-opens it.
 *  2. The library stays swappable. Base UI ships `./internals/temporal` with
 *     date-fns and Luxon adapters; adopting it later is an edit to this file
 *     and nothing else.
 *
 * Day values are timeless. The canonical form is a `DayKey` — `'YYYY-MM-DD'`,
 * no time, no zone — and it is what crosses every boundary in `lib/`. Two
 * day-keys compare correctly with `<`, `>` and `===`, so ordering a day
 * against a bound needs no library call and cannot drift by a timezone.
 */
import { TZDate } from '@date-fns/tz';
import {
  addMonths,
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfQuarter,
  startOfYear
} from 'date-fns';

/**
 * A timeless calendar day, `'YYYY-MM-DD'`.
 *
 * Lexicographic order is chronological order, which is why `lib/` compares
 * these as strings rather than converting back to `Date`.
 */
export type DayKey = string;

const DAY_KEY_FORMAT = 'yyyy-MM-dd';
const DAY_KEY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

/* A fixed reference for `parse`; every token in DAY_KEY_FORMAT is supplied by
 * the input, so no field is ever inherited from it. */
const PARSE_REFERENCE = new Date(2000, 0, 1);

/**
 * The calendar day `date` falls on, as a `DayKey`.
 *
 * With no `timeZone` the day is read from the date's own calendar fields — the
 * day a user in the ambient zone sees. Pass `timeZone` to read the day in that
 * zone instead; this is the call that keeps a grid rendered at `timeZone` from
 * keying its cells one day off, which is the shape of the current family's
 * tooltip/`dateInfo` bug.
 */
export function dayKey(date: Date, timeZone?: string): DayKey {
  return format(zoned(date, timeZone), DAY_KEY_FORMAT);
}

/**
 * The instant `date` represents, in milliseconds.
 *
 * For ordering two *days*, compare their `dayKey`s instead — an epoch carries a
 * time-of-day and a zone offset, and two Dates on the same calendar day can
 * order either way.
 */
export function epoch(date: Date): number {
  return date.getTime();
}

/** Whether `value` is a well-formed, real calendar day. `'2027-02-29'` is not. */
export function isDayKey(value: string): boolean {
  return DAY_KEY_SHAPE.test(value) && isValid(parseStrict(value));
}

/**
 * A `DayKey` back to a `Date` at local midnight.
 *
 * Throws on anything that is not a real calendar day, including a well-shaped
 * one that does not exist (`'2027-02-29'`). Callers handling typed input should
 * gate on {@link isDayKey}, or build keys with {@link dayKeyFromParts}, rather
 * than catching.
 */
export function parseKey(key: DayKey): Date {
  if (!DAY_KEY_SHAPE.test(key)) {
    throw new RangeError(`Not a YYYY-MM-DD day: ${JSON.stringify(key)}`);
  }
  const date = parseStrict(key);
  if (!isValid(date)) {
    throw new RangeError(`Not a real calendar day: ${JSON.stringify(key)}`);
  }
  return date;
}

/**
 * A `DayKey` from calendar parts, or `null` when they name no real day.
 *
 * `month` is 1-12. This is the entry point for parsed user input: it validates
 * against the actual calendar, so 31 April and 29 February in a common year are
 * rejected rather than rolled forward the way a `Date` constructor would.
 *
 * The accepted year range is exactly what a four-digit key can hold, so this
 * and {@link isDayKey} always agree. Rejecting a *two-digit* year is a shape
 * question and belongs to whatever matches the input — `lib/parse.ts` pins the
 * year at four digits before it gets here.
 */
export function dayKeyFromParts(
  year: number,
  month: number,
  day: number
): DayKey | null {
  if (!Number.isInteger(year) || year < 0 || year > 9999) return null;
  if (!Number.isInteger(month) || !Number.isInteger(day)) return null;
  const key = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
  return isDayKey(key) ? key : null;
}

/** The first day of the month containing `key`. */
export function startOfMonthKey(key: DayKey): DayKey {
  return dayKey(startOfMonth(parseKey(key)));
}

/** The last day of the month containing `key` — leap-correct by construction. */
export function endOfMonthKey(key: DayKey): DayKey {
  return dayKey(endOfMonth(parseKey(key)));
}

/** The first day of the calendar quarter containing `key`. */
export function startOfQuarterKey(key: DayKey): DayKey {
  return dayKey(startOfQuarter(parseKey(key)));
}

/** The last day of the calendar quarter containing `key`. */
export function endOfQuarterKey(key: DayKey): DayKey {
  return dayKey(endOfQuarter(parseKey(key)));
}

/** The first day of the year containing `key`. */
export function startOfYearKey(key: DayKey): DayKey {
  return dayKey(startOfYear(parseKey(key)));
}

/** The last day of the year containing `key`. */
export function endOfYearKey(key: DayKey): DayKey {
  return dayKey(endOfYear(parseKey(key)));
}

/** The calendar year of `key`. */
export function yearOf(key: DayKey): number {
  return Number(key.slice(0, 4));
}

/** The calendar month of `key`, 1-12. */
export function monthOf(key: DayKey): number {
  return Number(key.slice(5, 7));
}

/**
 * The month number (1-12) a written month name denotes, or `null`.
 *
 * Accepts the full and three-letter forms, case-insensitively — `'September'`,
 * `'Sep'`, `'sep'`. The names come from date-fns' default locale, which is
 * `en-US`; a localized picker will pass a locale through here rather than
 * growing a second lookup somewhere else.
 */
export function monthFromName(name: string): number | null {
  for (const pattern of ['MMMM', 'MMM']) {
    const date = parse(name, pattern, PARSE_REFERENCE);
    if (isValid(date)) return date.getMonth() + 1;
  }
  return null;
}

/**
 * `date` moved `delta` whole months, landing on the first of the month.
 *
 * Normalising to the first keeps repeated navigation from drifting: stepping
 * forward from 31 January would otherwise clamp to 28 February and stay on the
 * 28th for every month after it.
 */
export function shiftMonths(date: Date, delta: number): Date {
  return addMonths(startOfMonth(date), delta);
}

/** The first day of a calendar month. `monthIndex` is 0-11, as on `Date`. */
export function monthStart(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

/**
 * `'20/05/2027'` — the default label for a value at day scale.
 *
 * Day-first, matching the input format `lib/parse.ts` accepts, so a rendered
 * value can be typed straight back in.
 */
export function formatDayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'dd/MM/yyyy');
}

/** `'May 2027'` — the default label for a value at month scale. */
export function formatMonthLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/**
 * `'May 2027'` — the grid header's caption.
 *
 * Abbreviated, matching reference A, and so identical to
 * {@link formatMonthLabel} today. They stay separate functions because they
 * answer different questions — what the grid is showing, versus what a
 * month-scale value means — and only one of them is the caption.
 */
export function formatCaptionLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/**
 * `'Sun'` — one weekday heading.
 *
 * Three letters, not react-day-picker's two-letter default: reference A's
 * frames spell them `Sun Mon Tue`, and the day cell is wide enough for it.
 */
export function formatWeekdayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'EEE');
}

/**
 * The twelve month names in full, January first.
 *
 * Built from the same locale as {@link monthFromName} reads, so the caption's
 * month column and the input parser can never disagree about a name.
 */
export function monthNames(): string[] {
  return MONTH_INDEXES.map(index => format(new Date(2001, index, 1), 'MMMM'));
}

/**
 * The twelve month names abbreviated, January first — `'Jan'`, `'Feb'`.
 *
 * What the caption's month column shows: the scroller is a narrow column
 * beside the years, and reference A abbreviates it. {@link monthFromName}
 * accepts this form too, so the parser still agrees with it.
 */
export function monthShortNames(): string[] {
  return MONTH_INDEXES.map(index => format(new Date(2001, index, 1), 'MMM'));
}

const MONTH_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function zoned(date: Date, timeZone?: string): Date {
  return timeZone ? new TZDate(date, timeZone) : date;
}

function parseStrict(value: string): Date {
  return parse(value, DAY_KEY_FORMAT, PARSE_REFERENCE);
}

function pad(value: number, width: number): string {
  return String(value).padStart(width, '0');
}
