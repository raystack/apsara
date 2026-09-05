/*
 * Turning a typed string into a `ScaleValue` — pure functions, no React, no UI.
 *
 * A scale-aware input accepts more than one shape of date, because the scales
 * are what the user is choosing between: `20/05/2027` is a day, `Q4` is a
 * quarter, `2025` is a year. Parsing therefore decides both the date *and* the
 * scale, and the two are returned together for the same reason the committed
 * value carries its scale.
 *
 * Recognition is deliberately narrow. Every accepted shape is pinned by a
 * regular expression before any date maths runs, so a near-miss is rejected
 * rather than coerced: the failure mode this replaces is dayjs'
 * `customParseFormat`, which is lenient enough to read `20/05/27` as the year
 * 27. Anything not listed below returns `null` and the caller keeps the field's
 * previous value.
 */
import { dayKeyFromParts, isDayKey, monthFromName } from '../date-adapter';
import { anchorOf, periodOf, type ScaleValue } from './scale';

export interface ParseScaleInputOptions {
  /**
   * The year a bare `Q4`, `H1` or `May` resolves into. Defaults to now.
   *
   * See {@link parseScaleInput} for the inference rule.
   */
  referenceDate?: Date;
  /**
   * Which edge of the parsed period to emit — the root's `trailingValue`.
   *
   * @defaultValue false
   */
  trailing?: boolean;
}

/* Day and month accept 1-2 digits so `5/5/2027` works; the year is pinned at
 * exactly 4 so a two-digit year is rejected rather than read as year 27. */
const DAY_SLASHED = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
/* The form `formatDayLabel` renders, so a displayed value types back in. */
const DAY_NAMED = /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/;
const DAY_ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_NAMED = /^([A-Za-z]{3,9})(?:\s+(\d{4}))?$/;
const QUARTER = /^[Qq]([1-4])(?:\s+(\d{4}))?$/;
const HALF_YEAR = /^[Hh]([12])(?:\s+(\d{4}))?$/;
const YEAR = /^(\d{4})$/;

/**
 * Read a typed string as a date at whichever scale it names, or `null`.
 *
 * Accepted shapes — surrounding and repeated whitespace is ignored, and month
 * names are case-insensitive:
 *
 * | Input | Scale | Notes |
 * |---|---|---|
 * | `20/05/2027`, `5/5/2027` | `day` | `dd/MM/yyyy`, day first |
 * | `15 Aug 2026`, `15 August 2026` | `day` | what `formatDayLabel` renders |
 * | `2027-05-20` | `day` | the canonical stored form, so it round-trips |
 * | `May 2027`, `September 2027`, `Sep 2027` | `month` | |
 * | `May` | `month` | year inferred |
 * | `Q4 2026`, `Q4` | `quarter` | |
 * | `H1 2026`, `H1` | `halfYear` | H1 is Jan-Jun, H2 is Jul-Dec |
 * | `2025` | `year` | exactly four digits |
 *
 * **Year inference.** A bare `Q4`, `H1` or `May` resolves inside the *reference
 * year* — the calendar year of `referenceDate`, which defaults to now. The rule
 * never rolls forward: `Q1` typed in December 2026 is Q1 **2026**, not Q1 2027.
 * A "next occurrence" rule would make the same typed string mean different
 * years depending on the day it was typed — `Q1` would change meaning across
 * midnight on 31 December, and a stored value would not agree with the string
 * that produced it after a reload. A user who means another year types it.
 *
 * The returned date is the period's edge under `trailing`, matching what
 * clicking that period in the calendar would commit — so typing `Q4 2026` and
 * clicking Q4 2026 in an end field both yield `2026-12-31`.
 *
 * Rejected, among anything else unrecognised: a two-digit year (`20/05/27`), a
 * month/year pair with no day (`05/2027`), a day that does not exist
 * (`31/04/2027`, `29/02/2027`), and an out-of-range period (`Q5`, `H3`).
 */
export function parseScaleInput(
  input: string,
  options: ParseScaleInputOptions = {}
): ScaleValue | null {
  const { referenceDate, trailing = false } = options;
  const text = input.trim().replace(/\s+/g, ' ');
  if (text === '') return null;

  const slashed = DAY_SLASHED.exec(text);
  if (slashed) {
    const key = dayKeyFromParts(
      Number(slashed[3]),
      Number(slashed[2]),
      Number(slashed[1])
    );
    return key === null ? null : { date: key, scale: 'day' };
  }

  const namedDay = DAY_NAMED.exec(text);
  if (namedDay) {
    const month = monthFromName(namedDay[2]);
    if (month === null) return null;
    const key = dayKeyFromParts(
      Number(namedDay[3]),
      month,
      Number(namedDay[1])
    );
    return key === null ? null : { date: key, scale: 'day' };
  }

  if (DAY_ISO.test(text)) {
    return isDayKey(text) ? { date: text, scale: 'day' } : null;
  }

  const quarter = QUARTER.exec(text);
  if (quarter) {
    const year = yearFrom(quarter[2], referenceDate);
    return at(year, Number(quarter[1]) * 3 - 2, 'quarter', trailing);
  }

  const half = HALF_YEAR.exec(text);
  if (half) {
    const year = yearFrom(half[2], referenceDate);
    return at(year, half[1] === '1' ? 1 : 7, 'halfYear', trailing);
  }

  const year = YEAR.exec(text);
  if (year) {
    return at(Number(year[1]), 1, 'year', trailing);
  }

  const named = MONTH_NAMED.exec(text);
  if (named) {
    const month = monthFromName(named[1]);
    if (month === null) return null;
    return at(yearFrom(named[2], referenceDate), month, 'month', trailing);
  }

  return null;
}

/** The explicit year when the input carried one, else the reference year. */
function yearFrom(matched: string | undefined, reference?: Date): number {
  if (matched !== undefined) return Number(matched);
  return (reference ?? new Date()).getFullYear();
}

/**
 * The value for the period of `scale` that starts in `year`-`month`.
 *
 * `month` is the period's first month, so the first of it always exists and
 * always lands inside the period — the edge maths is then `scale.ts`'s.
 */
function at(
  year: number,
  month: number,
  scale: ScaleValue['scale'],
  trailing: boolean
): ScaleValue | null {
  const inside = dayKeyFromParts(year, month, 1);
  if (inside === null) return null;
  return { date: anchorOf(periodOf(inside, scale), trailing), scale };
}
