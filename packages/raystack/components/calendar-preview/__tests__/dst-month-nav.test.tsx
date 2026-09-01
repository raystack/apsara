import { describe, expect, it } from 'vitest';
import { addMonths, endOfMonth, startOfMonth } from '../date-adapter';

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
