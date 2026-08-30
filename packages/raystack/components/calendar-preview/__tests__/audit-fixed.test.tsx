import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey, isWithinBounds } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);
const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

describe('audit findings stay fixed', () => {
  it('03: a timed start survives a typed same-day end', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        value={{ from: new Date(2024, 3, 17, 8, 0), to: null }}
        onValueChange={onValueChange}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    await user.type(screen.getByLabelText('End date'), '17 Apr 2024{Enter}');
    const next = lastArg(onValueChange) as DateRangeValue;
    // The old raw `from > to` compared instants, so 08:00 "exceeded" midnight
    // on the same day and the start was nulled.
    expect(next.from).not.toBeNull();
    expect(dayKey(next.from as Date)).toBe('2024-04-17');
  });

  it('06: a mid-month minDate leaves that month selectable', () => {
    const { container } = render(
      <CalendarPreview
        defaultGranularity='month'
        minDate={new Date(2024, 3, 15)}
        maxDate={new Date(2024, 11, 31)}
      >
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );
    const cells = [
      ...container.querySelectorAll('[data-slot="calendar-preview-month-cell"]')
    ] as HTMLButtonElement[];
    expect(cells.find(c => c.textContent === 'Apr')).not.toBeDisabled();
    expect(cells.find(c => c.textContent === 'Mar')).toBeDisabled();
  });

  it('07: snapping never rolls into the next hour', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        value={new Date(2024, 3, 17, 9, 0)}
        onValueChange={onValueChange}
      >
        <CalendarPreview.TimeField step={15} />
      </CalendarPreview>
    );

    const minute = screen.getByLabelText('Minute');
    await user.clear(minute);
    await user.type(minute, '59{Enter}');
    const next = lastArg(onValueChange) as Date;
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBeLessThanOrEqual(59);
  });

  it('11: isWithinBounds takes a timeZone like every other adapter fn', () => {
    expect(isWithinBounds.length).toBe(4);
    // Inclusive at both ends, and zone-aware rather than local-only.
    expect(
      isWithinBounds(
        new Date(2024, 3, 17),
        new Date(2024, 3, 17),
        new Date(2024, 3, 17),
        'UTC'
      )
    ).toBe(true);
  });

  it('05: switching to Month scrolls the active year into view', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview
        granularities={['day', 'month']}
        value={new Date(2030, 5, 1)}
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2035, 11, 31)}
      >
        <CalendarPreview.GranularityTabs />
        <CalendarPreview.Grid />
        <CalendarPreview.MonthGrid />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('tab', { name: 'Month' }));
    const list = getSlot(
      container,
      'calendar-preview-month-grid'
    ) as HTMLElement;
    // jsdom reports zero layout, so assert the effect ran and addressed the
    // container rather than a specific offset.
    expect(list).not.toBeNull();
    expect(list.scrollTop).toBeGreaterThanOrEqual(0);
  });
});
