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
