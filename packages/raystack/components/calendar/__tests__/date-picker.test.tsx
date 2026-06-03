import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../date-picker';

/*
 * Hoisted store + Calendar mock. Tests that assert Calendar props read
 * `calendarCalls.list`; tests that render Calendar visually must override
 * this mock per-test.
 */
const calendarCalls = vi.hoisted(() => ({
  list: [] as Array<Record<string, unknown>>
}));

vi.mock('../calendar', async () => {
  const actual =
    await vi.importActual<typeof import('../calendar')>('../calendar');
  return {
    ...actual,
    Calendar: (props: Record<string, unknown>) => {
      calendarCalls.list.push(props);
      return null;
    }
  };
});

function renderWithCalendarSpy(ui: ReactElement) {
  calendarCalls.list.length = 0;
  render(ui);
  // Focus opens the popover without relying on Calendar contents.
  fireEvent.focus(screen.getByPlaceholderText('Select date'));
  return calendarCalls.list;
}

describe('DatePicker', () => {
  describe('calendarProps surface', () => {
    /*
     * Two regressions on the picker's `calendarProps` type:
     * - Original type required `mode`/`selected`/`onSelect`, which the picker
     *   overrides after the spread — consumer values were silently ignored.
     * - CalendarPropsExtended fields (tooltipMessages, dateInfo, loadingData,
     *   showTooltip) were unreachable because the type didn't include them.
     */
    it('accepts CalendarPropsExtended fields via calendarProps without type cast', () => {
      // The compile-time check is the real test — failing it stops compilation.
      expect(() =>
        render(
          <DatePicker
            calendarProps={{
              startMonth: new Date(2020, 0, 1),
              endMonth: new Date(2030, 0, 1),
              tooltipMessages: { '15-06-2025': 'Sample tooltip' },
              dateInfo: { '15-06-2025': 'i' },
              loadingData: false,
              showTooltip: true
            }}
          />
        )
      ).not.toThrow();
    });

    /*
     * captionLayout='dropdown' is not the default because mounting Selects
     * inside the popover triggers a Base UI Select.Trigger ref-cleanup loop
     * on unmount. Consumers can still opt in.
     */
    it('passes consumer-provided captionLayout through to Calendar', () => {
      const calls = renderWithCalendarSpy(
        <DatePicker calendarProps={{ captionLayout: 'dropdown' }} />
      );
      const lastCall = calls[calls.length - 1];
      expect(lastCall.captionLayout).toBe('dropdown');
    });
  });

  describe('slotProps surface', () => {
    it('forwards slotProps.calendar to the Calendar slot', () => {
      const calls = renderWithCalendarSpy(
        <DatePicker slotProps={{ calendar: { captionLayout: 'dropdown' } }} />
      );
      const last = calls[calls.length - 1];
      expect(last.captionLayout).toBe('dropdown');
    });

    it('slotProps.calendar wins over the deprecated calendarProps', () => {
      const calls = renderWithCalendarSpy(
        <DatePicker
          calendarProps={{ captionLayout: 'label' }}
          slotProps={{ calendar: { captionLayout: 'dropdown' } }}
        />
      );
      const last = calls[calls.length - 1];
      expect(last.captionLayout).toBe('dropdown');
    });

    it('forwards slotProps.input to the Input slot', () => {
      render(
        <DatePicker slotProps={{ input: { 'aria-label': 'pick-day' } }} />
      );
      const input = screen.getByPlaceholderText('Select date');
      expect(input.getAttribute('aria-label')).toBe('pick-day');
    });
  });

  describe('month navigation does not mutate selection', () => {
    /*
     * Earlier the Calendar's `month` and `onMonthChange` were both wired to
     * `selectedDate`, so chevrons and the dropdown silently rewrote the
     * selection. The view-month is now in separate state.
     */
    it('chevron / onMonthChange does not change selected', async () => {
      const initial = new Date(2026, 0, 15); // 15 Jan 2026
      const calls = renderWithCalendarSpy(<DatePicker value={initial} />);

      const firstCall = calls[calls.length - 1];
      expect((firstCall.selected as Date).getTime()).toBe(initial.getTime());
      expect((firstCall.month as Date).getTime()).toBe(initial.getTime());

      // Simulate chevron click: Calendar calls onMonthChange with the new month.
      const newViewMonth = new Date(2026, 1, 1);
      const onMonthChange = firstCall.onMonthChange as (m: Date) => void;
      await new Promise<void>(resolve => {
        // Act-equivalent flush: spy captures the next render's props.
        onMonthChange(newViewMonth);
        setTimeout(resolve, 0);
      });

      const afterPaging = calls[calls.length - 1];
      expect((afterPaging.selected as Date).getTime()).toBe(initial.getTime());
      expect((afterPaging.month as Date).getTime()).toBe(
        newViewMonth.getTime()
      );
    });

    it('selecting a date via the calendar updates both selected and month', async () => {
      const initial = new Date(2026, 0, 15);
      const onSelect = vi.fn();
      const calls = renderWithCalendarSpy(
        <DatePicker value={initial} onSelect={onSelect} />
      );

      const firstCall = calls[calls.length - 1];
      const calendarOnSelect = firstCall.onSelect as (d: Date) => void;

      const newSelection = new Date(2026, 1, 10); // 10 Feb 2026
      await new Promise<void>(resolve => {
        calendarOnSelect(newSelection);
        setTimeout(resolve, 0);
      });

      const afterSelect = calls[calls.length - 1];
      expect((afterSelect.selected as Date).getTime()).toBe(
        newSelection.getTime()
      );
      /*
       * month follows selection via the open-time sync effect (picker re-opens
       * on next mount; while open, the click also closes the popover).
       */
      expect(onSelect).toHaveBeenCalledWith(newSelection);
    });
  });

  describe('default dateFormat', () => {
    // Default is `DD MMM YYYY` (text-based month) so the input reads
    // "27 May 2026" instead of the locale-ambiguous "27/05/2026".
    it('renders a controlled Date in the DD MMM YYYY format by default', () => {
      render(<DatePicker value={new Date(2026, 4, 27)} />);
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('27 May 2026');
    });
  });

  describe('value prop is reactive', () => {
    /*
     * Earlier the picker only used `value` as the initial useState seed, so
     * later parent updates (form reset, "today" buttons, URL-driven changes)
     * no-op'd on the displayed input.
     */
    it('updates the displayed value when the value prop changes', () => {
      const { rerender } = render(<DatePicker value={new Date(2026, 0, 1)} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('01 Jan 2026');

      rerender(<DatePicker value={new Date(2026, 5, 15)} />);
      expect(input.value).toBe('15 Jun 2026');
    });
  });

  describe('unselected initial state (CLD-3195 #4)', () => {
    it('renders with empty input + placeholder when no value or defaultValue is provided', () => {
      render(<DatePicker />);
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('does not fire onSelect on close when nothing was ever selected', () => {
      const onSelect = vi.fn();
      render(<DatePicker onSelect={onSelect} />);
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      // Open + close without selecting.
      fireEvent.focus(input);
      fireEvent.keyUp(input, { code: 'Enter' });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('passes selected=undefined to Calendar when picker has no value', () => {
      const calls = renderWithCalendarSpy(<DatePicker />);
      const last = calls[calls.length - 1];
      expect(last.selected).toBeUndefined();
    });

    it('falls back month to today when no value/defaultValue/calendarProps.defaultMonth', () => {
      const calls = renderWithCalendarSpy(<DatePicker />);
      const last = calls[calls.length - 1];
      const month = last.month as Date;
      const today = new Date();
      // Month should be in this calendar month (today's month/year).
      expect(month.getMonth()).toBe(today.getMonth());
      expect(month.getFullYear()).toBe(today.getFullYear());
    });
  });

  describe('defaultValue (uncontrolled)', () => {
    it('initializes from defaultValue when value is not provided', () => {
      render(<DatePicker defaultValue={new Date(2024, 5, 15)} />);
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('15 Jun 2024');
    });

    it('value prop takes precedence over defaultValue', () => {
      render(
        <DatePicker
          value={new Date(2025, 0, 1)}
          defaultValue={new Date(2024, 5, 15)}
        />
      );
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('01 Jan 2025');
    });

    it('defaultValue is only honored at mount, not on later rerenders', () => {
      const { rerender } = render(
        <DatePicker defaultValue={new Date(2024, 5, 15)} />
      );
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.value).toBe('15 Jun 2024');

      // Changing defaultValue after mount should NOT update the input
      // (uncontrolled semantics).
      rerender(<DatePicker defaultValue={new Date(2030, 0, 1)} />);
      expect(input.value).toBe('15 Jun 2024');
    });
  });

  describe('onSelect fires once per commit', () => {
    /*
     * Regression for CLD-3195 #25: each commit path (calendar click, Enter,
     * outside click) should fire onSelect exactly once with a single canonical
     * Date.
     */
    it('Enter after typing a valid date fires onSelect exactly once', () => {
      const onSelect = vi.fn();
      render(<DatePicker dateFormat='DD/MM/YYYY' onSelect={onSelect} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '15/06/2025' } });
      fireEvent.keyUp(input, { code: 'Enter' });

      expect(onSelect).toHaveBeenCalledTimes(1);
      const calledWith = onSelect.mock.calls[0][0] as Date;
      expect(dayjs(calledWith).format('DD/MM/YYYY')).toBe('15/06/2025');
    });
  });

  describe('typed-input bounds checking', () => {
    /*
     * Earlier `handleInputChange` compared the typed date against
     * `isSameOrBefore(dayjs())`, silently rejecting future dates. The grid
     * let you click them, so typing and clicking disagreed. Future dates
     * are now allowed; bounds come from `startMonth` / `endMonth`.
     */
    it('accepts a future date when no calendarProps bounds are set', () => {
      render(<DatePicker dateFormat='DD/MM/YYYY' />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      // Pick a date far in the future to avoid clock skew in tests.
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });

    it('accepts a future date within endMonth', () => {
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          calendarProps={{ endMonth: new Date(2099, 11, 31) }}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });

    it('rejects a date past endMonth', () => {
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          calendarProps={{ endMonth: new Date(2026, 11, 31) }}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('rejects a date before startMonth', () => {
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          calendarProps={{ startMonth: new Date(2026, 0, 1) }}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15/06/2020' } });
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('typed input parsing', () => {
    /*
     * Earlier `handleInputChange` sniffed a format from the input string
     * (`/` vs `-`) and fell through to `undefined` for shorter input.
     * `dayjs('5', undefined)` fell back to `new Date('5')` (Jan 5 2001 in
     * V8), so single-digit input committed a 2001 date and the input
     * visibly snapped. Now uses `dateFormat` with strict parsing.
     */
    it('does not commit partial single-digit input as a date', () => {
      const onSelect = vi.fn();
      const initial = new Date(2026, 4, 20); // 20/05/2026
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          value={initial}
          onSelect={onSelect}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      // Simulate select-all + type "5"
      fireEvent.change(input, { target: { value: '5' } });

      // Input must NOT have jumped to a 2001 date.
      expect(input.value).not.toMatch(/2001/);
      // onSelect must not have been called with a 2001 date.
      for (const call of onSelect.mock.calls) {
        const arg = call[0] as Date;
        expect(dayjs(arg).year()).not.toBe(2001);
      }
    });

    it('does not commit partial multi-char input that V8 would lenient-parse', () => {
      const initial = new Date(2026, 4, 20);
      render(<DatePicker dateFormat='DD/MM/YYYY' value={initial} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      // "01" -> new Date("01") is Jan 1 2001 in V8. Must not commit.
      fireEvent.change(input, { target: { value: '01' } });
      expect(input.value).not.toMatch(/2001/);
    });

    it('accepts a fully-typed valid date matching dateFormat', () => {
      render(<DatePicker dateFormat='DD/MM/YYYY' />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '15/06/2025' } });
      // The change handler accepted it — error attr stays unset.
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });

    /*
     * Follow-up regression: pre-fix the input was bound to a derived
     * `formattedDate`, so partial typed values were overwritten on the next
     * render and typing felt broken — only paste of the full string worked.
     */
    it('keeps typed characters visible while typing a full date one char at a time', () => {
      const onSelect = vi.fn();
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          value={new Date(2026, 4, 20)}
          onSelect={onSelect}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      const steps = [
        '1',
        '15',
        '15/',
        '15/0',
        '15/06',
        '15/06/',
        '15/06/2',
        '15/06/20',
        '15/06/202',
        '15/06/2025'
      ];

      for (const step of steps) {
        fireEvent.change(input, { target: { value: step } });
        expect(input.value).toBe(step);
      }
    });

    it('does not fire onSelect while typing — partial stays uncommitted, valid waits for commit (Enter/blur/outside-click)', () => {
      const onSelect = vi.fn();
      render(<DatePicker dateFormat='DD/MM/YYYY' onSelect={onSelect} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      // Partial input is not even parseable — no commit.
      fireEvent.change(input, { target: { value: '15/06' } });
      expect(onSelect).not.toHaveBeenCalled();

      // Full valid input parses internally but still doesn't fire onSelect —
      // commit only happens via Enter / blur / outside-click (see the
      // dedicated single-fire test below for that path).
      fireEvent.change(input, { target: { value: '15/06/2025' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    /*
     * The trailing CalendarIcon renders as a sibling `<div>` to the actual
     * `<input>`, so its clicks bubble to the `Popover.Trigger` wrapper even
     * when the input is `disabled`. Without the gate inside DatePicker, the
     * popover would open on icon click despite the disabled input.
     */
    function getTrailingIcon(input: HTMLElement) {
      /*
       * Base UI's InputPrimitive also stamps `data-disabled` on the
       * `<input>` itself, so a plain `[data-disabled]` selector matches
       * the input first. The outer Input wrapper sets it to "true"; use
       * the value form to land on the wrapper.
       */
      const wrapper = input.closest(
        '[data-disabled="true"]'
      ) as HTMLElement | null;
      expect(wrapper).not.toBeNull();
      const icon = wrapper!.querySelector(
        '[aria-hidden="true"]'
      ) as HTMLElement | null;
      expect(icon).not.toBeNull();
      return icon!;
    }

    it('does not open the popover when the trailing icon is clicked (legacy inputProps.disabled)', () => {
      calendarCalls.list.length = 0;
      render(<DatePicker inputProps={{ disabled: true }} />);

      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(getTrailingIcon(input));

      // Popover never opened → Calendar never rendered.
      expect(calendarCalls.list).toEqual([]);
    });

    it('does not open the popover when the trailing icon is clicked (slotProps.input.disabled)', () => {
      calendarCalls.list.length = 0;
      render(<DatePicker slotProps={{ input: { disabled: true } }} />);

      const input = screen.getByPlaceholderText('Select date');
      fireEvent.click(getTrailingIcon(input));

      expect(calendarCalls.list).toEqual([]);
    });

    it('forwards disabled to the underlying input', () => {
      render(<DatePicker inputProps={{ disabled: true }} />);
      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    /*
     * Sanity check: without `disabled`, the same trailing-icon click path
     * does open the popover. Guards against a future change that
     * accidentally swallows trigger clicks for everyone.
     */
    it('still opens the popover via the trailing icon when not disabled', () => {
      calendarCalls.list.length = 0;
      render(<DatePicker />);

      const input = screen.getByPlaceholderText('Select date');
      const wrapper = input.parentElement!.parentElement as HTMLElement;
      const icon = wrapper.querySelector('[aria-hidden="true"]') as HTMLElement;
      fireEvent.click(icon);

      expect(calendarCalls.list.length).toBeGreaterThan(0);
    });
  });

  describe('typing does not throw on bounds checks', () => {
    it('does not throw on input change when only startMonth/endMonth are provided', () => {
      /*
       * Earlier `handleInputChange` called `isSameOrAfter` / `isSameOrBefore`
       * but only `customParseFormat` was extended. Every keystroke threw
       * `dayjs(...).isSameOrBefore is not a function`, React swallowed the
       * update, and the input snapped back after one character.
       */
      render(
        <DatePicker
          dateFormat='DD/MM/YYYY'
          calendarProps={{
            startMonth: new Date(2020, 0, 1),
            endMonth: new Date(2030, 0, 1)
          }}
        />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      expect(() => {
        fireEvent.change(input, { target: { value: '15/06/2025' } });
      }).not.toThrow();
    });

    it('does not throw on input change with no calendar bounds', () => {
      /*
       * Covers the no-bounds path — past regression had an unconditional
       * `isSameOrBefore(dayjs())` that threw without the plugin extended.
       */
      render(<DatePicker dateFormat='DD/MM/YYYY' />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      expect(() => {
        fireEvent.change(input, { target: { value: '01/01/2020' } });
      }).not.toThrow();
    });
  });

  describe('open/close on trigger click', () => {
    /*
     * Regression: Base UI's `Popover.Trigger` toggles open on every trigger
     * click. The input's `onFocus` opens the picker, so the same click's
     * trigger-press toggled it straight back closed — the popover flickered
     * shut on the first click and only stuck open on the second. The hook's
     * `onOpenChange` now ignores trigger-press *closes* (see use-picker-popover).
     */
    it('opens and stays open on the first click of the input', async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      await user.click(screen.getByPlaceholderText('Select date'));
      await act(async () => {
        await new Promise(r => setTimeout(r, 0));
      });

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});
