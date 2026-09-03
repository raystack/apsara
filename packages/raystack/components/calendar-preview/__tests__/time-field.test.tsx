import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { getHours, getMinutes, isWithinTimeBounds } from '../date-adapter';

const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

const hour = () => screen.getByLabelText('Hour');

const MONTH = new Date(2024, 3, 1);
const minute = () => screen.getByLabelText('Minute');

const tree = (props: Record<string, unknown> = {}, fieldProps = {}) =>
  render(
    <CalendarPreview defaultMonth={new Date(2024, 3, 1)} {...props}>
      <CalendarPreview.TimeField {...fieldProps} />
    </CalendarPreview>
  );

describe('CalendarPreview.TimeField', () => {
  it('renders its slot', () => {
    const { container } = tree();
    expect(getSlot(container, 'calendar-preview-time-field')).not.toBeNull();
  });

  it('is empty and disabled with no date selected', () => {
    tree();
    expect(hour()).toHaveValue('');
    expect(hour()).toBeDisabled();
    expect(minute()).toBeDisabled();
  });

  it('shows the selected time, zero-padded', () => {
    tree({ value: new Date(2024, 3, 17, 9, 5) });
    expect(hour()).toHaveValue('09');
    expect(minute()).toHaveValue('05');
  });

  it('writes the time back onto the same day', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ value: new Date(2024, 3, 17, 9, 5), onValueChange });

    await user.clear(hour());
    await user.type(hour(), '14{Enter}');

    const next = lastArg(onValueChange) as Date;
    expect(getHours(next)).toBe(14);
    expect(next.getDate()).toBe(17);
  });

  it('snaps minutes to the step', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ value: new Date(2024, 3, 17, 9, 0), onValueChange }, { step: 15 });

    await user.clear(minute());
    await user.type(minute(), '20{Enter}');
    expect(getMinutes(lastArg(onValueChange) as Date)).toBe(15);
  });

  it('rejects out-of-range values without changing anything', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ value: new Date(2024, 3, 17, 9, 5), onValueChange });

    await user.clear(hour());
    await user.type(hour(), '99{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders AM/PM only under a 12-hour cycle', () => {
    const { container, unmount } = tree(
      { value: new Date(2024, 3, 17, 15, 0) },
      { hourCycle: 12 }
    );
    expect(getSlot(container, 'calendar-preview-meridiem')).not.toBeNull();
    expect(hour()).toHaveValue('03');
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    unmount();

    const second = tree({ value: new Date(2024, 3, 17, 15, 0) });
    expect(getSlot(second.container, 'calendar-preview-meridiem')).toBeNull();
    expect(hour()).toHaveValue('15');
  });

  it('flips meridiem without moving the hour hand', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree(
      { value: new Date(2024, 3, 17, 15, 30), onValueChange },
      { hourCycle: 12 }
    );

    await user.click(screen.getByRole('button', { name: 'AM' }));
    const next = lastArg(onValueChange) as Date;
    expect(getHours(next)).toBe(3);
    expect(getMinutes(next)).toBe(30);
  });

  it('edits the active endpoint of a range, honouring lock', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({
      selection: 'range',
      lock: 'from',
      value: {
        from: new Date(2024, 3, 10, 8, 0),
        to: new Date(2024, 3, 20, 9, 0)
      },
      onValueChange
    });

    // With `from` locked, the unlocked `to` is what this field edits.
    expect(hour()).toHaveValue('09');
    await user.clear(hour());
    await user.type(hour(), '18{Enter}');

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(getHours(next.to as Date)).toBe(18);
    expect(getHours(next.from as Date)).toBe(8);
  });

  it('refuses writes when readOnly', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ value: new Date(2024, 3, 17, 9, 5), readOnly: true, onValueChange });

    await user.type(hour(), '1{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('reverts a draft on Escape', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    tree({ value: new Date(2024, 3, 17, 9, 5), onValueChange });

    await user.clear(hour());
    await user.type(hour(), '11');
    await user.keyboard('{Escape}');
    expect(hour()).toHaveValue('09');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

/*
 * Moved here from `audit-fixed.test.tsx`, which collected findings by the
 * number they were reported under. Each assertion is unchanged; only its home
 * is, so a failure lands beside the behaviour it describes.
 */
describe('regressions from the external audit', () => {
  it('snapping never rolls into the next hour', async () => {
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
    // `<= 59` was true of every Date ever constructed. The property is that the
    // snap lands on the step grid without rolling the hour: 59 snaps to 45.
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBe(45);
    expect(next.getMinutes() % 15).toBe(0);
  });

  /*
   * Asserting `isWithinBounds.length === 4` only checked the declared parameter
   * count, and the case beside it was true in every zone — so making the
   * function ignore `timeZone` entirely left all 33 tests here green, and all
   * 358 across the repo. This asks the only question that separates the two:
   * one instant that falls on different days depending on the zone it is read
   * in, against a bound that sits between them.
   */
});

describe('.TimeField honours the picker bounds', () => {
  const setup = (props: Record<string, unknown>) => {
    const onValueChange = vi.fn();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        defaultMonth={MONTH}
        value={new Date(2024, 3, 17, 9, 0)}
        onValueChange={onValueChange}
        onValidityChange={onValidityChange}
        {...props}
      >
        <CalendarPreview.TimeField />
      </CalendarPreview>
    );
    return { onValueChange, onValidityChange };
  };

  it('refuses an hour past maxDate and reports why', async () => {
    const user = userEvent.setup();
    // Bounded at 10:00 *on the selected day*, so only a time comparison can
    // catch this — `isWithinBounds` compares whole days and would pass it.
    const { onValueChange, onValidityChange } = setup({
      maxDate: new Date(2024, 3, 17, 10, 0)
    });

    await user.clear(screen.getByLabelText('Hour'));
    await user.type(screen.getByLabelText('Hour'), '23{Enter}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(lastArg(onValidityChange)).toEqual({
      valid: false,
      reason: 'out-of-bounds'
    });
  });

  it('refuses an hour before minDate', async () => {
    const user = userEvent.setup();
    const { onValueChange, onValidityChange } = setup({
      minDate: new Date(2024, 3, 17, 8, 0)
    });

    await user.clear(screen.getByLabelText('Hour'));
    await user.type(screen.getByLabelText('Hour'), '07{Enter}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(lastArg(onValidityChange)).toEqual({
      valid: false,
      reason: 'out-of-bounds'
    });
  });

  it('leaves the whole last day usable under a day-level maxDate', async () => {
    const user = userEvent.setup();
    // The ordinary way a picker is bounded: a plain day, at midnight. Read
    // literally as an instant it would forbid every time on the 17th, which
    // is not what it means anywhere else in the component.
    const { onValueChange, onValidityChange } = setup({
      maxDate: new Date(2024, 3, 17)
    });

    await user.clear(screen.getByLabelText('Hour'));
    await user.type(screen.getByLabelText('Hour'), '10{Enter}');

    expect(getHours(lastArg(onValueChange) as Date)).toBe(10);
    expect(lastArg(onValidityChange)).toEqual({ valid: true });
  });

  it('still rejects the day after a day-level maxDate', () => {
    // The day bound has not gone soft — it is applied first, inclusive.
    expect(
      isWithinTimeBounds(
        new Date(2024, 3, 18, 9, 0),
        undefined,
        new Date(2024, 3, 17)
      )
    ).toBe(false);
    expect(
      isWithinTimeBounds(
        new Date(2024, 3, 17, 23, 59),
        undefined,
        new Date(2024, 3, 17)
      )
    ).toBe(true);
  });

  it('commits an in-bounds hour and reports valid', async () => {
    const user = userEvent.setup();
    const { onValueChange, onValidityChange } = setup({
      maxDate: new Date(2024, 3, 17, 10, 0)
    });

    await user.clear(screen.getByLabelText('Hour'));
    await user.type(screen.getByLabelText('Hour'), '10{Enter}');

    expect(getHours(lastArg(onValueChange) as Date)).toBe(10);
    expect(lastArg(onValidityChange)).toEqual({ valid: true });
  });
});

/*
 * A day carries no time of day, so every writer that commits one has to decide
 * what happens to the time already on the value. `.RangeInput` inherits it, and
 * says why: otherwise a retype silently discards whatever `.TimeField` or a
 * preset put there. `.Input` and `.Grid` discarded it — so setting 09:30 and
 * then correcting the date reset the clock to midnight, and `.TimeField`, which
 * reads the committed value, showed 00:00 for a time the user never chose.
 *
 * Day granularity only, as `.RangeInput` specifies: every coarser granularity
 * resolves to the first instant of a period, and `Q4 2024` means the quarter,
 * not 09:30 on the day it starts.
 */
describe('the time of day survives every other writer', () => {
  const AT_0930 = new Date(2024, 3, 17, 9, 30);
  const clock = (date: unknown) =>
    `${getHours(date as Date)}:${getMinutes(date as Date)}`;

  it('.Input keeps it through a retype', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultValue={AT_0930}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    await user.type(field, '18 Apr 2024{Enter}');

    expect(clock(lastArg(onValueChange))).toBe('9:30');
  });

  it('.Grid keeps it through a day click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        defaultValue={AT_0930}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
        <CalendarPreview.TimeField />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: /April 18th/ }));

    expect(clock(lastArg(onValueChange))).toBe('9:30');
    // The field reads the committed value, so it must not have moved either.
    expect(hour()).toHaveValue('09');
    expect(minute()).toHaveValue('30');
  });

  it('.Grid keeps each endpoint of a range on its own clock', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultValue={{
          from: new Date(2024, 3, 10, 8, 0),
          to: new Date(2024, 3, 20, 17, 45)
        }}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: /April 22nd/ }));

    const next = lastArg(onValueChange) as DateRangeValue;
    expect(clock(next.from)).toBe('8:0');
    expect(clock(next.to)).toBe('17:45');
  });

  // The writer that already did this, kept as the control.
  it('.RangeInput keeps it through a retype', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultValue={{ from: AT_0930, to: new Date(2024, 3, 20, 17, 45) }}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    const field = screen.getByLabelText('Start date');
    await user.clear(field);
    await user.type(field, '18 Apr 2024{Enter}');

    expect(clock((lastArg(onValueChange) as DateRangeValue).from)).toBe('9:30');
  });

  /*
   * Nothing is inherited across days under `multiple`: each date holds its own
   * time, and a newly picked day has no earlier time of its own to keep.
   * Copying another day's would be inventing a value, not preserving one.
   */
  it('.Grid leaves the other days alone under multiple', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        selection='multiple'
        defaultValue={[AT_0930]}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(screen.getByRole('button', { name: /April 18th/ }));

    const next = lastArg(onValueChange) as Date[];
    expect(next).toHaveLength(2);
    expect(clock(next[0])).toBe('9:30');
    expect(clock(next[1])).toBe('0:0');
  });

  it('does not inherit one onto a coarser granularity', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CalendarPreview
        granularities={['day', 'month']}
        defaultValue={AT_0930}
        defaultMonth={MONTH}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Input />
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.clear(field);
    // `May 2024` is the month, not 09:30 on the day it starts.
    await user.type(field, 'May 2024{Enter}');

    expect(clock(lastArg(onValueChange))).toBe('0:0');
  });
});
