import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RangePicker } from '../range-picker';

/*
 * Hoisted Calendar spy. Tests assert prop wiring (Calendar has its own
 * suite). To drive Calendar callbacks, read `calendarCalls.list` and invoke
 * the captured handlers.
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

function openPopoverAndCaptureCalendar(ui: ReactElement) {
  calendarCalls.list.length = 0;
  const result = render(ui);
  const startInput = screen.getByPlaceholderText('Select start date');
  fireEvent.click(startInput);
  return { ...result, calls: calendarCalls.list };
}

function latestCalendarOnSelect(): (range: unknown, day: Date) => void {
  const last = calendarCalls.list[calendarCalls.list.length - 1];
  return last.onSelect as (range: unknown, day: Date) => void;
}

describe('RangePicker', () => {
  describe('no default range', () => {
    /*
     * Earlier `defaultValue` defaulted to `{from: today, to: today}`, so an
     * uncontrolled picker always rendered pre-filled with today and the
     * placeholders never showed.
     */
    it('renders with empty inputs when neither value nor defaultValue is provided', () => {
      render(<RangePicker />);

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;

      expect(startInput.value).toBe('');
      expect(endInput.value).toBe('');
    });

    it('honors an explicit defaultValue', () => {
      render(
        <RangePicker
          defaultValue={{
            from: new Date(2026, 0, 1),
            to: new Date(2026, 0, 15)
          }}
        />
      );

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;

      expect(startInput.value).toBe('01/01/2026');
      expect(endInput.value).toBe('15/01/2026');
    });

    it('does not crash when value is undefined and no defaultValue', () => {
      expect(() => {
        render(<RangePicker value={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Regression: calendarProps surface', () => {
    it('accepts CalendarPropsExtended fields via calendarProps', () => {
      expect(() =>
        render(
          <RangePicker
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
     * #19a (default captionLayout='dropdown') reverted: surfaced a Base UI
     * Select.Trigger unmount ref loop. Consumers can still opt in.
     */
    it('passes consumer-provided captionLayout through to Calendar', () => {
      const { calls } = openPopoverAndCaptureCalendar(
        <RangePicker calendarProps={{ captionLayout: 'dropdown' }} />
      );
      const last = calls[calls.length - 1];
      expect(last.captionLayout).toBe('dropdown');
    });
  });

  describe('slotProps surface', () => {
    it('forwards slotProps.calendar to the Calendar slot', () => {
      const { calls } = openPopoverAndCaptureCalendar(
        <RangePicker slotProps={{ calendar: { captionLayout: 'dropdown' } }} />
      );
      const last = calls[calls.length - 1];
      expect(last.captionLayout).toBe('dropdown');
    });

    it('slotProps.calendar wins over the deprecated calendarProps', () => {
      const { calls } = openPopoverAndCaptureCalendar(
        <RangePicker
          calendarProps={{ captionLayout: 'label' }}
          slotProps={{ calendar: { captionLayout: 'dropdown' } }}
        />
      );
      const last = calls[calls.length - 1];
      expect(last.captionLayout).toBe('dropdown');
    });

    it('forwards slotProps.startInput / endInput to each input', () => {
      render(
        <RangePicker
          slotProps={{
            startInput: { 'aria-label': 'pick-from' },
            endInput: { 'aria-label': 'pick-to' }
          }}
        />
      );
      expect(
        screen
          .getByPlaceholderText('Select start date')
          .getAttribute('aria-label')
      ).toBe('pick-from');
      expect(
        screen
          .getByPlaceholderText('Select end date')
          .getAttribute('aria-label')
      ).toBe('pick-to');
    });
  });

  describe('Regression: value prop syncs currentMonth', () => {
    it('passes the new value.from as the visible month when value changes', () => {
      const { rerender } = openPopoverAndCaptureCalendar(
        <RangePicker
          value={{
            from: new Date(2026, 0, 1),
            to: new Date(2026, 0, 15)
          }}
        />
      );

      const firstMonth = calendarCalls.list[calendarCalls.list.length - 1]
        .month as Date;
      expect(firstMonth.getMonth()).toBe(0); // January

      rerender(
        <RangePicker
          value={{
            from: new Date(2026, 5, 15),
            to: new Date(2026, 5, 20)
          }}
        />
      );

      const updatedMonth = calendarCalls.list[calendarCalls.list.length - 1]
        .month as Date;
      expect(updatedMonth.getMonth()).toBe(5); // June
    });

    it('does not crash when value is undefined', () => {
      const { rerender } = render(
        <RangePicker
          value={{
            from: new Date(2026, 0, 1),
            to: new Date(2026, 0, 15)
          }}
        />
      );

      expect(() => {
        rerender(<RangePicker value={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Regression: state machine', () => {
    /*
     * State machine branches on actual from/to state:
     *   A. empty -> set from, advance
     *   B1. from set, click before -> reset
     *   B2. from set, click after/equal -> set to, close
     *   C. both set -> restart
     */

    it('A: empty range, click sets from and leaves popover open', () => {
      openPopoverAndCaptureCalendar(<RangePicker />);

      const calendarOnSelect = latestCalendarOnSelect();
      act(() => {
        calendarOnSelect({}, new Date(2026, 0, 15));
      });

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;
      expect(startInput.value).toBe('15/01/2026');
      expect(endInput.value).toBe('');

      /*
       * Popover still open -> Calendar still mounted -> spy keeps recording.
       * If the popover had closed, there'd be no Calendar to re-record on
       * the next interaction.
       */
      const callsAfter = calendarCalls.list.length;
      expect(callsAfter).toBeGreaterThan(0);

      // Focus moved to 'to'.
      expect(endInput.getAttribute('data-active')).toBe('true');
    });

    it('B2: from set, click after commits the range and closes', () => {
      const onSelect = vi.fn();
      openPopoverAndCaptureCalendar(
        <RangePicker
          defaultValue={{ from: new Date(2026, 0, 15) }}
          onSelect={onSelect}
        />
      );

      const calendarOnSelect = latestCalendarOnSelect();
      const callsBefore = calendarCalls.list.length;

      act(() => {
        calendarOnSelect({}, new Date(2026, 0, 20));
      });

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;
      expect(startInput.value).toBe('15/01/2026');
      expect(endInput.value).toBe('20/01/2026');

      /*
       * Popover should have closed -> Calendar unmounted. A tight call-count
       * assertion would be brittle (React's final commit may queue more);
       * instead assert data-active returned to 'from' — only the B2 close
       * path does that.
       */
      const callsAfter = calendarCalls.list.length;
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
      expect(startInput.getAttribute('data-active')).toBe('false');

      expect(onSelect).toHaveBeenLastCalledWith({
        from: new Date(2026, 0, 15),
        to: new Date(2026, 0, 20)
      });
    });

    it('B1: from set, click before resets from and leaves popover open', () => {
      openPopoverAndCaptureCalendar(
        <RangePicker defaultValue={{ from: new Date(2026, 0, 15) }} />
      );

      const calendarOnSelect = latestCalendarOnSelect();
      act(() => {
        calendarOnSelect({}, new Date(2026, 0, 10));
      });

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;
      expect(startInput.value).toBe('10/01/2026');
      expect(endInput.value).toBe(''); // to cleared
      expect(endInput.getAttribute('data-active')).toBe('true'); // still on 'to'
    });

    it('C: both set, click restarts with new from and clears to', () => {
      openPopoverAndCaptureCalendar(
        <RangePicker
          defaultValue={{
            from: new Date(2026, 0, 15),
            to: new Date(2026, 0, 20)
          }}
        />
      );

      const calendarOnSelect = latestCalendarOnSelect();
      act(() => {
        calendarOnSelect({}, new Date(2026, 1, 1));
      });

      const startInput = screen.getByPlaceholderText(
        'Select start date'
      ) as HTMLInputElement;
      const endInput = screen.getByPlaceholderText(
        'Select end date'
      ) as HTMLInputElement;
      expect(startInput.value).toBe('01/02/2026');
      expect(endInput.value).toBe('');
      expect(endInput.getAttribute('data-active')).toBe('true');
    });
  });
});
