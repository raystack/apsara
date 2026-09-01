import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import type {
  CalendarValidity,
  DateRangeValue
} from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const lastArg = <T,>(fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0] as T;

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
