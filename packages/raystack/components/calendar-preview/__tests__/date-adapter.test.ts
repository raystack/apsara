import { describe, expect, it } from 'vitest';

import {
  dayKey,
  dayKeyFromParts,
  endOfMonthKey,
  endOfQuarterKey,
  endOfYearKey,
  epoch,
  formatCaptionLabel,
  formatDayLabel,
  formatMonthLabel,
  isDayKey,
  monthFromName,
  monthNames,
  monthOf,
  monthStart,
  parseKey,
  shiftMonths,
  startOfMonthKey,
  startOfQuarterKey,
  startOfYearKey,
  yearOf
} from '../date-adapter';

describe('dayKey', () => {
  it('reads the calendar day from the date own fields', () => {
    expect(dayKey(new Date(2026, 7, 31, 23, 30))).toBe('2026-08-31');
    expect(dayKey(new Date(2026, 7, 31, 0, 0))).toBe('2026-08-31');
  });

  it('pads a single-digit month and day', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('reads the day in an explicit zone', () => {
    /* 20:00 UTC on 31 August is already 1 September in Tokyo. */
    const instant = new Date(Date.UTC(2026, 7, 31, 20, 0));
    expect(dayKey(instant, 'UTC')).toBe('2026-08-31');
    expect(dayKey(instant, 'Asia/Tokyo')).toBe('2026-09-01');
    expect(dayKey(instant, 'America/New_York')).toBe('2026-08-31');
  });
});

describe('epoch', () => {
  it('is the instant in milliseconds', () => {
    const date = new Date(Date.UTC(2026, 7, 31, 20, 0));
    expect(epoch(date)).toBe(date.getTime());
    expect(epoch(date)).toBe(Date.UTC(2026, 7, 31, 20, 0));
  });
});

describe('isDayKey', () => {
  it.each([
    '2026-08-31',
    '2028-02-29',
    '2000-02-29',
    '0001-01-01'
  ])('accepts %s', key => {
    expect(isDayKey(key)).toBe(true);
  });

  it.each([
    '',
    '2026-8-31',
    '2026/08/31',
    '31-08-2026',
    '2026-08-31T00:00:00Z',
    '2026-13-01',
    '2026-00-01',
    '2026-08-32',
    '2027-02-29',
    '2100-02-29'
  ])('rejects %j', key => {
    expect(isDayKey(key)).toBe(false);
  });
});

describe('parseKey', () => {
  it('returns local midnight on the named day', () => {
    const date = parseKey('2026-08-31');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(31);
    expect(date.getHours()).toBe(0);
  });

  it('round-trips with dayKey', () => {
    for (const key of ['2026-08-31', '2028-02-29', '2026-01-01']) {
      expect(dayKey(parseKey(key))).toBe(key);
    }
  });

  it('throws on a malformed key', () => {
    expect(() => parseKey('31/08/2026')).toThrow(RangeError);
  });

  it('throws on a well-shaped day that does not exist', () => {
    expect(() => parseKey('2027-02-29')).toThrow(RangeError);
  });
});

describe('dayKeyFromParts', () => {
  it('builds a key from 1-indexed months', () => {
    expect(dayKeyFromParts(2026, 8, 31)).toBe('2026-08-31');
    expect(dayKeyFromParts(2026, 1, 5)).toBe('2026-01-05');
  });

  it('validates against the real calendar rather than rolling forward', () => {
    expect(dayKeyFromParts(2027, 4, 31)).toBeNull();
    expect(dayKeyFromParts(2027, 2, 29)).toBeNull();
    expect(dayKeyFromParts(2028, 2, 29)).toBe('2028-02-29');
  });

  it.each([
    [2026.5, 8, 31],
    [-1, 8, 31],
    [10000, 8, 31],
    [2026, 8.5, 31],
    [2026, 8, 31.5],
    [2026, 13, 1],
    [2026, 0, 1],
    [2026, 8, 0],
    [2026, 100, 1]
  ])('rejects (%s, %s, %s)', (year, month, day) => {
    expect(dayKeyFromParts(year, month, day)).toBeNull();
  });
});

describe('period key helpers', () => {
  it('brackets a month, leap-correct', () => {
    expect(startOfMonthKey('2028-02-14')).toBe('2028-02-01');
    expect(endOfMonthKey('2028-02-14')).toBe('2028-02-29');
    expect(endOfMonthKey('2100-02-14')).toBe('2100-02-28');
  });

  it('brackets a quarter', () => {
    expect(startOfQuarterKey('2026-08-15')).toBe('2026-07-01');
    expect(endOfQuarterKey('2026-08-15')).toBe('2026-09-30');
  });

  it('brackets a year', () => {
    expect(startOfYearKey('2026-08-15')).toBe('2026-01-01');
    expect(endOfYearKey('2026-08-15')).toBe('2026-12-31');
  });
});

describe('key accessors', () => {
  it('reads the year and month without parsing', () => {
    expect(yearOf('2026-08-31')).toBe(2026);
    expect(monthOf('2026-08-31')).toBe(8);
    expect(monthOf('2026-01-31')).toBe(1);
  });
});

describe('monthFromName', () => {
  it.each([
    ['January', 1],
    ['Jan', 1],
    ['jan', 1],
    ['May', 5],
    ['September', 9],
    ['Sep', 9],
    ['DECEMBER', 12]
  ])('reads %s as month %i', (name, month) => {
    expect(monthFromName(name)).toBe(month);
  });

  it.each(['', 'Sept', 'Mayy', 'Foo', '05'])('rejects %j', name => {
    expect(monthFromName(name)).toBeNull();
  });
});

describe('shiftMonths', () => {
  it('moves whole months and lands on the first', () => {
    expect(dayKey(shiftMonths(new Date(2026, 7, 15), 1))).toBe('2026-09-01');
    expect(dayKey(shiftMonths(new Date(2026, 7, 15), -1))).toBe('2026-07-01');
    expect(dayKey(shiftMonths(new Date(2026, 7, 15), 0))).toBe('2026-08-01');
  });

  it('crosses a year boundary in both directions', () => {
    expect(dayKey(shiftMonths(new Date(2026, 11, 10), 1))).toBe('2027-01-01');
    expect(dayKey(shiftMonths(new Date(2026, 0, 10), -1))).toBe('2025-12-01');
  });

  /* Stepping from the 31st would otherwise clamp to the 28th and stay there. */
  it('does not drift when stepping repeatedly from a long month', () => {
    let month = new Date(2026, 0, 31);
    for (let step = 0; step < 3; step += 1) month = shiftMonths(month, 1);
    expect(dayKey(month)).toBe('2026-04-01');
  });
});

describe('monthStart', () => {
  it('builds the first of a month from a 0-indexed month', () => {
    expect(dayKey(monthStart(2026, 0))).toBe('2026-01-01');
    expect(dayKey(monthStart(2026, 11))).toBe('2026-12-01');
  });
});

describe('label formatters', () => {
  it('formats a day as DD/MM/YYYY', () => {
    expect(formatDayLabel(new Date(2027, 4, 20))).toBe('20/05/2027');
    expect(formatDayLabel(new Date(2027, 0, 5))).toBe('05/01/2027');
  });

  it('formats a month in short form', () => {
    expect(formatMonthLabel(new Date(2027, 4, 20))).toBe('May 2027');
    expect(formatMonthLabel(new Date(2027, 8, 1))).toBe('Sep 2027');
  });

  it('formats a caption with the month spelled out', () => {
    expect(formatCaptionLabel(new Date(2027, 8, 1))).toBe('September 2027');
  });

  it('reads the labels in an explicit zone', () => {
    const instant = new Date(Date.UTC(2026, 7, 31, 20, 0));
    expect(formatDayLabel(instant, 'Asia/Tokyo')).toBe('01/09/2026');
    expect(formatMonthLabel(instant, 'Asia/Tokyo')).toBe('Sep 2026');
    expect(formatCaptionLabel(instant, 'UTC')).toBe('August 2026');
  });
});

describe('monthNames', () => {
  it('lists twelve names, January first', () => {
    const names = monthNames();
    expect(names).toHaveLength(12);
    expect(names[0]).toBe('January');
    expect(names[11]).toBe('December');
  });

  /* The caption column and the input parser must never disagree about a name. */
  it('round-trips through monthFromName', () => {
    monthNames().forEach((name, index) => {
      expect(monthFromName(name)).toBe(index + 1);
    });
  });
});
