import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import type {
  CalendarValidity,
  DateRangeValue
} from '../calendar-preview-context';
import {
  dayKey,
  endOfPeriod,
  periodRange,
  startOfPeriod
} from '../date-adapter';

const lastArg = <T,>(fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0] as T;

/*
 * What each writer commits, and what it does when it cannot. Bounds clamping,
 * period boundaries and range ordering are one subject: every bug here was two
 * writers disagreeing about which instant a selection means.
 */

/*
 * `.MonthGrid` enables a cell when any day in its period is in range, so a
 * mid-month `minDate` does not make the rest of that month unreachable. The
 * value it emitted was still the period's first day, which for that cell is
 * before the bound — and `.Input` then refused the value the field displayed.
 */
describe('.MonthGrid commits inside its bounds', () => {
  const MIN = new Date(2026, 5, 15); // 15 Jun 2026

  const monthPicker = (onValueChange: () => void, extra = {}) =>
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        minDate={MIN}
        maxDate={new Date(2026, 11, 31)}
        onValueChange={onValueChange}
        {...extra}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

  it('leaves a partially valid month selectable', () => {
    monthPicker(vi.fn());
    expect(
      screen.getAllByRole('button', { name: 'Jun' })[0]
    ).not.toBeDisabled();
  });

  it('emits the earliest allowed day, not the period start', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    monthPicker(onValueChange);

    await user.click(screen.getAllByRole('button', { name: 'Jun' })[0]);

    const emitted = lastArg<Date>(onValueChange);
    expect(dayKey(emitted)).toBe('2026-06-15');
    expect(emitted.getTime()).toBeGreaterThanOrEqual(MIN.getTime());
  });

  it('emits the period start for a month wholly in range', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    monthPicker(onValueChange);

    await user.click(screen.getAllByRole('button', { name: 'Aug' })[0]);

    expect(dayKey(lastArg<Date>(onValueChange))).toBe('2026-08-01');
  });

  /*
   * `isDateUnavailable` must be asked about the date the cell emits. Testing
   * the period's first day instead disabled periods the picker could reach —
   * the 1st is unavailable but the 15th, the day it would actually emit, is
   * fine — and passed through unavailable ones in the mirror case.
   */
  it('judges availability by the date it would emit, not the period start', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    // Only 1 Jun is unavailable; the clamped value, 15 Jun, is not.
    const isDateUnavailable = (date: Date) => dayKey(date) === '2026-06-01';
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        minDate={MIN}
        isDateUnavailable={isDateUnavailable}
        onValueChange={onValueChange}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    const jun = screen.getAllByRole('button', { name: 'Jun' })[0];
    expect(jun).not.toBeDisabled();
    await user.click(jun);
    expect(dayKey(lastArg<Date>(onValueChange))).toBe('2026-06-15');
  });

  it('disables a cell whose emitted date is unavailable', () => {
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        minDate={MIN}
        isDateUnavailable={date => dayKey(date) === '2026-06-15'}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    expect(screen.getAllByRole('button', { name: 'Jun' })[0]).toBeDisabled();
  });

  it('reports validity for a non-day pick, which used to stay silent', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        minDate={MIN}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    await user.click(screen.getAllByRole('button', { name: 'Jun' })[0]);

    expect(onValidityChange).toHaveBeenCalled();
    expect(lastArg<CalendarValidity>(onValidityChange).valid).toBe(true);
  });

  it('agrees with .Input about the month it emitted', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        defaultGranularity='month'
        granularities={['month']}
        minDate={MIN}
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.MonthGrid />
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    await user.click(screen.getAllByRole('button', { name: 'Jun' })[0]);
    // The field now shows Jun 2026; committing that same text must be accepted.
    await user.type(screen.getByRole('textbox'), '{Enter}');

    expect(lastArg<CalendarValidity>(onValidityChange).valid).toBe(true);
  });
});

/*
 * `.RangeInput`'s ordering guard compares days, because a bare typed date is
 * midnight while `.TimeField` and presets write a clock time — an instant
 * comparison there deleted the user's start. That left the same-day inversion
 * invisible: it reached `onValueChange` and reported `{valid: true}`.
 */
describe('.RangeInput cannot commit an inverted range', () => {
  const MONTH = new Date(2024, 3, 1);

  const rangePicker = (props: Record<string, unknown>) =>
    render(
      <CalendarPreview selection='range' defaultMonth={MONTH} {...props}>
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

  it('orders a typed end against a timed start on the same day', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangePicker({
      value: { from: new Date(2024, 3, 17, 8, 0), to: null },
      onValueChange
    });

    await user.type(screen.getByLabelText('End date'), '17 Apr 2024{Enter}');

    const next = lastArg<DateRangeValue>(onValueChange);
    // The start survives — the regression finding 03 guarded — *and* the range
    // is ordered, which is the half that assertion never checked.
    expect(next.from).not.toBeNull();
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
    expect((next.to as Date).getTime()).toBeGreaterThanOrEqual(
      (next.from as Date).getTime()
    );
    expect(dayKey(next.to as Date)).toBe('2024-04-17');
  });

  it('still clears the opposite end for a genuine cross-day inversion', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangePicker({
      defaultValue: { from: new Date(2024, 3, 10), to: new Date(2024, 3, 12) },
      onValueChange
    });

    const start = screen.getByLabelText('Start date');
    await user.clear(start);
    await user.type(start, '25 Apr 2024{Enter}');

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2024-04-25');
    expect(next.to).toBeNull();
  });

  /*
   * Inheritance is for days only. Every other granularity resolves to a period
   * start, so carrying a 09:30 onto `Q4 2024` would emit a quarter that begins
   * mid-morning on 1 October.
   */
  it('does not inherit a time when the text names a period', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        granularities={['day', 'quarter']}
        defaultValue={{ from: new Date(2024, 3, 10, 9, 30), to: null }}
        onValueChange={onValueChange}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    const start = screen.getByLabelText('Start date');
    await user.clear(start);
    await user.type(start, 'Q4 2024{Enter}');

    const from = lastArg<DateRangeValue>(onValueChange).from as Date;
    expect(dayKey(from)).toBe('2024-10-01');
    expect(from.getHours()).toBe(0);
    expect(from.getMinutes()).toBe(0);
  });

  it('keeps the time of day a retyped endpoint already had', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangePicker({
      defaultValue: {
        from: new Date(2024, 3, 10, 9, 30),
        to: new Date(2024, 3, 20, 17, 0)
      },
      onValueChange
    });

    const start = screen.getByLabelText('Start date');
    await user.clear(start);
    await user.type(start, '12 Apr 2024{Enter}');

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2024-04-12');
    // 09:30 was put there by `.TimeField`; a retype must not reset it.
    expect((next.from as Date).getHours()).toBe(9);
    expect((next.from as Date).getMinutes()).toBe(30);
  });
});

/*
 * Three writers had each derived period boundaries for themselves, and
 * disagreed about which instant a period commits. These pin the one definition
 * they now share.
 */
describe('periodRange', () => {
  const mid = (y: number, m: number, d = 17) => new Date(y, m, d, 13, 45);

  it('snaps a month to its own first and last instant', () => {
    const { start, end } = periodRange(mid(2026, 5), 'month');
    expect(dayKey(start)).toBe('2026-06-01');
    expect(dayKey(end)).toBe('2026-07-01');
    expect(dayKey(endOfPeriod(mid(2026, 5), 'month'))).toBe('2026-06-30');
  });

  it('snaps any month in a quarter to that quarter', () => {
    for (const month of [3, 4, 5]) {
      expect(dayKey(startOfPeriod(mid(2026, month), 'quarter'))).toBe(
        '2026-04-01'
      );
    }
    expect(dayKey(endOfPeriod(mid(2026, 4), 'quarter'))).toBe('2026-06-30');
  });

  it('snaps a half-year, and rolls the year at its far edge', () => {
    expect(dayKey(startOfPeriod(mid(2026, 8), 'half-year'))).toBe('2026-07-01');
    expect(dayKey(endOfPeriod(mid(2026, 8), 'half-year'))).toBe('2026-12-31');
    // The last period of a year must end on 31 Dec, not spill into January.
    expect(dayKey(periodRange(mid(2026, 11), 'half-year').end)).toBe(
      '2027-01-01'
    );
  });

  it('snaps a year', () => {
    expect(dayKey(startOfPeriod(mid(2026, 8), 'year'))).toBe('2026-01-01');
    expect(dayKey(endOfPeriod(mid(2026, 8), 'year'))).toBe('2026-12-31');
  });

  it('treats a day as its own period', () => {
    expect(dayKey(startOfPeriod(mid(2026, 5), 'day'))).toBe('2026-06-17');
    expect(dayKey(endOfPeriod(mid(2026, 5), 'day'))).toBe('2026-06-17');
    expect(startOfPeriod(mid(2026, 5), 'day').getHours()).toBe(0);
  });

  it('ends each period exactly where the next begins', () => {
    for (const granularity of [
      'day',
      'month',
      'quarter',
      'half-year',
      'year'
    ]) {
      const { end } = periodRange(mid(2026, 4), granularity);
      const last = endOfPeriod(mid(2026, 4), granularity);
      expect(last.getTime()).toBe(end.getTime() - 1);
    }
  });

  /*
   * Resolved on the display zone's clock, not the host's. Every bug this
   * adapter has had — the skipped month, the host-dependent read, the collapsed
   * midnight bound — was a boundary computed against the wrong clock, and an
   * instant that falls in a different year in the two zones is the case that
   * separates them.
   */
  describe('in a display timezone', () => {
    const NY = 'America/New_York';
    // 23:30 on 31 Dec 2025 in New York; already 2026 in UTC.
    const crossover = new Date('2026-01-01T04:30:00Z');
    const reads = (date: Date) =>
      new Intl.DateTimeFormat('en-CA', {
        timeZone: NY,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hourCycle: 'h23'
      }).format(date);

    it('takes the year from the display zone, not from UTC', () => {
      expect(reads(startOfPeriod(crossover, 'year', NY))).toBe(
        '2025-01-01, 00'
      );
      expect(reads(endOfPeriod(crossover, 'year', NY))).toBe('2025-12-31, 23');
    });

    it('resolves the quarter on that same clock', () => {
      expect(reads(startOfPeriod(crossover, 'quarter', NY))).toBe(
        '2025-10-01, 00'
      );
      expect(reads(endOfPeriod(crossover, 'quarter', NY))).toBe(
        '2025-12-31, 23'
      );
    });

    it('bounds a day at that zone’s midnight', () => {
      expect(reads(startOfPeriod(crossover, 'day', NY))).toBe('2025-12-31, 00');
      expect(reads(endOfPeriod(crossover, 'day', NY))).toBe('2025-12-31, 23');
    });
  });
});

/*
 * `.RangeInput` guards ordering and `.TimeField` refuses inversion outright,
 * but `.MonthGrid` had no guard at all: picking Dec against an existing March
 * committed a backwards range that any `from <= x <= to` reader sees as empty.
 */
/*
 * The cell loop builds each period's bounds itself, so the grid has its own
 * path through the zone maths that the adapter tests above do not exercise.
 */
describe('.MonthGrid renders and commits in a display timezone', () => {
  const NY = 'America/New_York';
  const readsNY = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: NY,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23'
    }).format(date);

  it('emits the period start on the display zone clock', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultGranularity='quarter'
        granularities={['quarter']}
        timeZone={NY}
        minDate={new Date(Date.UTC(2026, 0, 1, 12))}
        maxDate={new Date(Date.UTC(2026, 11, 31, 12))}
        onValueChange={onValueChange}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    expect(screen.getAllByRole('button', { name: /^Q\d$/ })).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Q3' }));

    expect(readsNY(lastArg<Date>(onValueChange))).toBe('2026-07-01, 00');
  });
});

describe('.MonthGrid cannot commit a backwards range', () => {
  const rangeGrid = (props: Record<string, unknown>) =>
    render(
      <CalendarPreview
        selection='range'
        defaultGranularity='month'
        granularities={['month']}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        {...props}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

  it('clears the end when a chosen start moves past it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangeGrid({
      value: { from: null, to: new Date(2026, 2, 1) },
      onValueChange
    });

    await user.click(screen.getByRole('button', { name: 'Dec' }));

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2026-12-01');
    expect(next.to).toBeNull();
  });

  it('keeps an ordered pair intact', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangeGrid({
      value: { from: null, to: new Date(2026, 8, 1) },
      onValueChange
    });

    await user.click(screen.getByRole('button', { name: 'Mar' }));

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2026-03-01');
    expect(dayKey(next.to as Date)).toBe('2026-09-01');
  });

  /*
   * `lock` holds one endpoint read-only, and that endpoint is exactly the one an
   * inversion would clear — so under a lock the ordering guard has nothing it
   * may repair. It must refuse rather than delete the endpoint the consumer
   * pinned, which is what the first version of this guard did.
   */
  describe('under a lock', () => {
    const locked = (onValueChange: () => void, onValidityChange: () => void) =>
      render(
        <CalendarPreview
          selection='range'
          defaultGranularity='month'
          granularities={['month']}
          minDate={new Date(2026, 0, 1)}
          maxDate={new Date(2026, 11, 31)}
          lock='from'
          value={{ from: new Date(2026, 8, 1), to: null }}
          onValueChange={onValueChange}
          onValidityChange={onValidityChange}
        >
          <CalendarPreview.MonthGrid />
        </CalendarPreview>
      );

    it('refuses a pick that would invert, keeping the locked endpoint', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onValidityChange = vi.fn();
      locked(onValueChange, onValidityChange);

      await user.click(screen.getByRole('button', { name: 'Mar' }));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(
        lastArg<{ valid: boolean; reason?: string }>(onValidityChange)
      ).toEqual({ valid: false, reason: 'range-order' });
    });

    it('still commits an ordered pick', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const onValidityChange = vi.fn();
      locked(onValueChange, onValidityChange);

      await user.click(screen.getByRole('button', { name: 'Nov' }));

      const next = lastArg<DateRangeValue>(onValueChange);
      expect(dayKey(next.from as Date)).toBe('2026-09-01');
      expect(dayKey(next.to as Date)).toBe('2026-11-01');
    });
  });

  /*
   * By period, not by instant: re-picking the period the other endpoint already
   * sits in is not a contradiction, and clearing it there would discard a
   * selection the user never argued with.
   */
  it('leaves the other endpoint alone when both land in one period', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    rangeGrid({
      value: { from: null, to: new Date(2026, 5, 20) },
      onValueChange
    });

    await user.click(screen.getByRole('button', { name: 'Jun' }));

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2026-06-01');
    expect(next.to).not.toBeNull();
  });
});
