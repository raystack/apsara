import { describe, expect, it } from 'vitest';

import {
  dayKey,
  dayKeyFromParts,
  endOfMonthKey,
  formatCaptionLabel,
  formatDayLabel,
  formatMonthLabel,
  isDayKey,
  monthFromName,
  monthOf,
  monthShortNames,
  monthStart,
  parseKey,
  shiftMonths,
  startOfMonthKey,
  toDayKey,
  toInstant,
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

  /* `Date.UTC(0, 0, 1)` means 1900, and a zone-less `dayKey` reads local. */
  const atLocalYear = (year: number): Date => {
    const date = new Date(2000, 0, 1);
    date.setFullYear(year, 0, 1);
    return date;
  };

  const atUtcYear = (year: number): Date => {
    const date = new Date(Date.UTC(2000, 0, 1));
    date.setUTCFullYear(year, 0, 1);
    return date;
  };

  it('keeps year 0 distinct from year 1, and round-trips it', () => {
    expect(dayKey(atLocalYear(0))).toBe('0000-01-01');
    expect(dayKey(atLocalYear(1))).toBe('0001-01-01');
    expect(parseKey(dayKey(atLocalYear(0))).getFullYear()).toBe(0);
    expect(dayKey(atUtcYear(0), 'UTC')).toBe('0000-01-01');
  });

  it('throws rather than return a five-digit key', () => {
    expect(() => dayKey(atLocalYear(10000))).toThrow(RangeError);
    expect(() => dayKey(atUtcYear(10000), 'UTC')).toThrow(RangeError);
    expect(() => dayKey(atUtcYear(10000), 'Asia/Tokyo')).toThrow(RangeError);
  });
});

describe('isDayKey', () => {
  it.each([
    '2026-08-31',
    '2028-02-29',
    '2000-02-29',
    '0001-01-01',
    '0000-01-01'
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

  it('accepts the first year a four-digit key can hold', () => {
    expect(dayKeyFromParts(0, 1, 1)).toBe('0000-01-01');
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
  it('formats a day as DD MMM YYYY', () => {
    expect(formatDayLabel(new Date(2027, 4, 20))).toBe('20 May 2027');
    expect(formatDayLabel(new Date(2027, 0, 5))).toBe('05 Jan 2027');
  });

  it('formats a month in short form', () => {
    expect(formatMonthLabel(new Date(2027, 4, 20))).toBe('May 2027');
    expect(formatMonthLabel(new Date(2027, 8, 1))).toBe('Sep 2027');
  });

  it('formats a caption with the month abbreviated', () => {
    expect(formatCaptionLabel(new Date(2027, 8, 1))).toBe('Sep 2027');
  });

  it('reads the labels in an explicit zone', () => {
    const instant = new Date(Date.UTC(2026, 7, 31, 20, 0));
    expect(formatDayLabel(instant, 'Asia/Tokyo')).toBe('01 Sep 2026');
    expect(formatMonthLabel(instant, 'Asia/Tokyo')).toBe('Sep 2026');
    expect(formatCaptionLabel(instant, 'UTC')).toBe('Aug 2026');
  });
});

describe('monthShortNames', () => {
  it('lists twelve abbreviations, January first', () => {
    const names = monthShortNames();
    expect(names).toHaveLength(12);
    expect(names[0]).toBe('Jan');
    expect(names[11]).toBe('Dec');
  });

  it('round-trips through monthFromName', () => {
    monthShortNames().forEach((name, index) => {
      expect(monthFromName(name)).toBe(index + 1);
    });
  });
});

/* Expected values were captured from `dayjs(v)` in UTC, Asia/Kolkata and
   America/Los_Angeles before the migration. */
describe('toInstant', () => {
  it.each([
    ['an ISO day', '2023-12-01', new Date(2023, 11, 1)],
    ['a year and month', '2023-12', new Date(2023, 11, 1)],
    ['a bare year', '2023', new Date(2023, 0, 1)],
    ['basic ISO', '20231201', new Date(2023, 11, 1)],
    ['a local time', '2023-12-01T10:30:00', new Date(2023, 11, 1, 10, 30)],
    [
      'a space before the time',
      '2023-12-01 10:30',
      new Date(2023, 11, 1, 10, 30)
    ],
    ['a lowercase t', '2023-12-01t10:30:00', new Date(2023, 11, 1, 10, 30)],
    ['slashes', '2023/12/01', new Date(2023, 11, 1)],
    ['an unpadded day', '2023-1-5', new Date(2023, 0, 5)],
    ['an unpadded slashed day', '2023/1/5', new Date(2023, 0, 5)],
    ['a month-first slashed day', '12/01/2023', new Date(2023, 11, 1)],
    [
      'a day-first slashed day, read month-first',
      '01/12/2023',
      new Date(2023, 0, 12)
    ],
    ['a long month name', 'December 1, 2023', new Date(2023, 11, 1)],
    ['a short month name', '1 Dec 2023', new Date(2023, 11, 1)],
    ['a dotted day', '2023.12.01', new Date(2023, 11, 1)],
    ['surrounding whitespace', ' 2023-12-01 ', new Date(2023, 11, 1)],
    ['a Date', new Date(2023, 11, 1), new Date(2023, 11, 1)],
    ['an epoch', Date.UTC(2023, 11, 1), new Date(Date.UTC(2023, 11, 1))],
    ['epoch zero', 0, new Date(0)],
    [
      'a UTC instant',
      '2023-12-01T10:30:00Z',
      new Date(Date.UTC(2023, 11, 1, 10, 30))
    ],
    [
      'microseconds',
      '2023-12-01T10:30:00.123456Z',
      new Date(Date.UTC(2023, 11, 1, 10, 30, 0, 123))
    ],
    [
      'an offset',
      '2023-12-01T10:30:00+05:30',
      new Date(Date.UTC(2023, 11, 1, 5, 0))
    ],
    [
      'a negative offset',
      '2023-11-30T20:00:00-05:00',
      new Date(Date.UTC(2023, 11, 1, 1, 0))
    ],
    [
      'a Date string',
      'Fri Dec 01 2023 00:00:00 GMT+0000',
      new Date(Date.UTC(2023, 11, 1))
    ]
  ])('reads %s as dayjs did', (_label, input, expected) => {
    expect(toInstant(input)?.getTime()).toBe(expected.getTime());
  });

  it.each([
    ['an empty string', ''],
    ['whitespace', '   '],
    ['a non-date string', 'not a date'],
    ['null', null],
    ['an invalid Date', new Date(Number.NaN)],
    ['an object', { date: '2023-12-01' }]
  ])('rejects %s as dayjs did', (_label, input) => {
    expect(toInstant(input)).toBeNull();
  });

  /* dayjs rolled each of these into a neighbouring day or month. */
  it.each([
    ['month 13', '2023-13-01'],
    ['month 0', '2023-00-10'],
    ['day 0', '2023-12-00'],
    ['day 32', '2023-12-32'],
    ['30 February', '2023-02-30'],
    ['an epoch as a string', '1701388800000']
  ])('rejects %s where dayjs rolled it over', (_label, input) => {
    expect(toInstant(input)).toBeNull();
  });

  it.each([
    '2023-02-30',
    '2026-13-01',
    '2023-02-30T00:00:00Z',
    '2026-02-30T12:00:00+05:30'
  ])('rejects the impossible day in %s', input => {
    expect(toInstant(input)).toBeNull();
  });

  it('reads a real day with a zone suffix', () => {
    expect(toInstant('2023-02-28T00:00:00Z')?.getTime()).toBe(
      Date.UTC(2023, 1, 28)
    );
  });

  it('keeps milliseconds from a longer fraction in a local time', () => {
    expect(toInstant('2023/12/01 10:30:00.123456')?.getTime()).toBe(
      new Date(2023, 11, 1, 10, 30, 0, 123).getTime()
    );
  });

  /* dayjs read `undefined` as now, so an unset date filter matched today. */
  it('rejects undefined', () => {
    expect(toInstant(undefined)).toBeNull();
  });

  it('rejects a boolean, which dayjs read as epoch zero', () => {
    expect(toInstant(true)).toBeNull();
  });

  /* dayjs rejected or misread these ISO 8601 forms. */
  it.each([
    ['an ISO week', '2023-W48', new Date(2023, 10, 27)],
    ['an ordinal day', '2023-335', new Date(2023, 11, 1)],
    [
      'a one-digit fraction',
      '2023-12-01T10:30:00.5',
      new Date(2023, 11, 1, 10, 30, 0, 500)
    ],
    [
      'a year below 100',
      '0050-01-01',
      new Date(new Date(0, 0, 1).setFullYear(50))
    ]
  ])('reads %s as ISO 8601', (_label, input, expected) => {
    expect(toInstant(input)?.getTime()).toBe(expected.getTime());
  });
});

describe('toDayKey', () => {
  it('reads the local calendar day', () => {
    expect(toDayKey('2023-12-01')).toBe('2023-12-01');
    expect(toDayKey(new Date(2023, 11, 1, 23, 59))).toBe('2023-12-01');
  });

  it('rejects what toInstant rejects', () => {
    expect(toDayKey('2023-02-30')).toBeNull();
    expect(toDayKey(undefined)).toBeNull();
  });

  it('rejects a year outside four digits', () => {
    expect(toDayKey(new Date(10000, 0, 1))).toBeNull();
  });
});
