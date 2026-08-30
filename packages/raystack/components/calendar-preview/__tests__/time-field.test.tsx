import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { getHours, getMinutes } from '../date-adapter';

const lastArg = (fn: { mock: { calls: unknown[][] } }) =>
  fn.mock.calls[fn.mock.calls.length - 1]?.[0];

const hour = () => screen.getByLabelText('Hour');
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
