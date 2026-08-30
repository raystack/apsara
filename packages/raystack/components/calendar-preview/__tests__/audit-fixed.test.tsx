import { render, screen, waitFor } from '@testing-library/react';
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
    const cells = Array.from(
      container.querySelectorAll('[data-slot="calendar-preview-month-cell"]')
    ) as HTMLButtonElement[];
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
    /*
     * jsdom has no layout, so `scrollTop` is not observable on its own — the
     * previous form of this test asserted `scrollTop >= 0`, which is true of
     * an untouched element. Stand a spy in its place and give the geometry
     * non-zero values, so the assertion is about the scroll actually happening.
     */
    const stub = (name: string, descriptor: PropertyDescriptor) => {
      const original = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        name
      );
      Object.defineProperty(HTMLElement.prototype, name, {
        configurable: true,
        ...descriptor
      });
      return () => {
        if (original) {
          Object.defineProperty(HTMLElement.prototype, name, original);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, name);
        }
      };
    };

    const scrolled = vi.fn();
    const restore = [
      stub('scrollTop', { get: () => 0, set: scrolled }),
      stub('offsetTop', { get: () => 900 }),
      stub('clientHeight', { get: () => 300 })
    ];

    try {
      render(
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

      expect(scrolled).not.toHaveBeenCalled();
      await user.click(screen.getByRole('tab', { name: 'Month' }));
      // 900 - 300/2 + 300/2, centred on the active year.
      expect(scrolled).toHaveBeenCalledWith(900);
    } finally {
      for (const undo of restore) undo();
    }
  });

  it('08: a trigger holding a typed field claims no button semantics', async () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    // In ARIA a button's children are presentational, so the field inside was
    // at risk of never being announced as editable; the tab stop it added sat
    // in front of the input doing nothing a keyboard user wants.
    await waitFor(() => expect(trigger).not.toHaveAttribute('role'));
    expect(trigger).toHaveAttribute('tabindex', '-1');
    expect(trigger.querySelector('input')).not.toBeNull();
  });

  it('08: a plain trigger keeps the button semantics it should have', () => {
    const { container } = render(
      <CalendarPreview>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
      </CalendarPreview>
    );
    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('tabindex', '0');
  });

  it('09: clicking the field a second time does not close the calendar', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    await user.click(field);
    expect(await screen.findByRole('grid')).toBeInTheDocument();

    // Repositioning the caret is an ordinary thing to do mid-edit.
    await user.click(field);
    expect(screen.queryByRole('grid')).toBeInTheDocument();
  });

  it('09: clicking the trigger outside the field still toggles', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const trigger = getSlot(
      container,
      'calendar-preview-trigger'
    ) as HTMLElement;
    await user.click(trigger);
    expect(await screen.findByRole('grid')).toBeInTheDocument();
    await user.click(trigger);
    await waitFor(() =>
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    );
  });

  it('opens from the keyboard with ArrowDown, since the trigger has no tab stop', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox');
    field.focus();
    await user.keyboard('{ArrowDown}');
    expect(await screen.findByRole('grid')).toBeInTheDocument();
  });

  it('12: Escape reverts the draft first and dismisses only on the second press', async () => {
    const user = userEvent.setup();
    render(
      <CalendarPreview defaultMonth={MONTH} value={new Date(2024, 3, 17)}>
        <CalendarPreview.Trigger>
          <CalendarPreview.Input />
        </CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    const field = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(field);
    expect(await screen.findByRole('grid')).toBeInTheDocument();

    await user.type(field, 'nonsense');
    await user.keyboard('{Escape}');
    // Correcting a typo must not cost you the calendar.
    expect(field.value).toBe('17 Apr 2024');
    expect(screen.queryByRole('grid')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    );
  });
});
