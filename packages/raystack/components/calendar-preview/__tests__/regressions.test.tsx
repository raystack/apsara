import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import { dayKey, parseDate } from '../date-adapter';

const MONTH = new Date(2024, 3, 1);
const day = (c: HTMLElement, iso: string) =>
  c.querySelector(`[data-day="${iso}"] button`) as HTMLButtonElement;

describe('regressions', () => {
  it('parseDate returns null, never throws, when a timeZone is set', () => {
    // dayjs.tz does not validate — it throws RangeError on bad input, which
    // would crash the input on an ordinary keystroke.
    expect(() => parseDate('not a date', 'DD MMM YYYY', 'UTC')).not.toThrow();
    expect(parseDate('not a date', 'DD MMM YYYY', 'UTC')).toBeNull();
    expect(parseDate('2024-04-17', 'DD MMM YYYY', 'UTC')).toBeNull();
    expect(
      dayKey(parseDate('17 Apr 2024', 'DD MMM YYYY', 'UTC') as Date, 'UTC')
    ).toBe('2024-04-17');
  });

  it('typing garbage with a timeZone set does not crash the input', async () => {
    const user = userEvent.setup();
    const onValidityChange = vi.fn();
    render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        timeZone='UTC'
        onValidityChange={onValidityChange}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    await user.type(screen.getByLabelText('Start date'), 'nonsense{Enter}');
    expect(onValidityChange).toHaveBeenLastCalledWith({
      valid: false,
      reason: 'unparseable'
    });
  });

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
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByText('July 2021')).toBeInTheDocument();
  });

  it('defaultMonth still wins over the value', () => {
    render(
      <CalendarPreview value={new Date(2020, 0, 15)} defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('does not clobber Input own data-slot', () => {
    const { container } = render(
      <CalendarPreview selection='range' defaultMonth={MONTH}>
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );
    // Both contracts hold: ours on the wrapper, Input's on its own elements.
    expect(getSlot(container, 'calendar-preview-input-start')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="input"]')).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-slot="input-container"]')
    ).toHaveLength(2);
  });

  it('puts the active flag on an element that owns a border', () => {
    const { container } = render(
      <CalendarPreview selection='range' defaultMonth={MONTH}>
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );
    const active = getSlot(container, 'calendar-preview-input-start');
    expect(active).toHaveAttribute('data-active');
    // The style hangs off this wrapper reaching Input's container slot.
    expect(
      active?.querySelector('[data-slot="input-container"]')
    ).not.toBeNull();
  });

  it('lock still allows clearing the unlocked end', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <CalendarPreview
        selection='range'
        defaultMonth={MONTH}
        lock='from'
        defaultValue={{
          from: new Date(2024, 3, 10),
          to: new Date(2024, 3, 20)
        }}
        onValueChange={onValueChange}
      >
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    await user.click(day(container, '2024-04-20'));
    const next = onValueChange.mock.calls[
      onValueChange.mock.calls.length - 1
    ][0] as DateRangeValue;
    // Whatever RDP decides, the locked end is never moved.
    expect(dayKey(next.from as Date)).toBe('2024-04-10');
  });

  it('drops a draft across years when the format carries no year', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <CalendarPreview
        selection='range'
        format='DD MMM'
        value={{ from: new Date(2024, 3, 17), to: null }}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    await user.type(screen.getByLabelText('Start date'), 'xx');

    rerender(
      <CalendarPreview
        selection='range'
        format='DD MMM'
        value={{ from: new Date(2025, 3, 17), to: null }}
      >
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );

    // Same rendered text either year — only dayKey sees the change.
    expect(screen.getByLabelText('Start date')).toHaveValue('17 Apr');
    expect(getSlot(container, 'calendar-preview-input-start')).not.toBeNull();
  });
});
