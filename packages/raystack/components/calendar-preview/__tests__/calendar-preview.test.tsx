import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import styles from '../calendar-preview.module.css';
import type { DateRangeValue } from '../calendar-preview-context';

/** The day button for an ISO date, via the grid's `data-day` attribute. */
const day = (c: HTMLElement, iso: string) =>
  c.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

import {
  DEFAULT_FORMAT,
  dayKey,
  formatDate,
  isWithinBounds,
  parseDate,
  startOfMonth,
  toDateLoose
} from '../date-adapter';

const MONTH = new Date(2024, 3, 1);

const inline = (props = {}) => (
  <CalendarPreview defaultMonth={MONTH} {...props}>
    <CalendarPreview.Grid />
  </CalendarPreview>
);

/*
 * Query days by react-day-picker's `data-day`, not by accessible name — the
 * name is a full localized date ("Wednesday, April 17th, 2024"), so a bare
 * /17/ would also match a 2017 in the string.
 */
const dayCell = (container: HTMLElement, iso: string) =>
  container.querySelector(`[data-day="${iso}"]`) as HTMLElement;

const dayButton = (container: HTMLElement, iso: string) =>
  dayCell(container, iso).querySelector('button') as HTMLButtonElement;

describe('CalendarPreview root', () => {
  it('selects a date and reports it uncontrolled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(inline({ onValueChange }));

    await user.click(dayButton(container, '2024-04-17'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [selected] = onValueChange.mock.calls[0];
    expect(dayKey(selected as Date)).toBe('2024-04-17');
  });

  it('does not move a controlled value on its own', async () => {
    const user = userEvent.setup();
    const value = new Date(2024, 3, 10);
    const onValueChange = vi.fn();
    const { container } = render(inline({ value, onValueChange }));

    await user.click(dayButton(container, '2024-04-17'));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    // Still showing the controlled value, because the parent never wrote back.
    expect(dayCell(container, '2024-04-10').className).toContain(
      styles.selected
    );
    expect(dayCell(container, '2024-04-17').className).not.toContain(
      styles.selected
    );
  });

  it('emits a complete range value at every step', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(dayButton(container, '2024-04-17'));

    /*
     * react-day-picker opens a range as a one-day range, so the first click
     * already yields both ends. What the root guarantees is the *shape*:
     * always a complete DateRangeValue, with `null` rather than `undefined`
     * for a missing end — consumers never have to gate on `undefined`.
     */
    const first = onValueChange.mock.calls[0][0] as DateRangeValue;
    expect(dayKey(first.from as Date)).toBe('2024-04-17');
    expect(first.to).not.toBeUndefined();
    expect(dayKey(first.to as Date)).toBe('2024-04-17');

    await user.click(dayButton(container, '2024-04-20'));

    const second = onValueChange.mock.calls[1][0] as DateRangeValue;
    expect(dayKey(second.from as Date)).toBe('2024-04-17');
    expect(dayKey(second.to as Date)).toBe('2024-04-20');
  });

  it('exposes open state on the root', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CalendarPreview defaultMonth={MONTH} onOpenChange={onOpenChange}>
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    await user.click(screen.getByText('Pick'));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(await screen.findByRole('grid')).toBeInTheDocument();
  });

  it('honours minDate and maxDate', () => {
    const { container } = render(
      inline({ minDate: new Date(2024, 3, 10), maxDate: new Date(2024, 3, 20) })
    );

    expect(dayButton(container, '2024-04-09')).toBeDisabled();
    expect(dayButton(container, '2024-04-15')).not.toBeDisabled();
    expect(dayButton(container, '2024-04-21')).toBeDisabled();
  });

  it('honours isDateUnavailable', () => {
    const { container } = render(
      inline({ isDateUnavailable: (d: Date) => d.getDate() === 15 })
    );

    expect(dayButton(container, '2024-04-15')).toBeDisabled();
    expect(dayButton(container, '2024-04-16')).not.toBeDisabled();
  });

  it('throws a part-named error when a part escapes the root', () => {
    // React logs the thrown error; silence it so the run stays readable.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<CalendarPreview.Grid />)).toThrow(
      'CalendarPreview.Grid must be used within <CalendarPreview>'
    );
    spy.mockRestore();
  });
});

describe('date-adapter', () => {
  it('keys a day stably regardless of Date identity', () => {
    expect(dayKey(new Date(2024, 3, 17, 9))).toBe(
      dayKey(new Date(2024, 3, 17, 23))
    );
  });

  it('round-trips through the canonical format', () => {
    const formatted = formatDate(new Date(2024, 3, 17));
    expect(formatted).toBe('17 Apr 2024');
    expect(dayKey(parseDate(formatted) as Date)).toBe('2024-04-17');
  });

  it('rejects input the format does not describe exactly', () => {
    expect(parseDate('not a date')).toBeNull();
    expect(parseDate('2024-04-17', DEFAULT_FORMAT)).toBeNull();
  });

  it('normalises to the start of the month', () => {
    expect(dayKey(startOfMonth(new Date(2024, 3, 17)))).toBe('2024-04-01');
  });

  it('bounds-checks inclusively', () => {
    const min = new Date(2024, 3, 10);
    const max = new Date(2024, 3, 20);
    expect(isWithinBounds(new Date(2024, 3, 10), min, max)).toBe(true);
    expect(isWithinBounds(new Date(2024, 3, 20), min, max)).toBe(true);
    expect(isWithinBounds(new Date(2024, 3, 9), min, max)).toBe(false);
  });
});

const caption = () =>
  document.querySelector('[data-slot="calendar-preview-nav-caption"]')
    ?.textContent;

/*
 * The visible month was initialised once at mount and then left alone, so a
 * value that arrived after mount was never shown and reopening the popover
 * did not return to the selection.
 */
describe('the visible month follows the value', () => {
  it('shows a value that arrives after mount, next time it opens', async () => {
    const user = userEvent.setup();
    const view = (value: Date | null) => (
      <CalendarPreview value={value}>
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    // Mounted empty, as a picker waiting on a fetch is.
    const { rerender } = render(view(null));
    rerender(view(new Date(2023, 8, 14)));

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('September 2023');
  });

  it('returns to the selection when reopened, not to where the user left', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultValue={new Date(2024, 3, 10)}>
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');

    await user.click(screen.getByLabelText('Next month'));
    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('June 2024');

    await user.keyboard('{Escape}');
    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');
  });

  it('leaves navigation alone while the popover stays open', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultValue={new Date(2024, 3, 10)} defaultOpen>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('May 2024');
    // A re-render with nothing relevant changed must not pull it back.
    await user.click(document.body);
    expect(caption()).toBe('May 2024');
  });

  it('does not yank an open calendar back to today when the value is cleared', async () => {
    const user = userEvent.setup();
    const view = (value: Date | null) => (
      <CalendarPreview value={value} defaultOpen>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const { rerender } = render(view(new Date(2024, 3, 10)));
    await user.click(screen.getByLabelText('Next month'));
    expect(caption()).toBe('May 2024');

    rerender(view(null));
    expect(caption()).toBe('May 2024');
  });

  it('never writes the month a consumer controls', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <CalendarPreview
        defaultValue={new Date(2023, 0, 5)}
        month={new Date(2024, 3, 1)}
        onMonthChange={onMonthChange}
      >
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Nav />
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByText('Pick'));
    await screen.findByRole('grid');
    expect(caption()).toBe('April 2024');
    expect(onMonthChange).not.toHaveBeenCalled();
  });
});

describe('toDateLoose reads an epoch in seconds', () => {
  it('reads seconds as seconds rather than landing in January 1970', () => {
    expect(toDateLoose(1741046400)?.toISOString()).toBe(
      '2025-03-04T00:00:00.000Z'
    );
  });

  it('still reads milliseconds as milliseconds', () => {
    expect(toDateLoose(1741046400000)?.toISOString()).toBe(
      '2025-03-04T00:00:00.000Z'
    );
  });

  it('splits at the ceiling, and symmetrically about the epoch', () => {
    // 1e11 is the first value read as milliseconds; one less is seconds.
    expect(toDateLoose(1e11)?.getUTCFullYear()).toBe(1973);
    expect(toDateLoose(1e11 - 1)?.getUTCFullYear()).toBe(5138);
    // Negative seconds are a real pre-1970 date, not a parse failure.
    expect(toDateLoose(-86400)?.toISOString()).toBe('1969-12-31T00:00:00.000Z');
  });

  it('still reads a digit *string* as a year, which it always did', () => {
    // Pinned, not endorsed: the number path is split by magnitude but the
    // string path cannot be, because a bare '2025' has to stay a year.
    // Changing this should be a deliberate edit that trips this test.
    // Local year, not UTC: a bare year parses to *local* midnight, so in a
    // zone ahead of UTC the UTC year is the one before.
    expect(toDateLoose('1741046400')?.getFullYear()).toBe(1741);
    expect(toDateLoose('2025')?.getFullYear()).toBe(2025);
  });

  it('declines what it cannot read', () => {
    expect(toDateLoose('not a date')).toBeNull();
    expect(toDateLoose(null)).toBeNull();
    expect(toDateLoose(undefined)).toBeNull();
    expect(toDateLoose(Number.NaN)).toBeNull();
  });
});

/*
 * Moved here from `regressions.test.tsx`, which grouped fixes by the audit
 * pass that found them. The assertions are unchanged; each now sits with the
 * behaviour it guards.
 */
describe('regressions', () => {
  it('readOnly shows the value but refuses grid writes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        defaultMonth={MONTH}
        readOnly
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(day(container, '2024-04-17'));
    expect(onValueChange).not.toHaveBeenCalled();
    // readOnly is not disabled: the day stays legible and focusable.
    expect(day(container, '2024-04-17')).not.toBeDisabled();
  });

  it('disabled refuses to open the popover', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        disabled
        onOpenChange={onOpenChange}
      >
        <CalendarPreview.Trigger>Pick</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    await user.click(screen.getByText('Pick'));
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('opens on the value month, not on today', () => {
    render(
      <CalendarPreview value={new Date(2020, 0, 15)}>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByText('January 2020')).toBeInTheDocument();
  });

  it('derives the month from a range value too', () => {
    render(
      <CalendarPreview
        selection='range'
        value={{ from: new Date(2021, 6, 4), to: null }}
      >
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByText('July 2021')).toBeInTheDocument();
  });

  it('defaultMonth still wins over the value', () => {
    render(
      <CalendarPreview value={new Date(2020, 0, 15)} defaultMonth={MONTH}>
        <CalendarPreview.Nav />
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('never warns that the month default changed', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { rerender } = render(
      <CalendarPreview value={new Date(2024, 3, 17)}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    // A controlled value moving must not re-initialise the uncontrolled month.
    rerender(
      <CalendarPreview value={new Date(2025, 3, 17)}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    const warnings = spy.mock.calls.filter(call =>
      String(call[0]).includes('changing the default')
    );
    spy.mockRestore();
    expect(warnings).toHaveLength(0);
  });
});
