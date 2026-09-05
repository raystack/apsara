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

  /** Renders a value for display. Defaults to `DD/MM/YYYY` at day scale. */
  formatValue?: (value: Date, scale: string) => string;

  /** Forwarded to the grid. No conversion is done here. */
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
}

export interface CalendarPreviewDaysProps {
  /**
   * How many months the grid shows side by side. More than one moves the
   * caption and nav into each month's own header.
   * @default 1
   */
  numberOfMonths?: number;
}

export interface CalendarPreviewCaptionProps {
  /**
   * Turn the caption into a trigger for the month and year scroller.
   * @default false
   */
  dropdown?: boolean;
}

export interface CalendarPreviewGridProps {
  /** Always render six week rows, so the grid height never jumps. */
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
}

export interface CalendarPreviewInputProps {
  /**
   * Placeholder shown when there is no value.
   * @default "Select date"
   */
  placeholder?: string;

  /**
   * Icon at the end of the field. Pass `null` for a picker with no calendar
   * glyph — that variant is composition, not a prop.
   * @default <CalendarIcon />
   */
  trailingIcon?: ReactNode;

  /**
   * Called when the typed text starts or stops being a usable date.
   * @example onValidityChange={({ valid, reason }) => setError(reason)}
   */
  onValidityChange?: (validity: {
    valid: boolean;
    reason?: 'unparseable' | 'out-of-bounds' | 'unavailable';
  }) => void;

  /** Read and navigable, but not typeable. */
  readOnly?: boolean;
}
