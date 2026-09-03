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

/*
 * Wall-clock formatters, one per zone. `Intl.DateTimeFormat` construction is
 * not cheap and every zoned read goes through one.
 */
const wallFormatters = new Map<string, Intl.DateTimeFormat>();

const wallFormatter = (timeZone: string): Intl.DateTimeFormat => {
  const cached = wallFormatters.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // `h23` rather than `hour12: false`, which reports midnight as hour 24.
    hourCycle: 'h23'
  });
  wallFormatters.set(timeZone, formatter);
  return formatter;
};

/** The wall-clock fields of an instant, as read in a zone. */
interface WallClock {
  year: number;
  /** Zero-based, matching `Date` and dayjs. */
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
}

/**
 * The instant as it reads on the clock in `timeZone`.
 *
 * `Intl` performs the conversion, so the answer never depends on the host's own
 * zone. Every other route does. dayjs's prototype `.tz()` round-trips through
 * `toLocaleString('en-US', { timeZone })` and re-parses that wall clock in the
 * host zone, so when the target's wall time falls in the host's spring-forward
 * gap the re-parse jumps an hour: the same instant read 02:30 in Asia/Kolkata on
 * a machine in UTC and 03:30 on one in America/New_York, so editing only the
 * minute field moved the value by 75 of them.
 *
 * Reconstructing a `dayjs.tz` from these parts does not help — measured, its
 * field accessors are host-dependent in exactly the same way, returning hour 3
 * under New_York for the string `2024-03-10 02:30`. So the fields are read
 * straight off `Intl` and dayjs is left out of the read path entirely.
 */
const wallClock = (date: Date, timeZone?: string): WallClock => {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      ms: date.getMilliseconds()
    };
  }
  const parts: Record<string, string> = {};
  for (const part of wallFormatter(timeZone).formatToParts(date)) {
    parts[part.type] = part.value;
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month) - 1,
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    // Intl does not report milliseconds, and they are the same in every zone.
    ms: date.getMilliseconds()
  };
};

/**
 * A dayjs carrying the target zone's wall clock, for token formatting only.
 *
 * Backed by UTC because UTC has no transitions: the fields handed in are the
 * fields that read back. A local `Date` would renormalise a wall clock sitting
 * in the *host's* gap — the bug this exists to avoid — and a `dayjs.tz` reads
 * its fields back host-dependently.
 *
 * The wall clock is therefore right and the offset wrong, so zone tokens are
 * substituted before formatting rather than left to dayjs. See `zoneTokens`.
 */
const forFormat = (date: Date, timeZone?: string) => {
  if (!timeZone) return dayjs(date);
  const w = wallClock(date, timeZone);
  return dayjs.utc(
    Date.UTC(w.year, w.month, w.day, w.hour, w.minute, w.second, w.ms)
  );
};

/*
 * Zone-name formatters, cached per zone and style like the wall-clock ones.
 */
const zoneFormatters = new Map<string, Intl.DateTimeFormat>();

const zoneName = (
  date: Date,
  timeZone: string,
  style: 'longOffset' | 'short' | 'long'
): string => {
  const key = `${timeZone}\u0000${style}`;
  let formatter = zoneFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: style
    });
    zoneFormatters.set(key, formatter);
  }
  const part = formatter
    .formatToParts(date)
    .find(item => item.type === 'timeZoneName');
  return part ? part.value : '';
};

/**
 * A format string with its zone tokens resolved against the display zone.
 *
 * `forFormat` is UTC-backed, so `Z` and `ZZ` reported `+00:00` for every zone,
 * and `z` fell through dayjs as the literal letter — its plugin only fills
 * that in for a `.tz()` object. `format` is a public root prop, so "no format
 * this component uses contains one" was not a property the component could
 * promise. The wall clock was right and only the offset wrong, which is the
 * harder version to notice.
 *
 * Substituted as bracketed literals, and bracketed spans are matched first so
 * an escaped `[Z]` stays the letter Z.
 */
const ZONE_TOKENS = /\[[^\]]*\]|Z{1,2}|z{1,4}/g;

const zoneTokens = (format: string, date: Date, timeZone: string): string => {
  if (!/[Zz]/.test(format)) return format;
  return format.replace(ZONE_TOKENS, token => {
    if (token.startsWith('[')) return token;
    if (token[0] === 'Z') {
      // `GMT+05:30`, or a bare `GMT` for a zero offset in some ICU versions.
      const offset = zoneName(date, timeZone, 'longOffset').replace('GMT', '');
      const padded = offset || '+00:00';
      return `[${token === 'ZZ' ? padded.replace(':', '') : padded}]`;
    }
    return `[${zoneName(date, timeZone, token.length > 3 ? 'long' : 'short')}]`;
  });
};

/** Zero-pads to two digits. Exported: `.TimeField` had its own copy. */
export const pad = (value: number) => String(value).padStart(2, '0');

/**
 * A zoned instant built from wall-clock parts.
 *
 * The only safe way to name a moment in a zone. Arithmetic on a dayjs pinned
 * to the *source* instant's UTC offset carries that offset into periods where it
 * does not apply — which is why
 * `addMonths(1 Apr, -1)` in `America/New_York` used to land on 29 Feb 23:00 and
 * skip March entirely. `dayjs.tz` resolves the offset from the wall clock it is
 * handed, so the day and time asked for are the ones that come back.
 */
/**
 * Days in a month, computed rather than probed.
 *
 * This used to ask dayjs, by parsing an interpolated `YYYY-MM-DD`. The year
 * was not padded, so every year below 1000 failed the strict parse,
 * `daysInMonth()` was `NaN`, and the `NaN` rode `Math.min` into the returned
 * date — an Invalid Date reaching the caller with nothing raised near the
 * cause, surfacing later as a `RangeError` from whoever serialised it.
 */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const daysInMonth = (year: number, monthIndex: number): number =>
  monthIndex === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[monthIndex];

/*
 * `YYYY` is exactly four digits, so the year is padded — and a year it cannot
 * express is refused rather than quietly mangled. Unpadded, a three-digit
 * year failed the strict parse and `dayjs.tz` coerced years under 100 into the
 * 1900s and truncated five-digit ones; both returned something that looked
 * like a date. Throwing here cannot happen from the UI: every path in reaches
 * through a `Date` the host already built.
 *
 * Exact for 1000–9999 in every zone. Below 1000 the wall clock is right
 * without a display zone, but a zone's pre-standard-time offsets are not
 * reliable that far back — a limit of the IANA data, not of this module.
 */
const fromParts = (
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  timeZone?: string
): Date => {
  const iso = `${String(year).padStart(4, '0')}-${pad(monthIndex + 1)}-${pad(day)} ${pad(hour)}:${pad(minute)}`;
  const built = timeZone
    ? dayjs.tz(iso, 'YYYY-MM-DD HH:mm', timeZone)
    : dayjs(iso, 'YYYY-MM-DD HH:mm', true);
  if (!built.isValid()) {
    throw new RangeError(
      `CalendarPreview date adapter: year ${year} is out of range (0001-9999 has to fit four digits)`
    );
  }
  return built.toDate();
};

/**
 * A stable identity for a calendar day, for memo keys and effect deps.
 * Two `Date`s for the same day compare equal here; by reference they never do,
 * which is what forced the old family's lint suppressions.
 */
export function dayKey(date: Date, timeZone?: string): string {
  const w = wallClock(date, timeZone);
  return `${w.year}-${pad(w.month + 1)}-${pad(w.day)}`;
}

export function startOfMonth(date: Date, timeZone?: string): Date {
  const w = wallClock(date, timeZone);
  return fromParts(w.year, w.month, 1, 0, 0, timeZone);
}

/**
 * Month arithmetic on the wall clock, keeping the day of month where the
 * target month has one — `31 Jan + 1` is the 28th or 29th, as dayjs would.
 */
export function addMonths(date: Date, count: number, timeZone?: string): Date {
  const w = wallClock(date, timeZone);
  const absolute = w.month + count;
  const year = w.year + Math.floor(absolute / 12);
  const monthIndex = ((absolute % 12) + 12) % 12;
  return fromParts(
    year,
    monthIndex,
    Math.min(w.day, daysInMonth(year, monthIndex)),
    w.hour,
    w.minute,
    timeZone
  );
}

/** First instant of a month, built from parts rather than parsed. */
export function firstOfMonth(
  year: number,
  monthIndex: number,
  timeZone?: string
): Date {
  return fromParts(year, monthIndex, 1, 0, 0, timeZone);
}

/** Midnight at the start of the day, in the display zone. */
export function startOfDay(date: Date, timeZone?: string): Date {
  const w = wallClock(date, timeZone);
  return fromParts(w.year, w.month, w.day, 0, 0, timeZone);
}

/**
 * The last instant of the day, in the display zone.
 *
 * The next day is resolved through `Date.UTC`, which normalises a day overflow
 * (31 April becomes 1 May) without any zone involved, and only then converted
 * back to a wall clock. Adding a day to an offset-frozen dayjs would drift by
 * an hour across a transition, which is the `addMonths` bug one unit down.
 */
export function endOfDay(date: Date, timeZone?: string): Date {
  const w = wallClock(date, timeZone);
  const next = new Date(Date.UTC(w.year, w.month, w.day + 1));
  const nextStart = fromParts(
    next.getUTCFullYear(),
    next.getUTCMonth(),
    next.getUTCDate(),
    0,
    0,
    timeZone
  );
  return new Date(nextStart.getTime() - 1);
}

export function getHours(date: Date, timeZone?: string): number {
  return wallClock(date, timeZone).hour;
}

export function getMinutes(date: Date, timeZone?: string): number {
  return wallClock(date, timeZone).minute;
}

/**
 * The same calendar day, at a different time of day.
 *
 * Built from calendar parts rather than by mutating a zoned object, which
 * freezes the UTC offset of the instant it is handed. A day's midnight
 * carries the *pre*-transition offset: chaining `.hour(10)` onto 9 Mar 2025 in
 * `America/New_York` built 10:00 at -5, which reads back as 11:00 EDT. Every
 * time after a spring-forward landed an hour late — not just the hour that
 * does not exist — in every DST zone, twice a year.
 *
 * `dayjs.tz` resolves the offset from the wall-clock time it is given, so the
 * hour asked for is the hour that comes back. A time that genuinely does not
 * exist (02:30 on a spring-forward day) resolves forward into the shift, which
 * is the conventional reading and what the grid's own day arithmetic assumes.
 */
export function setTime(
  date: Date,
  hours: number,
  minutes: number,
  timeZone?: string
): Date {
  if (!timeZone) {
    // No zone: dayjs delegates to `Date`, which already handles local DST.
    return dayjs(date)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate();
  }
  return dayjs
    .tz(
      `${dayKey(date, timeZone)} ${pad(hours)}:${pad(minutes)}`,
      'YYYY-MM-DD HH:mm',
      timeZone
    )
    .toDate();
}

/**
 * `date`'s day, wearing `source`'s time of day.
 *
 * A day click and a bare typed date both arrive at midnight, so committing one
 * as-is discards whatever `.TimeField` or a preset put on the value. Every
 * writer that commits a whole day inherits through here, so the three cannot
 * drift into different answers again.
 */
export function withTimeOf(
  date: Date,
  source: Date | null | undefined,
  timeZone?: string
): Date {
  if (!source) return date;
  return setTime(
    date,
    getHours(source, timeZone),
    getMinutes(source, timeZone),
    timeZone
  );
}

export function getYear(date: Date, timeZone?: string): number {
  return wallClock(date, timeZone).year;
}

export function endOfMonth(date: Date, timeZone?: string): Date {
  const nextFirst = addMonths(startOfMonth(date, timeZone), 1, timeZone);
  return new Date(nextFirst.getTime() - 1);
}

export function formatDate(
  date: Date,
  format: string = DEFAULT_FORMAT,
  timeZone?: string
): string {
  return forFormat(date, timeZone).format(
    timeZone ? zoneTokens(format, date, timeZone) : format
  );
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
 * 1-based quarter containing a zero-based month index. Shared with
 * `time-scale.tsx`, which rendered the identical expression for its tick.
 */
export const quarterOfMonth = (monthIndex: number): number =>
  Math.floor(monthIndex / 3) + 1;

/** Months spanned by one period at each granularity. `day` is not a month span. */
const PERIOD_MONTHS: Record<string, number> = {
  month: 1,
  quarter: 3,
  'half-year': 6,
  year: 12
};

/**
 * Months in one period, for a caller that already knows where the period
 * starts. `.MonthGrid` enumerates cells from a year and an index, so it has the
 * start in hand; asking `periodRange` to rediscover it cost an extra wall-clock
 * read and parse per cell — measured at 1.5x the grid build.
 */
export function periodMonths(granularity: string): number {
  return PERIOD_MONTHS[granularity] ?? 1;
}

/**
 * The period containing `date` at a granularity, as a half-open pair.
 *
 * Three writers had each derived these boundaries for themselves — `.MonthGrid`
 * from an index and a wrapping month span, `.Input` and `.RangeInput` from a
 * parse — and they disagreed about which instant a period commits. That
 * disagreement is what let `.MonthGrid` emit a day before `minDate`, and what
 * left range writers unable to compare two periods at all.
 *
 * `end` is the first instant of the *next* period, so a containment test is
 * `start <= x < end` with no inclusive-boundary arithmetic at the call site.
 */
export function periodRange(
  date: Date,
  granularity: string,
  timeZone?: string
): { start: Date; end: Date } {
  if (granularity === 'day') {
    const start = startOfDay(date, timeZone);
    return { start, end: new Date(endOfDay(date, timeZone).getTime() + 1) };
  }
  const months = periodMonths(granularity);
  const w = wallClock(date, timeZone);
  const startMonth = Math.floor(w.month / months) * months;
  const start = firstOfMonth(w.year, startMonth, timeZone);
  const absolute = startMonth + months;
  const end = firstOfMonth(
    w.year + Math.floor(absolute / 12),
    absolute % 12,
    timeZone
  );
  return { start, end };
}

/** First instant of the period containing `date`. */
export function startOfPeriod(
  date: Date,
  granularity: string,
  timeZone?: string
): Date {
  return periodRange(date, granularity, timeZone).start;
}

/** Last instant of the period containing `date`, inclusive. */
export function endOfPeriod(
  date: Date,
  granularity: string,
  timeZone?: string
): Date {
  return new Date(periodRange(date, granularity, timeZone).end.getTime() - 1);
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
  const { year, month } = wallClock(date, timeZone);
  switch (granularity) {
    case 'month':
      return formatDate(date, 'MMM YYYY', timeZone);
    case 'quarter':
      return `Q${quarterOfMonth(month)} ${year}`;
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
export function dayOrdinal(date: Date, timeZone?: string): number {
  const w = wallClock(date, timeZone);
  return w.year * 10000 + (w.month + 1) * 100 + w.day;
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
 * Epoch numbers below this are read as seconds, above it as milliseconds.
 * 1e11 ms is 3 Mar 1973; 1e11 seconds is the year 5138. So the split covers
 * every plausible seconds value and every millisecond value from 1973 on.
 */
const EPOCH_SECONDS_CEILING = 1e11;

/**
 * Best-effort parse for values arriving from outside the component — a
 * serialized query string, an epoch number, an ISO timestamp. Deliberately
 * loose, unlike `parseDate`, which is strict against a display format.
 *
 * Epoch seconds are the most common serialization of an epoch, and `dayjs`
 * reads a bare number as milliseconds — so `1741046400` used to land in
 * January 1970 and come back as a `Date`, leaving the filter to compare
 * against a wrong date rather than decline. Numbers are now split at
 * `EPOCH_SECONDS_CEILING`, by magnitude, so the split is symmetric about the
 * epoch. The cost is a millisecond timestamp within roughly three years of it
 * — late 1966 to early 1973 — which reads as seconds and lands far from where
 * it meant. That was the cheaper of the two errors: the alternative is being
 * silently wrong about every epoch-seconds value a consumer hands us.
 *
 * Only the `number` type is split. A *string* of digits still goes to dayjs,
 * which reads `'1741046400'` as the year 1741 — the same failure in the shape
 * a query string actually arrives in. Left alone deliberately: a bare `'2025'`
 * has to keep parsing as a year, so a digit-string rule needs a length guard
 * and a decision this function should not make on its own.
 */
export function toDateLoose(value: unknown): Date | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const ms = Math.abs(value) < EPOCH_SECONDS_CEILING ? value * 1000 : value;
    const parsed = dayjs(ms);
    return parsed.isValid() ? parsed.toDate() : null;
  }
  if (typeof value !== 'string') return null;
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

/**
 * Whether a bound carries a time of day, or is a plain midnight-anchored day.
 *
 * Asked of the host clock, deliberately, and not of `timeZone`. This is a
 * question about how the bound was *written*, not about how it displays:
 * `maxDate={new Date(2024, 3, 17)}` is the ordinary way to say "the 17th", and
 * that constructor produces midnight in the zone the consumer's code runs in.
 *
 * Asking it in the display zone broke the promise one line down. With the host
 * in UTC and `timeZone="Asia/Kolkata"`, that same `maxDate` is 05:30 IST — not
 * midnight — so it counted as carrying a time, and the bound silently collapsed
 * to "the 17th, but only until 05:30". `.Grid` and `.Input` accepted the whole
 * day while `.TimeField` rejected every hour after dawn.
 */
function hasTimeOfDay(date: Date): boolean {
  const w = wallClock(date);
  return w.hour !== 0 || w.minute !== 0 || w.second !== 0 || w.ms !== 0;
}

/**
 * Bounds for time-of-day editing: the day check every other part applies,
 * plus the bound's own time of day when it has one.
 *
 * `isWithinBounds` alone compares whole days, which is right for the grid and
 * the typed field but useless to `.TimeField` — a `maxDate` of 17 Apr 10:00
 * admits 23:00 on the 17th. A plain instant comparison is wrong in the other
 * direction, and worse: `maxDate={new Date(2024, 3, 17)}` is how a picker is
 * ordinarily bounded, and reading that midnight literally forbids *every*
 * time of day on the last day it allows. Every other part reads a midnight
 * bound as "through the end of that day", so this does too.
 *
 * So the day bound always applies, inclusive at both ends, and a bound that
 * actually names a time additionally constrains within its own day.
 */
export function isWithinTimeBounds(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  timeZone?: string
): boolean {
  if (!isWithinBounds(date, minDate, maxDate, timeZone)) return false;
  const instant = date.getTime();
  if (minDate && hasTimeOfDay(minDate) && instant < minDate.getTime()) {
    return false;
  }
  if (maxDate && hasTimeOfDay(maxDate) && instant > maxDate.getTime()) {
    return false;
  }
  return true;
}
