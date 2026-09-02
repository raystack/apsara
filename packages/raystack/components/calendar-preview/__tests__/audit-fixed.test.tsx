import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';
import type { DateRangeValue } from '../calendar-preview-context';
import {
  DEFAULT_FORMAT,
  dayKey,
  getHours,
  getMinutes,
  isWithinBounds,
  isWithinTimeBounds,
  parseDate,
  setTime,
  toDateLoose
} from '../date-adapter';

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
  it('11: isWithinBounds resolves the day in the zone it is given', () => {
    // 23:00 UTC on 17 Apr is already 08:00 on the 18th in Tokyo.
    const instant = new Date(Date.UTC(2024, 3, 17, 23, 0));
    const max = new Date(Date.UTC(2024, 3, 17, 12, 0));

    expect(isWithinBounds(instant, undefined, max, 'UTC')).toBe(true);
    expect(isWithinBounds(instant, undefined, max, 'Asia/Tokyo')).toBe(false);
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

  /*
   * 24. `zoned()` freezes the offset of the instant it is given. A day arrives
   * as its own midnight, so on a spring-forward day that offset is the *old*
   * one and every time set on top of it came back an hour late — not only the
   * hour that does not exist.
   */
  describe('24: setTime survives a daylight-saving shift', () => {
    const TZ = 'America/New_York';
    // 9 Mar 2025: EST -> EDT at 02:00, so 02:00-02:59 never happens.
    const shiftDay = parseDate('09 Mar 2025', DEFAULT_FORMAT, TZ) as Date;

    it.each([
      [1, 30],
      [3, 0],
      [10, 0],
      [23, 45]
    ])('returns %i:%i as asked', (hours, minutes) => {
      const result = setTime(shiftDay, hours, minutes, TZ);
      expect(getHours(result, TZ)).toBe(hours);
      expect(getMinutes(result, TZ)).toBe(minutes);
    });

    it('resolves a time that does not exist forward into the shift', () => {
      const result = setTime(shiftDay, 2, 30, TZ);
      expect(getHours(result, TZ)).toBe(3);
      expect(getMinutes(result, TZ)).toBe(30);
    });

    it('stays on the day it was handed', () => {
      expect(dayKey(setTime(shiftDay, 23, 45, TZ), TZ)).toBe('2025-03-09');
    });

    it('holds on the autumn shift too', () => {
      // 2 Nov 2025: 01:00-01:59 happens twice; either instant reads back as 1.
      const fallBack = parseDate('02 Nov 2025', DEFAULT_FORMAT, TZ) as Date;
      expect(getHours(setTime(fallBack, 1, 30, TZ), TZ)).toBe(1);
      expect(getHours(setTime(fallBack, 10, 0, TZ), TZ)).toBe(10);
    });
  });

  describe('25: .TimeField honours the picker bounds', () => {
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

  describe('.TimeField cannot invert a range', () => {
    const range = (props: Record<string, unknown> = {}) => {
      const onValueChange = vi.fn();
      const onValidityChange = vi.fn();
      render(
        <CalendarPreview
          selection='range'
          defaultMonth={MONTH}
          value={{
            from: new Date(2024, 3, 17, 9, 0),
            to: new Date(2024, 3, 17, 10, 0)
          }}
          onValueChange={onValueChange}
          onValidityChange={onValidityChange}
          {...props}
        >
          <CalendarPreview.TimeField />
        </CalendarPreview>
      );
      return { onValueChange, onValidityChange };
    };

    it('refuses a start pushed past the end inside the shared day', async () => {
      const user = userEvent.setup();
      const { onValueChange, onValidityChange } = range();

      // `from` is the active endpoint by default.
      await user.clear(screen.getByLabelText('Hour'));
      await user.type(screen.getByLabelText('Hour'), '23{Enter}');

      expect(onValueChange).not.toHaveBeenCalled();
      expect(lastArg(onValidityChange)).toEqual({
        valid: false,
        reason: 'range-order'
      });
    });

    it('refuses an end pulled before the start', async () => {
      const user = userEvent.setup();
      const { onValueChange, onValidityChange } = range({ lock: 'from' });

      // `lock="from"` makes `to` the endpoint this field edits.
      await user.clear(screen.getByLabelText('Hour'));
      await user.type(screen.getByLabelText('Hour'), '08{Enter}');

      expect(onValueChange).not.toHaveBeenCalled();
      expect(lastArg(onValidityChange)).toEqual({
        valid: false,
        reason: 'range-order'
      });
    });

    it('allows a time that keeps the endpoints ordered', async () => {
      const user = userEvent.setup();
      const { onValueChange, onValidityChange } = range();

      await user.clear(screen.getByLabelText('Hour'));
      await user.type(screen.getByLabelText('Hour'), '08{Enter}');

      const next = lastArg(onValueChange) as DateRangeValue;
      expect(getHours(next.from as Date)).toBe(8);
      // The endpoint the user did not touch is untouched.
      expect(getHours(next.to as Date)).toBe(10);
      expect(lastArg(onValidityChange)).toEqual({ valid: true });
    });

    it('leaves a multi-day range alone, where the days already order it', async () => {
      const user = userEvent.setup();
      const { onValueChange } = range({
        value: {
          from: new Date(2024, 3, 17, 9, 0),
          to: new Date(2024, 3, 18, 8, 0)
        }
      });

      // 23:00 on the 17th is still before 08:00 on the 18th.
      await user.clear(screen.getByLabelText('Hour'));
      await user.type(screen.getByLabelText('Hour'), '23{Enter}');

      const next = lastArg(onValueChange) as DateRangeValue;
      expect(getHours(next.from as Date)).toBe(23);
    });

    it('commits normally when the other endpoint is empty', async () => {
      const user = userEvent.setup();
      const { onValueChange } = range({
        value: { from: new Date(2024, 3, 17, 9, 0), to: null }
      });

      await user.clear(screen.getByLabelText('Hour'));
      await user.type(screen.getByLabelText('Hour'), '23{Enter}');

      const next = lastArg(onValueChange) as DateRangeValue;
      expect(getHours(next.from as Date)).toBe(23);
      expect(next.to).toBeNull();
    });
  });

  describe('28: toDateLoose reads an epoch in seconds', () => {
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
      expect(toDateLoose(-86400)?.toISOString()).toBe(
        '1969-12-31T00:00:00.000Z'
      );
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
});
