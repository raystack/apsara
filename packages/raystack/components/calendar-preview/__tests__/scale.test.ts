import { describe, expect, it } from 'vitest';

import {
  anchorOf,
  convertScale,
  isAvailable,
  isScale,
  periodOf,
  SCALES,
  type Scale
} from '../lib/scale';

const LEADING = false;
const TRAILING = true;

describe('SCALES / isScale', () => {
  it('lists the five scales finest first', () => {
    expect(SCALES).toEqual(['day', 'month', 'quarter', 'halfYear', 'year']);
  });

  it.each(SCALES)('accepts %s', scale => {
    expect(isScale(scale)).toBe(true);
  });

  it.each(['', 'week', 'Day', 'decade'])('rejects %s', value => {
    expect(isScale(value)).toBe(false);
  });
});

describe('periodOf', () => {
  it('makes a day its own period', () => {
    expect(periodOf('2026-08-15', 'day')).toEqual({
      start: '2026-08-15',
      end: '2026-08-15'
    });
  });

  it.each([
    ['2026-08-15', { start: '2026-08-01', end: '2026-08-31' }],
    ['2026-04-30', { start: '2026-04-01', end: '2026-04-30' }],
    ['2026-02-10', { start: '2026-02-01', end: '2026-02-28' }]
  ])('brackets the month containing %s', (day, expected) => {
    expect(periodOf(day, 'month')).toEqual(expected);
  });

  it.each([
    ['2026-01-01', { start: '2026-01-01', end: '2026-03-31' }],
    ['2026-03-31', { start: '2026-01-01', end: '2026-03-31' }],
    ['2026-04-01', { start: '2026-04-01', end: '2026-06-30' }],
    ['2026-07-15', { start: '2026-07-01', end: '2026-09-30' }],
    ['2026-10-01', { start: '2026-10-01', end: '2026-12-31' }],
    ['2026-12-31', { start: '2026-10-01', end: '2026-12-31' }]
  ])('brackets the quarter containing %s', (day, expected) => {
    expect(periodOf(day, 'quarter')).toEqual(expected);
  });

  it.each([
    ['2026-01-01', { start: '2026-01-01', end: '2026-06-30' }],
    ['2026-06-30', { start: '2026-01-01', end: '2026-06-30' }],
    ['2026-07-01', { start: '2026-07-01', end: '2026-12-31' }],
    ['2026-12-31', { start: '2026-07-01', end: '2026-12-31' }]
  ])('splits the half-year at 30 June for %s', (day, expected) => {
    expect(periodOf(day, 'halfYear')).toEqual(expected);
  });

  it.each([
    ['2026-01-01', { start: '2026-01-01', end: '2026-12-31' }],
    ['2026-12-31', { start: '2026-01-01', end: '2026-12-31' }]
  ])('brackets the year containing %s', (day, expected) => {
    expect(periodOf(day, 'year')).toEqual(expected);
  });

  it('accepts a Date and reads its own calendar day', () => {
    expect(periodOf(new Date(2026, 7, 15), 'month')).toEqual({
      start: '2026-08-01',
      end: '2026-08-31'
    });
  });

  it.each([
    '2026-8-15',
    '15/08/2026',
    '2026-02-30',
    ''
  ])('rejects %s as a day', value => {
    expect(() => periodOf(value, 'day')).toThrow(RangeError);
  });
});

describe('periodOf — leap years and month ends', () => {
  it('ends February 2028 on the 29th', () => {
    expect(periodOf('2028-02-10', 'month').end).toBe('2028-02-29');
  });

  it('ends February 2100 on the 28th — a century that is not a leap year', () => {
    expect(periodOf('2100-02-10', 'month').end).toBe('2100-02-28');
  });

  it('ends February 2000 on the 29th — a century that is', () => {
    expect(periodOf('2000-02-10', 'month').end).toBe('2000-02-29');
  });

  it.each([
    ['2027-01-15', '2027-01-31'],
    ['2027-02-15', '2027-02-28'],
    ['2027-04-15', '2027-04-30'],
    ['2027-06-15', '2027-06-30'],
    ['2027-09-15', '2027-09-30'],
    ['2027-12-15', '2027-12-31']
  ])('snaps %s to the real month end %s', (day, end) => {
    expect(periodOf(day, 'month').end).toBe(end);
  });

  it('keeps Q1 ending 31 March in a leap year', () => {
    expect(periodOf('2028-02-29', 'quarter')).toEqual({
      start: '2028-01-01',
      end: '2028-03-31'
    });
  });

  it('keeps the half-year and year edges fixed across a leap year', () => {
    expect(periodOf('2028-02-29', 'halfYear')).toEqual({
      start: '2028-01-01',
      end: '2028-06-30'
    });
    expect(periodOf('2028-02-29', 'year')).toEqual({
      start: '2028-01-01',
      end: '2028-12-31'
    });
  });
});

describe('anchorOf', () => {
  const august = { start: '2026-08-01', end: '2026-08-31' };

  it('emits the first day when leading', () => {
    expect(anchorOf(august, LEADING)).toBe('2026-08-01');
  });

  it('emits the last day when trailing', () => {
    expect(anchorOf(august, TRAILING)).toBe('2026-08-31');
  });
});

describe('convertScale — every direction', () => {
  /*
   * The anchor is 15 August 2026, which sits in August, Q3, H2 and 2026. Every
   * cell is the period of the target scale containing that anchor, read at the
   * stated edge.
   */
  const leading: Record<Scale, string> = {
    day: '2026-08-15',
    month: '2026-08-01',
    quarter: '2026-07-01',
    halfYear: '2026-07-01',
    year: '2026-01-01'
  };
  const trailing: Record<Scale, string> = {
    day: '2026-08-15',
    month: '2026-08-31',
    quarter: '2026-09-30',
    halfYear: '2026-12-31',
    year: '2026-12-31'
  };

  it.each(SCALES)('converts a day at 15 Aug 2026 to %s, leading', to => {
    expect(
      convertScale({ date: '2026-08-15', scale: 'day' }, to, LEADING)
    ).toEqual({ date: leading[to], scale: to });
  });

  it.each(SCALES)('converts a day at 15 Aug 2026 to %s, trailing', to => {
    expect(
      convertScale({ date: '2026-08-15', scale: 'day' }, to, TRAILING)
    ).toEqual({ date: trailing[to], scale: to });
  });

  const pairs = SCALES.flatMap(from => SCALES.map(to => [from, to] as const));

  it.each(pairs)('converts %s -> %s from a leading anchor', (from, to) => {
    const value = convertScale(
      { date: '2026-08-15', scale: 'day' },
      from,
      LEADING
    );
    const converted = convertScale(value, to, LEADING);
    expect(converted.scale).toBe(to);
    expect(converted.date).toBe(anchorOf(periodOf(value.date, to), LEADING));
  });

  it.each(pairs)('converts %s -> %s from a trailing anchor', (from, to) => {
    const value = convertScale(
      { date: '2026-08-15', scale: 'day' },
      from,
      TRAILING
    );
    const converted = convertScale(value, to, TRAILING);
    expect(converted.scale).toBe(to);
    expect(converted.date).toBe(anchorOf(periodOf(value.date, to), TRAILING));
  });

  it('reads the anchor, not the original scale — a month value converts by its date', () => {
    /* 2026-12-31 means "December 2026", and December is in Q4 and H2. */
    const december = { date: '2026-12-31', scale: 'month' as const };
    expect(convertScale(december, 'quarter', TRAILING)).toEqual({
      date: '2026-12-31',
      scale: 'quarter'
    });
    expect(convertScale(december, 'halfYear', LEADING)).toEqual({
      date: '2026-07-01',
      scale: 'halfYear'
    });
  });

  it('snaps a month conversion to a real month end', () => {
    expect(
      convertScale({ date: '2028-02-14', scale: 'day' }, 'month', TRAILING)
    ).toEqual({ date: '2028-02-29', scale: 'month' });
    expect(
      convertScale({ date: '2100-02-14', scale: 'day' }, 'month', TRAILING)
    ).toEqual({ date: '2100-02-28', scale: 'month' });
  });
});

describe('convertScale — round trips', () => {
  it('collapses day -> year -> day onto the year edge, leading', () => {
    const day = { date: '2026-08-15', scale: 'day' as const };
    const year = convertScale(day, 'year', LEADING);
    expect(year).toEqual({ date: '2026-01-01', scale: 'year' });

    const back = convertScale(year, 'day', LEADING);
    expect(back).toEqual({ date: '2026-01-01', scale: 'day' });
    expect(back.date).not.toBe(day.date);
  });

  it('collapses day -> year -> day onto the year edge, trailing', () => {
    const day = { date: '2026-08-15', scale: 'day' as const };
    const year = convertScale(day, 'year', TRAILING);
    expect(year).toEqual({ date: '2026-12-31', scale: 'year' });
    expect(convertScale(year, 'day', TRAILING)).toEqual({
      date: '2026-12-31',
      scale: 'day'
    });
  });

  it.each(SCALES)('round-trips %s -> day -> %s unchanged', scale => {
    for (const trailing of [LEADING, TRAILING]) {
      const start = convertScale(
        { date: '2026-08-15', scale: 'day' },
        scale,
        trailing
      );
      const viaDay = convertScale(start, 'day', trailing);
      expect(convertScale(viaDay, scale, trailing)).toEqual(start);
    }
  });

  it.each(SCALES)('is idempotent when converting %s to itself', scale => {
    for (const trailing of [LEADING, TRAILING]) {
      const once = convertScale(
        { date: '2026-08-15', scale: 'day' },
        scale,
        trailing
      );
      expect(convertScale(once, scale, trailing)).toEqual(once);
    }
  });
});

describe('isAvailable', () => {
  it('is unbounded when neither bound is given', () => {
    expect(isAvailable('1000-01-01', 'day', LEADING)).toBe(true);
    expect(isAvailable('9999-12-31', 'year', TRAILING)).toBe(true);
  });

  describe('the RFC table — an end field bounded at 15 July 2026', () => {
    const min = '2026-07-15';
    const trailing = TRAILING;

    it('disables H1 2026, which emits 30 June', () => {
      expect(periodOf('2026-01-01', 'halfYear').end).toBe('2026-06-30');
      expect(isAvailable('2026-01-01', 'halfYear', trailing, min)).toBe(false);
    });

    it('allows July 2026, which emits 31 July', () => {
      expect(periodOf('2026-07-01', 'month').end).toBe('2026-07-31');
      expect(isAvailable('2026-07-01', 'month', trailing, min)).toBe(true);
    });

    it('allows Q3 2026, which emits 30 September', () => {
      expect(periodOf('2026-07-01', 'quarter').end).toBe('2026-09-30');
      expect(isAvailable('2026-07-01', 'quarter', trailing, min)).toBe(true);
    });

    it('allows August 2026', () => {
      expect(isAvailable('2026-08-01', 'month', trailing, min)).toBe(true);
    });

    it('tests the produced date, not the period start', () => {
      /* Every period above starts before the bound; only the produced date
       * separates them. */
      for (const [day, scale] of [
        ['2026-01-01', 'halfYear'],
        ['2026-07-01', 'month'],
        ['2026-07-01', 'quarter']
      ] as const) {
        expect(periodOf(day, scale).start < min).toBe(true);
      }
    });
  });

  it('agrees with the period-start rule whenever trailing is false', () => {
    const min = '2026-07-15';
    for (const [day, scale] of [
      ['2026-01-01', 'halfYear'],
      ['2026-07-01', 'month'],
      ['2026-07-01', 'quarter'],
      ['2026-08-01', 'month']
    ] as const) {
      expect(isAvailable(day, scale, LEADING, min)).toBe(
        periodOf(day, scale).start >= min
      );
    }
  });

  describe('bounds are inclusive at both edges', () => {
    it('accepts a day exactly on min', () => {
      expect(isAvailable('2026-07-15', 'day', LEADING, '2026-07-15')).toBe(
        true
      );
    });

    it('rejects the day before min', () => {
      expect(isAvailable('2026-07-14', 'day', LEADING, '2026-07-15')).toBe(
        false
      );
    });

    it('accepts a day exactly on max', () => {
      expect(
        isAvailable('2026-07-15', 'day', LEADING, undefined, '2026-07-15')
      ).toBe(true);
    });

    it('rejects the day after max', () => {
      expect(
        isAvailable('2026-07-16', 'day', LEADING, undefined, '2026-07-15')
      ).toBe(false);
    });

    it('accepts a period whose produced date lands exactly on max', () => {
      expect(
        isAvailable('2026-08-10', 'month', TRAILING, undefined, '2026-08-31')
      ).toBe(true);
      expect(
        isAvailable('2026-08-10', 'month', TRAILING, undefined, '2026-08-30')
      ).toBe(false);
    });

    it('accepts a period whose produced date lands exactly on min', () => {
      expect(isAvailable('2026-08-10', 'month', LEADING, '2026-08-01')).toBe(
        true
      );
      expect(isAvailable('2026-08-10', 'month', LEADING, '2026-08-02')).toBe(
        false
      );
    });
  });

  it('applies both bounds together', () => {
    expect(
      isAvailable('2026-08-15', 'day', LEADING, '2026-01-01', '2026-12-31')
    ).toBe(true);
    expect(
      isAvailable('2025-08-15', 'day', LEADING, '2026-01-01', '2026-12-31')
    ).toBe(false);
    expect(
      isAvailable('2027-08-15', 'day', LEADING, '2026-01-01', '2026-12-31')
    ).toBe(false);
  });

  it('can allow a period in a start field and disable it in an end field', () => {
    const max = '2026-08-15';
    expect(isAvailable('2026-08-01', 'month', LEADING, undefined, max)).toBe(
      true
    );
    expect(isAvailable('2026-08-01', 'month', TRAILING, undefined, max)).toBe(
      false
    );
  });

  it('accepts Dates for the value and for either bound', () => {
    expect(
      isAvailable(
        new Date(2026, 7, 15),
        'day',
        LEADING,
        new Date(2026, 0, 1),
        new Date(2026, 11, 31)
      )
    ).toBe(true);
  });

  it('rejects a malformed bound rather than ignoring it', () => {
    expect(() =>
      isAvailable('2026-08-15', 'day', LEADING, '15/08/2026')
    ).toThrow(RangeError);
    expect(() =>
      isAvailable('2026-08-15', 'day', LEADING, undefined, '2026-13-01')
    ).toThrow(RangeError);
  });
});
