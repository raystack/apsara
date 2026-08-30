import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

const at = (granularity: string, props: Record<string, unknown> = {}) =>
  render(
    <CalendarPreview
      defaultGranularity={granularity as never}
      minDate={new Date(2023, 0, 1)}
      maxDate={new Date(2025, 11, 31)}
      {...props}
    >
      <CalendarPreview.MonthGrid />
    </CalendarPreview>
  );

describe('CalendarPreview.MonthGrid', () => {
  it('renders nothing for the day granularity', () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    expect(getSlot(container, 'calendar-preview-month-grid')).toBeNull();
  });

  it('groups months under a year heading, three years deep', () => {
    const { container } = at('month');
    expect(
      getAllSlots(container, 'calendar-preview-month-grid-year')
    ).toHaveLength(3);
    // 12 months per year across 2023-2025.
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      36
    );
    expect(screen.getAllByRole('button', { name: 'Jan' })).toHaveLength(3);
  });

  it('renders four quarters per year', () => {
    const { container } = at('quarter');
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      12
    );
    expect(screen.getAllByRole('button', { name: 'Q4' })).toHaveLength(3);
  });

  it('renders two halves per year', () => {
    const { container } = at('half-year');
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      6
    );
    expect(screen.getAllByRole('button', { name: 'H2' })).toHaveLength(3);
  });

  it('renders years as a flat list with no year headings', () => {
    const { container } = at('year');
    expect(
      getAllSlots(container, 'calendar-preview-month-grid-year')
    ).toHaveLength(0);
    expect(getAllSlots(container, 'calendar-preview-month-cell')).toHaveLength(
      3
    );
    expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();
  });

  it('emits the first day of the chosen period', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('quarter', { onValueChange });

    await user.click(screen.getAllByRole('button', { name: 'Q3' })[1]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-07-01');
  });

  it('emits January for a year pick, and June for H2', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = at('year', { onValueChange });
    await user.click(screen.getByRole('button', { name: '2025' }));
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2025-01-01');
    unmount();

    at('half-year', { onValueChange });
    await user.click(screen.getAllByRole('button', { name: 'H2' })[0]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2023-07-01');
  });

  it('marks the selected period', () => {
    const { container } = at('month', { value: new Date(2024, 4, 1) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('May');
  });

  it('writes a range into the active endpoint and respects lock', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', {
      selection: 'range',
      lock: 'from',
      value: { from: new Date(2023, 0, 1), to: null },
      onValueChange
    });

    await user.click(screen.getAllByRole('button', { name: 'Sep' })[1]);
    const next = lastArg(onValueChange) as DateRangeValue;
    expect(dayKey(next.from as Date)).toBe('2023-01-01');
    expect(dayKey(next.to as Date)).toBe('2024-09-01');
  });

  it('disables periods outside the bounds', () => {
    render(
      <CalendarPreview
        defaultGranularity='month'
        minDate={new Date(2024, 5, 1)}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    // The window starts at minDate's year, so January 2024 is offered but out
    // of range.
    expect(screen.getAllByRole('button', { name: 'Jan' })[0]).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: 'Jul' })[0]
    ).not.toBeDisabled();
  });

  it('refuses writes when readOnly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { readOnly: true, onValueChange });
    await user.click(screen.getAllByRole('button', { name: 'Mar' })[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('toggles in multiple selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { selection: 'multiple', onValueChange });

    await user.click(screen.getAllByRole('button', { name: 'Feb' })[0]);
    expect((lastArg(onValueChange) as Date[]).map(d => dayKey(d))).toEqual([
      '2023-02-01'
    ]);
  });

  it('pairs with GranularityTabs to swap grids', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview
        defaultMonth={new Date(2024, 3, 1)}
        granularities={['day', 'month']}
      >
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    expect(getSlot(container, 'calendar-preview-grid')).not.toBeNull();
    expect(getSlot(container, 'calendar-preview-month-grid')).toBeNull();

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    expect(getSlot(container, 'calendar-preview-grid')).toBeNull();
    expect(getSlot(container, 'calendar-preview-month-grid')).not.toBeNull();
  });
});

describe('MonthGrid: third audit', () => {
  it('lights the period containing the value, not only its first day', () => {
    // Picking 17 April in the day grid then switching to Month must not show
    // an empty grid — that reads as lost state.
    const { container } = at('month', { value: new Date(2024, 3, 17) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Apr');
  });

  it('lights the right period at every granularity', () => {
    const midNovember = new Date(2024, 10, 20);
    for (const [granularity, label] of [
      ['month', 'Nov'],
      ['quarter', 'Q4'],
      ['half-year', 'H2'],
      ['year', '2024']
    ] as const) {
      const { container, unmount } = at(granularity, { value: midNovember });
      const selected = container.querySelectorAll(
        '[data-slot="calendar-preview-month-cell"][data-selected]'
      );
      expect(selected, granularity).toHaveLength(1);
      expect(selected[0], granularity).toHaveTextContent(label);
      unmount();
    }
  });

  it('does not bleed a selection into the neighbouring period', () => {
    // 1 July is H2/Q3, never H1/Q2 — an off-by-one in the span maths shows here.
    const { container } = at('quarter', { value: new Date(2024, 6, 1) });
    const selected = container.querySelectorAll(
      '[data-slot="calendar-preview-month-cell"][data-selected]'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Q3');
  });

  it('still emits the period start when a mid-period value is showing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    at('month', { value: new Date(2024, 3, 17), onValueChange });
    await user.click(screen.getAllByRole('button', { name: 'Apr' })[1]);
    expect(dayKey(lastArg(onValueChange) as Date)).toBe('2024-04-01');
  });
});
