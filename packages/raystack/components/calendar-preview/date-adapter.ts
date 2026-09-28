/* The only module here that may import a date library, so it stays swappable. */
import { TZDate } from '@date-fns/tz';
import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  endOfMonth,
  format,
  getQuarter,
  isValid,
  parse,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear
} from 'date-fns';

export type DayKey = string;

/* `uuuu`, not `yyyy`: year-of-era formats JS year 0 as `'0001'`. */
const DAY_KEY_FORMAT = 'uuuu-MM-dd';
const DAY_KEY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;

const PARSE_REFERENCE = new Date(2000, 0, 1);

export function dayKey(date: Date, timeZone?: string): DayKey {
  const key = format(zoned(date, timeZone), DAY_KEY_FORMAT);
  if (!DAY_KEY_SHAPE.test(key)) {
    throw new RangeError(`Day is outside the supported range: ${key}`);
  }
  return key;
}

export function toDayKey(value: unknown): DayKey | null {
  const date = toInstant(value);
  if (!date) return null;
  try {
    return dayKey(date);
  } catch {
    return null;
  }
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
  if (isoDay && !isDayKey(isoDay[1])) return null;
  const parts = LOCAL_SHAPE.exec(value);
  if (parts) return fromLocalParts(parts);
  const native = new Date(value);
  return isValid(native) ? native : null;
}

/* `new Date` rolls an impossible day over, whatever suffix follows it. */
const ISO_DAY = /^(\d{4}-\d{2}-\d{2})/;

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

export function isDayKey(value: string): boolean {
  return DAY_KEY_SHAPE.test(value) && isValid(parseStrict(value));
}

/* Throws: callers gate on isDayKey first, so reaching here is a real bug. */
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

export function startOfMonthKey(key: DayKey): DayKey {
  return dayKey(startOfMonth(parseKey(key)));
}

export function endOfMonthKey(key: DayKey): DayKey {
  return dayKey(endOfMonth(parseKey(key)));
}

export function yearOf(key: DayKey): number {
  return Number(key.slice(0, 4));
}

export function monthOf(key: DayKey): number {
  return Number(key.slice(5, 7));
}

export function monthFromName(name: string): number | null {
  for (const pattern of ['MMMM', 'MMM']) {
    const date = parse(name, pattern, PARSE_REFERENCE);
    if (isValid(date)) return date.getMonth() + 1;
  }
  return null;
}

export function anyDayBetween(
  from: DayKey,
  to: DayKey,
  match: (date: Date) => boolean
): boolean {
  let cursor = from;
  while (cursor <= to) {
    const date = parseKey(cursor);
    if (match(date)) return true;
    cursor = dayKey(addDays(date, 1));
  }
  return false;
}

/* Normalising to the first, or stepping on from 31 January clamps to the 28th. */
export function shiftMonths(date: Date, delta: number): Date {
  return addMonths(startOfMonth(date), delta);
}

export function monthStart(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

export function formatDayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'dd MMM yyyy');
}

export function formatMonthLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/* Kept separate: what the grid shows versus what a value means. */
export function formatCaptionLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'MMM yyyy');
}

/* Three letters, against RDP's two-letter default. */
export function formatWeekdayLabel(date: Date, timeZone?: string): string {
  return format(zoned(date, timeZone), 'EEE');
}

/* `TimelineScale` has `week` and stops at quarter, so it cannot share `lib/scale.ts`. */
export const startOfUnit = {
  day: startOfDay,
  week: startOfWeek,
  month: startOfMonth,
  quarter: startOfQuarter,
  year: startOfYear
} as const;

export const addUnit = {
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears
} as const;

export function formatDayOfMonth(date: Date): string {
  return format(date, 'd');
}

export function formatMonthShort(date: Date): string {
  return format(date, 'MMM');
}

export function formatDayMonth(date: Date): string {
  return format(date, 'd MMM');
}

export function formatYear(date: Date): string {
  return format(date, 'yyyy');
}

export function formatQuarterShort(date: Date): string {
  return `Q${getQuarter(date)}`;
}

/* Same locale as monthFromName, so the column and the parser cannot disagree. */
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
