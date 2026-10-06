import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { toDayKey, toInstant } from '../date-filters';

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
    ['epoch zero', 0, new Date(0)],
    [
      'microseconds',
      '2023-12-01T10:30:00.123456Z',
      new Date(Date.UTC(2023, 11, 1, 10, 30, 0, 123))
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

  /* Outside the ISO and local shapes, `new Date` reads the string, as it did
     under dayjs, and rolls an impossible day over. */
  it.each([
    ['02/30/2014', new Date(2014, 2, 2)],
    ['February 30, 2026', new Date(2026, 2, 2)]
  ])('reads %s as new Date does', (input, expected) => {
    expect(toInstant(input)?.getTime()).toBe(expected.getTime());
  });

  it('reads an object with a numeric valueOf as its timestamp', () => {
    const time = Date.UTC(2026, 7, 15, 12);
    expect(toInstant({ valueOf: () => time })?.getTime()).toBe(time);
  });

  it.each([
    ['an object without a numeric valueOf', { valueOf: () => 'x' }],
    ['an object with no prototype', Object.create(null)],
    ['an invalid dayjs', dayjs('')],
    /* dayjs read `undefined` as now, so an unset date filter matched today. */
    ['undefined', undefined],
    /* dayjs read a boolean as epoch zero. */
    ['true', true]
  ])('rejects %s', (_label, input) => {
    expect(toInstant(input)).toBeNull();
  });

  it.each([
    ['02/29/2024', new Date(2024, 1, 29)],
    ['2-28-2026', new Date(2026, 1, 28)],
    ['Sept 30, 2026', new Date(2026, 8, 30)],
    ['Monday, March 2, 2026', new Date(2026, 2, 2)],
    ['Dec 2023', new Date(2023, 11, 1)],
    ['Fri, 01 Dec 2023 00:00:00 GMT', new Date(Date.UTC(2023, 11, 1))],
    [
      'Fri Dec 01 2023 02:00:00 GMT+0530',
      new Date(Date.UTC(2023, 10, 30, 20, 30))
    ],
    ['Nov 30 2026 23:00 EST', new Date(Date.UTC(2026, 11, 1, 4))],
    ['Dec 1 2026 01:00 EST', new Date(Date.UTC(2026, 11, 1, 6))]
  ])('reads the real day in %s as dayjs did', (input, expected) => {
    expect(toInstant(input)?.getTime()).toBe(expected.getTime());
  });

  it('keeps milliseconds from a longer fraction in a local time', () => {
    expect(toInstant('2023/12/01 10:30:00.123456')?.getTime()).toBe(
      new Date(2023, 11, 1, 10, 30, 0, 123).getTime()
    );
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

/* Safari before 16.4 throws on a lookbehind when the module loads. */
it('uses no regex lookbehind', () => {
  const source = readFileSync(resolve(__dirname, '../date-filters.ts'), 'utf8');
  expect(source).not.toMatch(/\(\?<[=!]/);
});

describe('toDayKey', () => {
  it('reads the local calendar day', () => {
    expect(toDayKey('2023-12-01')).toBe('2023-12-01');
    expect(toDayKey(new Date(2023, 11, 1, 23, 59))).toBe('2023-12-01');
  });

  it('rejects a year outside four digits', () => {
    expect(toDayKey(new Date(10000, 0, 1))).toBeNull();
  });
});
