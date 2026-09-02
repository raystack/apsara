import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey } from '../date-adapter';

const lastArg = <T,>(fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0] as T;

/*
 * The range-order contract, run against every writer that can commit a range.
 *
 * It used to live in one `.MonthGrid`-only block behind a helper called
 * `rangeGrid` — the name said "grid", the JSX said `.MonthGrid`, and the file
 * contained no `.Grid` at all. So the whole contract was verified against the
 * view users reach by switching granularity and never against the day grid they
 * land on. `.Grid` was meanwhile destroying a whole range on one click and
 * committing backwards ranges under a lock, and reporting both as valid.
 *
 * Parameterised so that is structural rather than remembered: a writer is a
 * row in `WRITERS`, and every contract point below runs for each of them.
 * Adding a fourth writer means adding a row, not remembering this file exists.
 */
interface RangeWriter {
  label: string;
  /** Mounts the writer with `focusMonth` (0-based, 2026) reachable. */
  mount(props: Record<string, unknown>, focusMonth: number): void;
  /** Clicks the cell that commits a value inside `month`. */
  pick(month: number): Promise<void>;
  /** The `dayKey` this writer commits for a pick inside `month`. */
  committed(month: number): string;
}

const BOUNDS = {
  minDate: new Date(2026, 0, 1),
  maxDate: new Date(2026, 11, 31)
};

const MONTH_LABEL = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const MONTH_NAME = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/** The day `.Grid` cases click, and the day the period writers resolve to. */
const DAY_OF_MONTH = 1;

const WRITERS: RangeWriter[] = [
  {
    label: '.MonthGrid',
    mount(props) {
      render(
        <CalendarPreview
          selection='range'
          defaultGranularity='month'
          granularities={['month']}
          {...BOUNDS}
          {...props}
        >
          <CalendarPreview.MonthGrid />
        </CalendarPreview>
      );
    },
    async pick(month) {
      const user = userEvent.setup();
      await user.click(
        screen.getAllByRole('button', { name: MONTH_LABEL[month] })[0]
      );
    },
    committed: month => `2026-${String(month + 1).padStart(2, '0')}-01`
  },
  {
    label: '.Grid',
    mount(props, focusMonth) {
      render(
        <CalendarPreview
          selection='range'
          defaultMonth={new Date(2026, focusMonth, 1)}
          {...BOUNDS}
          {...props}
        >
          <CalendarPreview.Grid />
        </CalendarPreview>
      );
    },
    async pick(month) {
      const user = userEvent.setup();
      // RDP names a day button "Thursday, June 1st, 2026".
      await user.click(
        screen.getByRole('button', {
          name: new RegExp(`${MONTH_NAME[month]} ${DAY_OF_MONTH}st`)
        })
      );
    },
    committed: month =>
      `2026-${String(month + 1).padStart(2, '0')}-${String(DAY_OF_MONTH).padStart(2, '0')}`
  }
];

describe.each(WRITERS)('$label range ordering', (writer: RangeWriter) => {
  it('sets the start and keeps an end that is already held', async () => {
    const onValueChange = vi.fn();
    writer.mount(
      { value: { from: null, to: new Date(2026, 8, 20) }, onValueChange },
      2
    );

    await writer.pick(2);

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(next).not.toBeNull();
    expect(dayKey(next.from as Date)).toBe(writer.committed(2));
    expect(next.to).not.toBeNull();
  });

  it('clears the end when a chosen start moves past it', async () => {
    const onValueChange = vi.fn();
    writer.mount(
      { value: { from: null, to: new Date(2026, 2, 1) }, onValueChange },
      11
    );

    await writer.pick(11);

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe(writer.committed(11));
    expect(next.to).toBeNull();
  });

  /*
   * `lock` holds one endpoint read-only, and that endpoint is the only one an
   * inversion could clear — so under a lock there is nothing to repair. Refused
   * rather than deleting the endpoint the consumer pinned.
   */
  it('refuses a pick that would invert, keeping the locked endpoint', async () => {
    const onValueChange = vi.fn();
    const onValidityChange = vi.fn();
    writer.mount(
      {
        lock: 'from',
        value: { from: new Date(2026, 8, 1), to: null },
        onValueChange,
        onValidityChange
      },
      2
    );

    await writer.pick(2);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      lastArg<{ valid: boolean; reason?: string }>(onValidityChange)
    ).toEqual({ valid: false, reason: 'range-order' });
  });

  it('still commits an ordered pick under a lock', async () => {
    const onValueChange = vi.fn();
    writer.mount(
      {
        lock: 'from',
        value: { from: new Date(2026, 8, 1), to: null },
        onValueChange
      },
      10
    );

    await writer.pick(10);

    const next = lastArg<DateRangeValue>(onValueChange);
    expect(dayKey(next.from as Date)).toBe('2026-09-01');
    expect(dayKey(next.to as Date)).toBe(writer.committed(10));
  });
});
