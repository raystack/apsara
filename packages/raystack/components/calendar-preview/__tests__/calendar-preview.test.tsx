import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import styles from '../calendar-preview.module.css';
import type { DateRangeValue } from '../calendar-preview-context';
import {
  DEFAULT_FORMAT,
  dayKey,
  formatDate,
  isWithinBounds,
  parseDate,
  startOfMonth
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
