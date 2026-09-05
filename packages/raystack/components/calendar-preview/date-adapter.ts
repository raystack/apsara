/* The only module in `calendar-preview/` that may import a date library.
   Importing one elsewhere re-opens the import-order failure `dayjs.extend()`
   caused, and costs the swappability the RFC keeps for Temporal. */
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

/* Lexicographic order is chronological order, so `lib/` orders days as
   strings — no library call, and no drift by timezone. */
export type DayKey = string;

const DAY_KEY_FORMAT = 'yyyy-MM-dd';
const DAY_KEY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

/* Every token in DAY_KEY_FORMAT comes from the input, so no field is ever
   inherited from this reference. */
const PARSE_REFERENCE = new Date(2000, 0, 1);

/* Passing `timeZone` is what keeps a grid rendered in that zone from keying
   its cells a day off — the current family's tooltip/`dateInfo` bug. */
export function dayKey(date: Date, timeZone?: string): DayKey {
  return format(zoned(date, timeZone), DAY_KEY_FORMAT);
}

/* Not for ordering two days: an epoch carries a time and an offset, so two
   Dates on the same calendar day can order either way. Compare dayKeys. */
export function epoch(date: Date): number {
  return date.getTime();
}

/** Whether `value` is a real calendar day. `'2027-02-29'` is not. */
export function isDayKey(value: string): boolean {
  return DAY_KEY_SHAPE.test(value) && isValid(parseStrict(value));
}

/* Throws rather than returning null: callers handling typed input gate on
   isDayKey or build with dayKeyFromParts, so a throw here is a real bug. */
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

/* `month` is 1-12. Validates against the real calendar, so 31 April is
   rejected rather than rolled forward the way `new Date` would. The year
   bound is what a four-digit key holds, so this and isDayKey always agree. */
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

/** The last day of the month containing `key`. */
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

/* Accepts both the full and three-letter forms. A localized picker passes a
   locale through here rather than growing a second lookup elsewhere. */
export function monthFromName(name: string): number | null {
  for (const pattern of ['MMMM', 'MMM']) {
    const date = parse(name, pattern, PARSE_REFERENCE);
    if (isValid(date)) return date.getMonth() + 1;
  }
  return null;
}

/* Normalising to the first stops repeated navigation drifting: stepping on
   from 31 January would clamp to the 28th and stay there. */
export function shiftMonths(date: Date, delta: number): Date {
  return addMonths(startOfMonth(date), delta);
}

/** The first day of a calendar month. `monthIndex` is 0-11, as on `Date`. */
export function monthStart(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

/* `lib/parse.ts` accepts this form back, so a rendered value can be typed
   straight in. Day-first and month-named, matching the frames and the shipped
   picker's `dateFormat`. */
export function formatDayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'dd MMM yyyy');
}

/** `'May 2027'` — the default label for a value at month scale. */
export function formatMonthLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/* Identical to formatMonthLabel today, kept separate because they answer
   different questions: what the grid shows, versus what a value means. */
export function formatCaptionLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/* Three letters, against react-day-picker's two-letter default — the frames
   spell them `Sun Mon Tue`. */
export function formatWeekdayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'EEE');
}

/* Same locale as monthFromName parses, so the caption's month column and the
   input parser cannot disagree about a name. */
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
