import { describe, expect, it } from 'vitest';
import {
  addMonths,
  DEFAULT_FORMAT,
  dayKey,
  endOfMonth,
  formatDate,
  getHours,
  getMinutes,
  getYear,
  isWithinBounds,
  isWithinTimeBounds,
  parseDate,
  setTime,
  startOfMonth
} from '../date-adapter';

/*
 * Everything zone-shaped in the adapter, in one place. Every defect this
 * component has had here was a clock chosen wrongly — the month built on a
 * frozen offset, the read that depended on the host, the bound whose midnight
 * was measured in the wrong zone — so the cases live together rather than one
 * file per incident.
 */

/*
 * `zoned()` pins a dayjs to the source instant's UTC offset, so `.add(n,
 * 'month')` carried that offset into months where it does not apply: from the
 * 1st at midnight, an hour early falls into the *previous* month. Stepping back
 * from 1 Apr in New York gave 29 Feb 23:00 — March skipped — and stepping
 * forward from 1 Nov gave 30 Nov 23:00, so the button looked dead. Once
 * drifted the anchor never returned to the 1st.
 *
 * `startOf('month')` drifted the same way when the 1st sat on the far side of a
 * transition — Sydney, October 2023, resolved to 30 Sep 23:00. `endOf('month')`
 * did not: a sweep of 418 zones over 2023–2027 found no case where it left the
 * month. It is built from parts here for one construction path, not for a fix,
 * so the assertion below pins its contract rather than a DST defect.
 */
const NY = 'America/New_York';
const SYDNEY = 'Australia/Sydney';

/** The wall-clock month/day/hour a consumer would see in `zone`. */
const reads = (date: Date, zone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(date);

const firstOf = (year: number, month: number, zone: string) =>
  startOfMonth(new Date(Date.UTC(year, month, 15, 12)), zone);

describe('month arithmetic across a DST transition', () => {
  it('steps back from 1 April without skipping March', () => {
    let month = firstOf(2024, 3, NY);
    expect(reads(month, NY)).toBe('2024-04-01, 00');

    month = addMonths(month, -1, NY);
    expect(reads(month, NY)).toBe('2024-03-01, 00');

    month = addMonths(month, -1, NY);
    expect(reads(month, NY)).toBe('2024-02-01, 00');
  });

  it('steps forward from 1 November without stalling', () => {
    let month = firstOf(2024, 10, NY);
    expect(reads(month, NY)).toBe('2024-11-01, 00');

    month = addMonths(month, 1, NY);
    expect(reads(month, NY)).toBe('2024-12-01, 00');
  });

  it('stays on the 1st across a year of steps in both directions', () => {
    let month = firstOf(2024, 0, NY);
    for (let i = 0; i < 12; i += 1) {
      month = addMonths(month, 1, NY);
      expect(reads(month, NY).slice(8, 10)).toBe('01');
    }
    for (let i = 0; i < 12; i += 1) {
      month = addMonths(month, -1, NY);
      expect(reads(month, NY).slice(8, 10)).toBe('01');
    }
    expect(reads(month, NY)).toBe('2024-01-01, 00');
  });

  it('handles a transition that lands on the 1st itself', () => {
    // Sydney moves to DST on 1 Oct 2023, the latent case in startOfMonth.
    const month = startOfMonth(new Date(Date.UTC(2023, 9, 15, 12)), SYDNEY);
    expect(reads(month, SYDNEY)).toBe('2023-10-01, 00');
    expect(reads(addMonths(month, 1, SYDNEY), SYDNEY)).toBe('2023-11-01, 00');
    expect(reads(addMonths(month, -1, SYDNEY), SYDNEY)).toBe('2023-09-01, 00');
  });

  it('keeps the day of month where the target month has one', () => {
    const jan31 = new Date(Date.UTC(2024, 0, 31, 12));
    expect(reads(addMonths(jan31, 1, NY), NY).slice(0, 10)).toBe('2024-02-29');
    expect(reads(addMonths(jan31, 2, NY), NY).slice(0, 10)).toBe('2024-03-31');
  });

  it('ends a month on its last instant, one ms before the next begins', () => {
    const end = endOfMonth(new Date(Date.UTC(2024, 2, 15, 12)), NY);
    expect(reads(end, NY).slice(0, 10)).toBe('2024-03-31');
    expect(endOfMonth(new Date(Date.UTC(2024, 2, 15, 12)), NY).getTime()).toBe(
      startOfMonth(new Date(Date.UTC(2024, 3, 15, 12)), NY).getTime() - 1
    );
  });
});

/*
 * Every read went through dayjs's prototype `.tz()`, which round-trips the
 * instant through `toLocaleString('en-US', { timeZone })` and re-parses that
 * wall clock in the *host* zone. When the target's wall time landed in the
 * host's spring-forward gap the re-parse jumped an hour: 21:00Z is 02:30 in
 * Asia/Kolkata, but a machine in America/New_York read it as 03:30 — so editing
 * only the minute field moved the value by 75 minutes.
 *
 * These assertions are absolute rather than relative, so they fail on any host
 * whose zone leaks into the answer. `TZ` is fixed per Vitest process, so the
 * cross-host comparison itself lives in the script this pins.
 */
const IST = 'Asia/Kolkata';

// 2024-03-09T21:00Z — inside the US spring-forward gap when read as local.
const GAP = new Date('2024-03-09T21:00:00Z');

describe('reads do not depend on the host timezone', () => {
  it('reads the target wall clock across a foreign DST gap', () => {
    expect(getHours(GAP, IST)).toBe(2);
    expect(getMinutes(GAP, IST)).toBe(30);
    expect(dayKey(GAP, IST)).toBe('2024-03-10');
    expect(getYear(GAP, IST)).toBe(2024);
  });

  it('formats that instant in the target zone', () => {
    expect(formatDate(GAP, 'DD MMM YYYY HH:mm', IST)).toBe('10 Mar 2024 02:30');
  });

  it('anchors the month from the target wall clock, not the host', () => {
    // 2024-01-31T20:00Z is 01:30 on 1 Feb in IST — a different month than UTC.
    const crossover = new Date('2024-01-31T20:00:00Z');
    expect(dayKey(crossover, IST)).toBe('2024-02-01');
    expect(dayKey(startOfMonth(crossover, IST), IST)).toBe('2024-02-01');
  });

  /*
   * `maxDate={new Date(2024, 3, 17)}` is the ordinary way to say "the 17th",
   * and the adapter promises it allows every time of day on that date. Whether
   * a bound "has a time of day" was being asked of the *display* zone, where
   * host midnight is 05:30 — so the bound silently collapsed to "the 17th, but
   * only until dawn" and `.TimeField` rejected every hour after it while
   * `.Grid` and `.Input` accepted the whole day.
   */
  it('reads a bare day bound as the whole day in any display zone', () => {
    const maxDate = new Date(2024, 3, 17);
    const nineIST = new Date(Date.UTC(2024, 3, 17, 3, 30));

    expect(isWithinBounds(nineIST, undefined, maxDate, IST)).toBe(true);
    expect(isWithinTimeBounds(nineIST, undefined, maxDate, IST)).toBe(true);
  });

  it('still honours a bound that names a real time of day', () => {
    // Authored with a time, so it constrains within its own day.
    const maxDate = new Date(2024, 3, 17, 10, 0);
    const beforeIt = new Date(2024, 3, 17, 9, 0);
    const afterIt = new Date(2024, 3, 17, 11, 0);

    expect(isWithinTimeBounds(beforeIt, undefined, maxDate)).toBe(true);
    expect(isWithinTimeBounds(afterIt, undefined, maxDate)).toBe(false);
  });

  it('handles a half-hour-offset zone through a transition', () => {
    // Lord Howe runs at +10:30 before its 1 Oct shift, so 14:45Z is 01:15 local
    // — a half-hour offset no host zone shares.
    const lh = 'Australia/Lord_Howe';
    const instant = new Date('2023-09-30T14:45:00Z');
    expect(getHours(instant, lh)).toBe(1);
    expect(getMinutes(instant, lh)).toBe(15);
    expect(dayKey(instant, lh)).toBe('2023-10-01');
  });
});

/*
 * Moved here from `audit-fixed.test.tsx`, which collected findings by the
 * number they were reported under. Each assertion is unchanged; only its home
 * is, so a failure lands beside the behaviour it describes.
 */
/*
 * Regressions that arrived from review passes rather than from the spec.
 * Each assertion sits with the behaviour it guards; which pass found it is
 * history, not structure.
 */
describe('regressions', () => {
  it('isWithinBounds resolves the day in the zone it is given', () => {
    // 23:00 UTC on 17 Apr is already 08:00 on the 18th in Tokyo.
    const instant = new Date(Date.UTC(2024, 3, 17, 23, 0));
    const max = new Date(Date.UTC(2024, 3, 17, 12, 0));

    expect(isWithinBounds(instant, undefined, max, 'UTC')).toBe(true);
    expect(isWithinBounds(instant, undefined, max, 'Asia/Tokyo')).toBe(false);
  });

  it('parseDate returns null, never throws, when a timeZone is set', () => {
    // dayjs.tz does not validate — it throws RangeError on bad input, which
    // would crash the input on an ordinary keystroke.
    expect(() => parseDate('not a date', 'DD MMM YYYY', 'UTC')).not.toThrow();
    expect(parseDate('not a date', 'DD MMM YYYY', 'UTC')).toBeNull();
    expect(parseDate('2024-04-17', 'DD MMM YYYY', 'UTC')).toBeNull();
    expect(
      dayKey(parseDate('17 Apr 2024', 'DD MMM YYYY', 'UTC') as Date, 'UTC')
    ).toBe('2024-04-17');
  });
});

describe('setTime survives a daylight-saving shift', () => {
  const TZ = 'America/New_York';
  // 9 Mar 2025: EST -> EDT at 02:00, so 02:00-02:59 never happens.
  const shiftDay = parseDate('09 Mar 2025', DEFAULT_FORMAT, TZ) as Date;

  it.each([
    [1, 30],
    [3, 0],
    [10, 0],
    [23, 45]
  ])('returns %i:%i as asked', (hours, minutes) => {
    const result = setTime(shiftDay, hours, minutes, TZ);
    expect(getHours(result, TZ)).toBe(hours);
    expect(getMinutes(result, TZ)).toBe(minutes);
  });

  it('resolves a time that does not exist forward into the shift', () => {
    const result = setTime(shiftDay, 2, 30, TZ);
    expect(getHours(result, TZ)).toBe(3);
    expect(getMinutes(result, TZ)).toBe(30);
  });

  it('stays on the day it was handed', () => {
    expect(dayKey(setTime(shiftDay, 23, 45, TZ), TZ)).toBe('2025-03-09');
  });

  it('holds on the autumn shift too', () => {
    // 2 Nov 2025: 01:00-01:59 happens twice; either instant reads back as 1.
    const fallBack = parseDate('02 Nov 2025', DEFAULT_FORMAT, TZ) as Date;
    expect(getHours(setTime(fallBack, 1, 30, TZ), TZ)).toBe(1);
    expect(getHours(setTime(fallBack, 10, 0, TZ), TZ)).toBe(10);
  });
});
