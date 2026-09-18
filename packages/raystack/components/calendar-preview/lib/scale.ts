/*
 * The scale maths from RFC 005 — pure functions, no React, no UI.
 *
 * Everything here is expressed in `DayKey`s (`'YYYY-MM-DD'`, timeless), so
 * none of it takes a zone. Callers convert at their own boundary. Every
 * date-library call goes through `../date-adapter`; this file makes none.
 */
import {
  type DayKey,
  endOfMonthKey,
  isDayKey,
  monthOf,
  startOfMonthKey
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
export function periodOf(date: DayKey, scale: Scale): Period {
  const key = requireKey(date);
  if (scale === 'day') return { start: key, end: key };
  /* A month's last day is the only edge that moves with the calendar. */
  if (scale === 'month') {
    return { start: startOfMonthKey(key), end: endOfMonthKey(key) };
  }
  const year = key.slice(0, 4);
  const [start, end] = FIXED_EDGES[scale](monthOf(key));
  return { start: `${year}-${start}`, end: `${year}-${end}` };
}

const QUARTERS: readonly (readonly [string, string])[] = [
  ['01-01', '03-31'],
  ['04-01', '06-30'],
  ['07-01', '09-30'],
  ['10-01', '12-31']
];

const FIXED_EDGES: Record<
  Exclude<Scale, 'day' | 'month'>,
  (month: number) => readonly [string, string]
> = {
  quarter: month => QUARTERS[Math.floor((month - 1) / 3)],
  halfYear: month => (month <= 6 ? ['01-01', '06-30'] : ['07-01', '12-31']),
  year: () => ['01-01', '12-31']
};

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
  trailing: boolean
): ScaleValue {
  return { date: anchorOf(periodOf(value.date, to), trailing), scale: to };
}

export interface AvailabilityOptions {
  trailing?: boolean;
  min?: DayKey;
  max?: DayKey;
}

/**
 * Whether the period of `scale` containing `date` can be selected.
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
  date: DayKey,
  scale: Scale,
  { trailing = false, min, max }: AvailabilityOptions = {}
): boolean {
  const produced = anchorOf(periodOf(date, scale), trailing);
  if (min !== undefined && produced < requireKey(min)) return false;
  if (max !== undefined && produced > requireKey(max)) return false;
  return true;
}

function requireKey(key: DayKey): DayKey {
  if (!isDayKey(key)) {
    throw new RangeError(`Not a YYYY-MM-DD day: ${JSON.stringify(key)}`);
  }
  return key;
}
