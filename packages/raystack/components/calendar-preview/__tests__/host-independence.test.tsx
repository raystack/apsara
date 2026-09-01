import { describe, expect, it } from 'vitest';
import {
  dayKey,
  formatDate,
  getHours,
  getMinutes,
  getYear,
  startOfMonth
} from '../date-adapter';

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
