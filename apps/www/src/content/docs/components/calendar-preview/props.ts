import { ReactNode } from 'react';

export interface CalendarPreviewProps {
  /** The selected day (controlled). */
  value?: Date | null;

  /** The initially selected day (uncontrolled). */
  defaultValue?: Date | null;

  /**
   * Called when a day is committed or cleared. `details.toDate()` returns the
   * day acted on even when `value` is `null`.
   * @example onValueChange={(value, details) => console.log(details.reason)}
   */
  onValueChange?: (
    value: Date | null,
    details: {
      reason: 'select' | 'input' | 'clear' | 'scale';
      period: { start: string; end: string };
      toDate: () => Date;
    }
  ) => void;

  /** The first month the grid displays (controlled). */
  month?: Date;

  /**
   * The month the grid opens on.
   * @example defaultMonth={new Date(2024, 3, 1)}
   */
  defaultMonth?: Date;

  /** Called when the view moves. */
  onMonthChange?: (month: Date) => void;

  /**
   * The years the caption's year column offers.
   * Defaults to ten years either side of `today`, widened to cover any bound.
   */
  yearRange?: { from: number; to: number };

  /**
   * Earliest selectable day, inclusive. Never clamps navigation.
   * @example minDate={new Date(2024, 3, 17)}
   */
  minDate?: Date;

  /** Latest selectable day, inclusive. Never clamps navigation. */
  maxDate?: Date;

  /**
   * Reject individual days, on top of `minDate` / `maxDate`.
   * @example isDateUnavailable={date => date.getDay() === 0}
   */
  isDateUnavailable?: (date: Date) => boolean;

  /**
   * The day `.Reset` restores. Read even when `value` is controlled, which
   * `defaultValue` is not.
   */
  defaultDate?: Date;

  /**
   * The zone the grid reads days in. Forwarded to the grid; the component does
   * no conversion of its own.
   *
   * Every `Date` prop and every `Date` handed back is an instant, not a
   * calendar day, so the calendar shows the day that instant falls on in this
   * zone. With `timeZone="Pacific/Niue"`, `new Date(2026, 7, 1)` is 31 July
   * there. Build dates for a zoned calendar from `Date.UTC`, not from local
   * calendar fields.
   */
  timeZone?: string;

  /** Today, injectable so a calendar renders deterministically in tests. */
  today?: Date;

  /**
   * Whether clicking the selected day deselects it.
   * @default true
   */
  clearable?: boolean;

  /** @default false */
  disabled?: boolean;

  /**
   * Whether the value can be read and navigated but not changed.
   * @default false
   */
  readOnly?: boolean;

  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewDaysProps {
  /**
   * How many months the grid shows side by side. More than one moves the
   * caption and nav into each month's own header.
   * @default 1
   */
  numberOfMonths?: number;

  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewCaptionProps {
  /**
   * Turn the caption into a trigger for the month and year scroller.
   * @default false
   */
  dropdown?: boolean;

  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewGridProps {
  /**
   * Always render six week rows, so the grid height never jumps between a 4-,
   * 5- and 6-row month. Opt out where the calendar is inline and the trailing
   * blank row is not wanted.
   * @default true
   */
  fixedWeeks?: boolean;

  /**
   * Render the days either side of the month.
   * @default false
   */
  showOutsideDays?: boolean;

  /** Render a week-number column. */
  showWeekNumber?: boolean;

  /**
   * First day of the week, 0 (Sunday) to 6.
   * @default 0
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Extra day modifiers, passed through to react-day-picker. */
  modifiers?: Record<string, unknown>;

  /** Override react-day-picker's component slots. */
  components?: Record<string, unknown>;

  /**
   * Extra content for a day, rendered above the date number.
   * @example dateInfo={date => (date.getDate() === 1 ? <Dot /> : null)}
   */
  dateInfo?: (date: Date) => ReactNode;

  /** @default false */
  showTooltip?: boolean;

  /** The tooltip for a day, or nothing. */
  tooltipMessages?: (date: Date) => ReactNode;

  /** Cover the grid with a skeleton and stop navigation. */
  loading?: boolean;

  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewHeaderProps {
  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewNavProps {
  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewFooterProps {
  /** Merged with the part's own classes. */
  className?: string;
}

export interface CalendarPreviewResetProps {
  /** Merged with the part's own classes. */
  className?: string;
}

/** What the enclosing root exposes to a custom part. */
export interface UseCalendarReturn {
  /** The committed day, or null. */
  value: Date | null;

  /** Commit a day, or clear with `null`. Emits `onValueChange`. */
  setValue: (value: Date | null) => void;

  /** The granularity the value is committed at. Read-only until phase 5. */
  scale: 'day' | 'month' | 'quarter' | 'halfYear' | 'year';

  /** The first month currently displayed. */
  month: Date;

  /** Move the view. Bounds never clamp it. */
  setMonth: (month: Date) => void;

  /** Whether a day is out of bounds or rejected. */
  isDateUnavailable: (date: Date) => boolean;
}

/** The second argument to `onValueChange`. */
export interface CalendarPreviewChangeDetails {
  /** What caused the change. */
  reason: 'select' | 'input' | 'clear' | 'reset' | 'scale';

  /** Both edges of the period. At day scale they are the same day. */
  period: { start: string; end: string };

  /** The day acted on — never null, even when the value is. */
  toDate: () => Date;
}
