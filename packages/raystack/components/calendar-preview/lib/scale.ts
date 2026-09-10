/*
 * The scale maths from RFC 005 — pure functions, no React, no UI.
 *
 * Everything here is expressed in `DayKey`s (`'YYYY-MM-DD'`, timeless). Every
 * date-library call goes through `../date-adapter`; this file makes none of
 * its own.
 */
import {
  type DayKey,
  dayKey,
  endOfMonthKey,
  endOfQuarterKey,
  endOfYearKey,
  isDayKey,
  monthOf,
  startOfMonthKey,
  startOfQuarterKey,
  startOfYearKey
} from '../date-adapter';

/** The granularities a value can be selected at. */
export type Scale = 'day' | 'month' | 'quarter' | 'halfYear' | 'year';

/**
 * A committed selection: a concrete day, plus what that day *means*.
 *
 * The scale travels with the value rather than sitting in a prop, so a stored
 * `{ date: '2026-08-31', scale: 'month' }` still reads back as August 2026 with
 * no calendar mounted — see RFC 005, "The value carries its scale".
 */
export interface ScaleValue {
  date: DayKey;
  scale: Scale;
}

/** The inclusive day span a period covers. */
export interface Period {
  start: DayKey;
  end: DayKey;
}

/** Every scale, finest first. */
export const SCALES: readonly Scale[] = [
  'day',
  'month',
  'quarter',
  'halfYear',
  'year'
];

export function isScale(value: string): value is Scale {
  return (SCALES as readonly string[]).includes(value);
}

/**
 * The period of `scale` that contains `date`.
 *
 * `halfYear` is ours to derive — no date library has it. H1 is January to June,
 * H2 is July to December.
 */
export function periodOf(
  date: Date | DayKey,
  scale: Scale,
  timeZone?: string
): Period {
  const key = toKey(date, timeZone);
  switch (scale) {
    case 'day':
      return { start: key, end: key };
    case 'month':
      return { start: startOfMonthKey(key), end: endOfMonthKey(key) };
    case 'quarter':
      return { start: startOfQuarterKey(key), end: endOfQuarterKey(key) };
    case 'halfYear': {
      /* The four half-year edges exist in every year, leap or not, so the key
       * can be composed from the year segment directly. */
      const year = yearSegment(key);
      return monthOf(key) <= 6
        ? { start: `${year}-01-01`, end: `${year}-06-30` }
        : { start: `${year}-07-01`, end: `${year}-12-31` };
    }
    case 'year':
      return { start: startOfYearKey(key), end: endOfYearKey(key) };
  }
}

/**
 * The single day a period stands for: its last day when `trailing`, its first
 * otherwise.
 *
 * `trailing` is the root's `trailingValue`. A start field emits the leading
 * edge, an end field the trailing one — so the same period yields a different
 * date at each end of a start–end pair.
 */
export function anchorOf(period: Period, trailing: boolean): DayKey {
  return trailing ? period.end : period.start;
}

/**
 * Re-read a value at a different scale: take its date as the anchor, find the
 * period of the target scale containing it, emit that period's edge.
 *
 * Converting outward is lossy and does not undo. `2026-08-15` at `'day'`
 * becomes `2026-01-01` at `'year'` when leading, and back at `'day'` stays
 * `2026-01-01` — the anchor is all that survives.
 */
export function convertScale(
  value: ScaleValue,
  to: Scale,
  trailing: boolean,
  timeZone?: string
): ScaleValue {
  return {
    date: anchorOf(periodOf(value.date, to, timeZone), trailing),
    scale: to
  };
}

/**
 * Whether the period of `scale` containing `value` can be selected.
 *
 * The test is against **the date the period would produce**, not the period's
 * start — so availability depends on `trailing`, and one period can be
 * selectable in a start field and disabled in an end field. With
 * `min = 2026-07-15` and `trailing`, July 2026 (emits 31 Jul) and Q3 2026
 * (emits 30 Sep) are available while H1 2026 (emits 30 Jun) is not. The two
 * rules coincide whenever `trailing` is false.
 *
 * `min` and `max` are inclusive and limit selection only — navigation is
 * never clamped.
 */
export function isAvailable(
  value: Date | DayKey,
  scale: Scale,
  trailing: boolean,
  min?: Date | DayKey,
  max?: Date | DayKey,
  timeZone?: string
): boolean {
  const produced = anchorOf(periodOf(value, scale, timeZone), trailing);
  if (min !== undefined && produced < toKey(min, timeZone)) return false;
  if (max !== undefined && produced > toKey(max, timeZone)) return false;
  return true;
}

function toKey(date: Date | DayKey, timeZone?: string): DayKey {
  if (typeof date !== 'string') return dayKey(date, timeZone);
  if (!isDayKey(date)) {
    throw new RangeError(`Not a YYYY-MM-DD day: ${JSON.stringify(date)}`);
  }
  return date;
}

/** The `YYYY` of a key, as written — not parsed, so it never loses a leading zero. */
function yearSegment(key: DayKey): string {
  return key.slice(0, 4);
}
