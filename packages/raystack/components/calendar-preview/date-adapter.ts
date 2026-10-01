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
  return isValid(native) && writesMonthOf(value, native) ? native : null;
}

/* `new Date` rolls an impossible day over, whatever suffix follows it. */
const ISO_DAY = /^(\d{4}-\d{2}-\d{2})/;

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
