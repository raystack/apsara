import { describe, expect, it } from 'vitest';

import { parseScaleInput } from '../lib/parse';

/* Fixed so the year-inference tests do not change meaning on 1 January. */
const REFERENCE = new Date(2026, 8, 4); // 4 September 2026
const IN_2026 = { referenceDate: REFERENCE };

describe('parseScaleInput — day', () => {
  it.each([
    ['20/05/2027', '2027-05-20'],
    ['5/5/2027', '2027-05-05'],
    ['05/05/2027', '2027-05-05'],
    ['01/01/2000', '2000-01-01'],
    ['31/12/2026', '2026-12-31']
  ])('reads %s as a day', (input, date) => {
    expect(parseScaleInput(input, IN_2026)).toEqual({ date, scale: 'day' });
  });

  it('reads the canonical stored form, so a value round-trips', () => {
    expect(parseScaleInput('2027-05-20', IN_2026)).toEqual({
      date: '2027-05-20',
      scale: 'day'
    });
  });

  it('accepts 29 February in a leap year', () => {
    expect(parseScaleInput('29/02/2028', IN_2026)).toEqual({
      date: '2028-02-29',
      scale: 'day'
    });
  });

  it('emits the same date at either edge — a day has only one', () => {
    expect(
      parseScaleInput('20/05/2027', { ...IN_2026, trailing: true })
    ).toEqual({ date: '2027-05-20', scale: 'day' });
  });
});

describe('parseScaleInput — month', () => {
  it.each([
    ['May 2027', '2027-05-01'],
    ['September 2027', '2027-09-01'],
    ['Sep 2027', '2027-09-01'],
    ['sep 2027', '2027-09-01'],
    ['DECEMBER 2027', '2027-12-01'],
    ['January 2027', '2027-01-01']
  ])('reads %s as a month, leading', (input, date) => {
    expect(parseScaleInput(input, IN_2026)).toEqual({ date, scale: 'month' });
  });

  it.each([
    ['May 2027', '2027-05-31'],
    ['February 2028', '2028-02-29'],
    ['February 2100', '2100-02-28'],
    ['April 2027', '2027-04-30']
  ])('emits the real month end for %s when trailing', (input, date) => {
    expect(parseScaleInput(input, { ...IN_2026, trailing: true })).toEqual({
      date,
      scale: 'month'
    });
  });
});

describe('parseScaleInput — quarter', () => {
  it.each([
    ['Q1 2026', '2026-01-01', '2026-03-31'],
    ['Q2 2026', '2026-04-01', '2026-06-30'],
    ['Q3 2026', '2026-07-01', '2026-09-30'],
    ['Q4 2026', '2026-10-01', '2026-12-31']
  ])('reads %s at both edges', (input, leading, trailing) => {
    expect(parseScaleInput(input, IN_2026)).toEqual({
      date: leading,
      scale: 'quarter'
    });
    expect(parseScaleInput(input, { ...IN_2026, trailing: true })).toEqual({
      date: trailing,
      scale: 'quarter'
    });
  });

  it('is case-insensitive', () => {
    expect(parseScaleInput('q4 2026', IN_2026)).toEqual({
      date: '2026-10-01',
      scale: 'quarter'
    });
  });
});

describe('parseScaleInput — half-year', () => {
  it.each([
    ['H1 2026', '2026-01-01', '2026-06-30'],
    ['H2 2026', '2026-07-01', '2026-12-31']
  ])('reads %s at both edges', (input, leading, trailing) => {
    expect(parseScaleInput(input, IN_2026)).toEqual({
      date: leading,
      scale: 'halfYear'
    });
    expect(parseScaleInput(input, { ...IN_2026, trailing: true })).toEqual({
      date: trailing,
      scale: 'halfYear'
    });
  });

  it('is case-insensitive', () => {
    expect(parseScaleInput('h2 2026', IN_2026)).toEqual({
      date: '2026-07-01',
      scale: 'halfYear'
    });
  });
});

describe('parseScaleInput — year', () => {
  it('reads a bare four-digit year, leading', () => {
    expect(parseScaleInput('2025', IN_2026)).toEqual({
      date: '2025-01-01',
      scale: 'year'
    });
  });

  it('reads a bare four-digit year, trailing', () => {
    expect(parseScaleInput('2025', { ...IN_2026, trailing: true })).toEqual({
      date: '2025-12-31',
      scale: 'year'
    });
  });
});

/*
 * The rule, stated once: a bare period resolves inside the reference year and
 * never rolls forward. `Q1` typed in September 2026 is Q1 2026 — already past
 * — not Q1 2027.
 */
describe('parseScaleInput — year inference for a bare period', () => {
  it.each([
    ['Q4', { date: '2026-10-01', scale: 'quarter' }],
    ['Q1', { date: '2026-01-01', scale: 'quarter' }],
    ['H1', { date: '2026-01-01', scale: 'halfYear' }],
    ['H2', { date: '2026-07-01', scale: 'halfYear' }],
    ['May', { date: '2026-05-01', scale: 'month' }],
    ['Dec', { date: '2026-12-01', scale: 'month' }]
  ])('resolves %s into the reference year', (input, expected) => {
    expect(parseScaleInput(input, IN_2026)).toEqual(expected);
  });

  it('never rolls forward — a period already past stays in the reference year', () => {
    /* 4 September 2026: Q1 and H1 are both over. */
    expect(parseScaleInput('Q1', IN_2026)?.date).toBe('2026-01-01');
    expect(parseScaleInput('H1', { ...IN_2026, trailing: true })?.date).toBe(
      '2026-06-30'
    );
  });

  it('does not depend on the day within the reference year', () => {
    const firstDay = { referenceDate: new Date(2026, 0, 1) };
    const lastDay = { referenceDate: new Date(2026, 11, 31) };
    expect(parseScaleInput('Q4', firstDay)).toEqual(
      parseScaleInput('Q4', lastDay)
    );
  });

  it('follows the reference year when it moves', () => {
    expect(
      parseScaleInput('Q4', { referenceDate: new Date(2030, 0, 1) })
    ).toEqual({ date: '2030-10-01', scale: 'quarter' });
  });

  it('defaults the reference to now', () => {
    const thisYear = new Date().getFullYear();
    expect(parseScaleInput('Q4')?.date).toBe(`${thisYear}-10-01`);
  });

  it('prefers an explicit year over the inferred one', () => {
    expect(parseScaleInput('Q4 2030', IN_2026)?.date).toBe('2030-10-01');
  });

  it('returns null rather than throwing when the reference year has no key', () => {
    /* A `DayKey` holds four digits. A reference outside that is rejected the
     * same way any other unreadable input is, so the caller keeps its value. */
    expect(
      parseScaleInput('Q4', { referenceDate: new Date(12026, 0, 1) })
    ).toBeNull();
  });
});

describe('parseScaleInput — whitespace', () => {
  it.each([
    '  Q4 2026  ',
    'Q4   2026',
    '\tH1 2026\n',
    ' 20/05/2027 '
  ])('ignores surrounding and repeated whitespace in %j', input => {
    expect(parseScaleInput(input, IN_2026)).not.toBeNull();
  });
});

describe('parseScaleInput — rejections', () => {
  it.each([
    ['', 'empty'],
    ['   ', 'whitespace only'],
    ['tomorrow', 'a word that is not a month'],
    ['Mayy 2027', 'a near-miss month name'],
    ['Sept 2027', 'a four-letter abbreviation date-fns does not use'],
    ['20/05/27', 'a two-digit year — the dayjs leniency this replaces'],
    ['05/2027', 'a month/year pair with no day'],
    ['20/05', 'a day/month pair with no year'],
    ['05/20/2027', 'month-first order, which names month 20'],
    ['32/01/2027', 'a day that is out of range'],
    ['31/04/2027', 'a day that does not exist in that month'],
    ['29/02/2027', '29 February in a common year'],
    ['29/02/2100', '29 February in a non-leap century'],
    ['2027-02-30', 'an ISO day that does not exist'],
    ['2027-13-01', 'an ISO month that does not exist'],
    ['2027-1-1', 'an unpadded ISO day'],
    ['Q0', 'a quarter below the range'],
    ['Q5 2026', 'a quarter above the range'],
    ['H0', 'a half-year below the range'],
    ['H3 2026', 'a half-year above the range'],
    ['999', 'a three-digit year'],
    ['20270', 'a five-digit year'],
    ['May 27', 'a month with a two-digit year'],
    ['Q4 26', 'a quarter with a two-digit year'],
    ['2026 Q4', 'year-first quarter order, which is not accepted'],
    ['Q 4 2026', 'a space inside the quarter token']
  ])('rejects %j — %s', input => {
    expect(parseScaleInput(input, IN_2026)).toBeNull();
  });
});
