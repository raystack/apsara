import { fireEvent, render, screen } from '@testing-library/react';
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
      expect(input.value).toBe('01/01/2026');

      rerender(<DatePicker value={new Date(2026, 5, 15)} />);
      expect(input.value).toBe('15/06/2026');
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
      render(<DatePicker />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      // Pick a date far in the future to avoid clock skew in tests.
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });

    it('accepts a future date within endMonth', () => {
      render(
        <DatePicker calendarProps={{ endMonth: new Date(2099, 11, 31) }} />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });

    it('rejects a date past endMonth', () => {
      render(
        <DatePicker calendarProps={{ endMonth: new Date(2026, 11, 31) }} />
      );

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15/06/2099' } });
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('rejects a date before startMonth', () => {
      render(
        <DatePicker calendarProps={{ startMonth: new Date(2026, 0, 1) }} />
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
      render(<DatePicker value={initial} onSelect={onSelect} />);

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
      render(<DatePicker value={initial} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      // "01" -> new Date("01") is Jan 1 2001 in V8. Must not commit.
      fireEvent.change(input, { target: { value: '01' } });
      expect(input.value).not.toMatch(/2001/);
    });

    it('accepts a fully-typed valid date matching dateFormat', () => {
      render(<DatePicker />);

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
      render(<DatePicker value={new Date(2026, 4, 20)} onSelect={onSelect} />);

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

    it('commits a valid date and fires onSelect once typing reaches a complete match', () => {
      const onSelect = vi.fn();
      render(<DatePicker onSelect={onSelect} />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      // Partial input must not commit
      fireEvent.change(input, { target: { value: '15/06' } });
      expect(onSelect).not.toHaveBeenCalled();

      // Full valid input does not throw and clears error state
      fireEvent.change(input, { target: { value: '15/06/2025' } });
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
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
      render(<DatePicker />);

      const input = screen.getByPlaceholderText(
        'Select date'
      ) as HTMLInputElement;

      expect(() => {
        fireEvent.change(input, { target: { value: '01/01/2020' } });
      }).not.toThrow();
    });
  });
});
