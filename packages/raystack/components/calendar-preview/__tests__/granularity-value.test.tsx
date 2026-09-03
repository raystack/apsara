import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import {
  dayKey,
  formatForGranularity,
  parseAcrossGranularities,
  parseForGranularity
} from '../date-adapter';

const D = new Date(2026, 5, 15); // 15 June 2026 — Q2, H1
const lastCall = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1];

describe('granularity-aware formatting', () => {
  it('reads the way the reference app reads', () => {
    expect(formatForGranularity(D, 'day')).toBe('15 Jun 2026');
    expect(formatForGranularity(D, 'month')).toBe('Jun 2026');
    expect(formatForGranularity(D, 'quarter')).toBe('Q2 2026');
    expect(formatForGranularity(D, 'half-year')).toBe('H1 2026');
    expect(formatForGranularity(D, 'year')).toBe('2026');
  });

  it('puts each period in the right bucket at the boundaries', () => {
    const jan = new Date(2026, 0, 1);
    const jul = new Date(2026, 6, 1);
    const dec = new Date(2026, 11, 31);
    expect(formatForGranularity(jan, 'quarter')).toBe('Q1 2026');
    expect(formatForGranularity(jul, 'quarter')).toBe('Q3 2026');
    expect(formatForGranularity(dec, 'quarter')).toBe('Q4 2026');
    expect(formatForGranularity(jan, 'half-year')).toBe('H1 2026');
    expect(formatForGranularity(jul, 'half-year')).toBe('H2 2026');
  });

  it('parses back to the first day of the period', () => {
    expect(dayKey(parseForGranularity('Jun 2026', 'month') as Date)).toBe(
      '2026-06-01'
    );
    expect(dayKey(parseForGranularity('Q3 2026', 'quarter') as Date)).toBe(
      '2026-07-01'
    );
    expect(dayKey(parseForGranularity('H2 2026', 'half-year') as Date)).toBe(
      '2026-07-01'
    );
    expect(dayKey(parseForGranularity('2025', 'year') as Date)).toBe(
      '2025-01-01'
    );
  });

  it('rejects text that does not match the active granularity', () => {
    expect(parseForGranularity('15 Jun 2026', 'quarter')).toBeNull();
    expect(parseForGranularity('Q5 2026', 'quarter')).toBeNull();
    expect(parseForGranularity('H3 2026', 'half-year')).toBeNull();
    expect(parseForGranularity('nonsense', 'year')).toBeNull();
  });

  it('shows the period, not a day, in the input', () => {
    render(
      <CalendarPreview defaultGranularity='quarter' value={D}>
        <CalendarPreview.Input />
      </CalendarPreview>
    );
    expect(screen.getByRole('textbox')).toHaveValue('Q2 2026');
  });

  it('hints the pattern for the active granularity when empty', () => {
    render(
      <CalendarPreview defaultGranularity='half-year'>
        <CalendarPreview.Input />
      </CalendarPreview>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'H# YYYY'
    );
  });

  it('commits typed period text', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultGranularity='quarter'
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    await user.type(screen.getByRole('textbox'), 'Q4 2027{Enter}');
    expect(dayKey(lastCall(onValueChange)[0] as Date)).toBe('2027-10-01');
  });
});

describe('onValueChange reports the resolution', () => {
  it('names the granularity that produced the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        defaultGranularity='quarter'
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    await user.click(
      container.querySelectorAll(
        '[data-slot="calendar-preview-month-cell"]'
      )[2] as HTMLElement
    );

    const [value, details] = lastCall(onValueChange);
    expect(dayKey(value as Date)).toBe('2026-07-01');
    expect(details).toEqual({ granularity: 'quarter' });
  });

  it('says day for an ordinary grid pick', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(
      container.querySelector('[data-day="2024-04-17"] button') as HTMLElement
    );
    expect(lastCall(onValueChange)[1]).toEqual({ granularity: 'day' });
  });

  it('reports it through an explicit Apply too', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        commit='explicit'
        defaultGranularity='year'
        minDate={new Date(2024, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.MonthGrid />
        <CalendarPreview.Footer>
          <CalendarPreview.Apply />
        </CalendarPreview.Footer>
      </CalendarPreview>
    );

    await user.click(
      container.querySelector(
        '[data-slot="calendar-preview-month-cell"]'
      ) as HTMLElement
    );
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(lastCall(onValueChange)[1]).toEqual({ granularity: 'year' });
  });
});

describe('cross-granularity parsing', () => {
  const ALL = ['day', 'month', 'quarter', 'half-year', 'year'] as const;

  const typing = (props: Record<string, unknown> = {}) =>
    render(
      <CalendarPreview
        defaultMonth={new Date(2026, 7, 1)}
        granularities={[...ALL]}
        {...props}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

  it('matches the most specific granularity, not merely the first', () => {
    // `15 Jun 2026` must read as a day, never as a year.
    expect(parseAcrossGranularities('15 Jun 2026', ALL)?.granularity).toBe(
      'day'
    );
    expect(parseAcrossGranularities('Q3 2026', ALL)?.granularity).toBe(
      'quarter'
    );
    expect(parseAcrossGranularities('H2 2026', ALL)?.granularity).toBe(
      'half-year'
    );
    expect(parseAcrossGranularities('Jun 2026', ALL)?.granularity).toBe(
      'month'
    );
    expect(parseAcrossGranularities('2026', ALL)?.granularity).toBe('year');
  });

  it('resolves a bare period against the year it is given', () => {
    const match = parseAcrossGranularities(
      'Q4',
      ALL,
      undefined,
      undefined,
      2027
    );
    expect(match?.granularity).toBe('quarter');
    expect(dayKey(match?.date as Date)).toBe('2027-10-01');
  });

  it('switches the tab when the text names another granularity', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    const onValueChange = vi.fn();
    typing({ onGranularityChange, onValueChange });

    await user.type(screen.getByRole('textbox'), 'Q4 2027{Enter}');

    expect(onGranularityChange).toHaveBeenLastCalledWith('quarter');
    const [value, details] = lastCall(onValueChange);
    expect(dayKey(value as Date)).toBe('2027-10-01');
    expect(details).toEqual({ granularity: 'quarter' });
  });

  it('resolves a bare Q against the visible year', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    typing({ onValueChange });

    // The visible month is August 2026, so a bare Q4 means Q4 2026.
    await user.type(screen.getByRole('textbox'), 'Q4{Enter}');
    expect(dayKey(lastCall(onValueChange)[0] as Date)).toBe('2026-10-01');
  });

  it('leaves the tab alone when the active granularity can read the text', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    typing({ onGranularityChange });

    await user.type(screen.getByRole('textbox'), '15 Jun 2026{Enter}');
    expect(onGranularityChange).not.toHaveBeenCalled();
  });

  it('refuses a granularity the picker does not offer', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    const onValidityChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={new Date(2026, 7, 1)}
        onGranularityChange={onGranularityChange}
        onValidityChange={onValidityChange}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    // A day-only picker has no Quarter tab to switch to.
    await user.type(screen.getByRole('textbox'), 'Q4 2027{Enter}');
    expect(onGranularityChange).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

  it('works in the range fields too', async () => {
    const user = userEvent.setup();
    const onGranularityChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={new Date(2026, 7, 1)}
        granularities={[...ALL]}
        onGranularityChange={onGranularityChange}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    await user.type(screen.getByLabelText('Start date'), 'H1 2027{Enter}');
    expect(onGranularityChange).toHaveBeenLastCalledWith('half-year');
  });
});
