/* Pinned by a regex before any date maths — dayjs read `20/05/27` as year 27. */
import { dayKeyFromParts, isDayKey, monthFromName } from '../date-adapter';
import { anchorOf, periodOf, type ScaleValue } from './scale';

export interface ParseScaleInputOptions {
  referenceDate?: Date;
  /** @defaultValue false */
  trailing?: boolean;
}

/* The year is pinned at 4 digits, or `20/05/27` reads as year 27. */
const DAY_SLASHED = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
/* The form `formatDayLabel` renders, so a displayed value types back in. */
const DAY_NAMED = /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/;
const DAY_ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_NAMED = /^([A-Za-z]{3,9})(?:\s+(\d{4}))?$/;
const QUARTER = /^[Qq]([1-4])(?:\s+(\d{4}))?$/;
const HALF_YEAR = /^[Hh]([12])(?:\s+(\d{4}))?$/;
const YEAR = /^(\d{4})$/;

/* Never rolls forward, or a string means different years either side of 31 December. */
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

function yearFrom(matched: string | undefined, reference?: Date): number {
  if (matched !== undefined) return Number(matched);
  return (reference ?? new Date()).getFullYear();
}

/* The period's first month, so its first day always lands inside the period. */
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
