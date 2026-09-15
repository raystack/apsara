import { ReactNode } from 'react';

type Scale = 'day' | 'month' | 'quarter' | 'halfYear' | 'year';

export interface CalendarPreviewProps {
  /**
   * Whether the grid picks one day or a span. A range is two edges or nothing;
   * the half-built state stays internal.
   * @default "single"
   */
  selection?: 'single' | 'range';

  /**
   * The selected value (controlled). Its shape follows the root: a `Date` by
   * default, `{ from, to }` at `selection="range"`, and `{ date, scale }` once
   * `scales` offers anything beyond `"day"` — `date` is a timeless
   * `"YYYY-MM-DD"`.
   */
  value?:
    | Date
    | { from: Date; to: Date }
    | { date: string; scale: Scale }
    | null;

  /** The initial value (uncontrolled). Same shape as `value`. */
  defaultValue?:
    | Date
    | { from: Date; to: Date }
    | { date: string; scale: Scale }
    | null;

  /**
   * Called when a value is committed or cleared, with the same shape as
   * `value`. `details.toDate()` returns the day acted on even when the value is
   * `null`. A range fires on a complete range or not at all.
   * @example onValueChange={(value, details) => console.log(details.reason)}
   */
  onValueChange?: (
    value:
      | Date
      | { from: Date; to: Date }
      | { date: string; scale: Scale }
      | null,
    details: {
      reason: 'select' | 'input' | 'clear' | 'reset' | 'scale';
      period: { start: string; end: string };
      toDate: () => Date;
    }
  ) => void;

  /** Whether the popover is open (controlled). Ignored by an inline calendar. */
  open?: boolean;

  /** @default false */
  defaultOpen?: boolean;

  /**
   * Called when the popover opens or closes. `details` is Base UI's own,
   * forwarded unchanged, so `details.reason` stays the union it narrows on.
   */
  onOpenChange?: (
    open: boolean,
    details: { reason?: string; event?: Event }
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
   * Reject individual days, on top of `minDate` / `maxDate`. Day scale only —
   * period cells never call it, and are bounded by `minDate` / `maxDate`
   * against the day they would emit.
   * @example isDateUnavailable={date => date.getDay() === 0}
   */
  isDateUnavailable?: (date: Date) => boolean;

  /**
   * The day `.Reset` restores. Read even when `value` is controlled, which
   * `defaultValue` is not. `null` is a default of nothing selected, so
   * `.Reset` clears; omitting the prop renders no button at all. It follows
   * the selection: a range at `selection="range"`, a period at a coarser
   * scale.
   */
  defaultDate?:
    | Date
    | { from: Date; to: Date }
    | { date: string; scale: Scale }
    | null;

  /**
   * Renders a value for display — every trigger, input and annotation goes
   * through it. Defaults to `DD MMM YYYY` at day scale, and the period's own
   * shorthand above it.
   */
  formatValue?: (
    value: Date | { date: string; scale: Scale },
    scale: Scale
  ) => string;

  /**
   * The granularities this root offers. One entry hides the switcher; anything
   * beyond `"day"` moves the value to `{ date, scale }`.
   *
   * The array form takes the scale-aware arm whatever it holds, so
   * `scales={['day']}` types the value as `{ date, scale }` while the bare
   * string `scales="day"` keeps it a `Date`. TypeScript cannot read an array's
   * contents, so the two spellings of a day-only calendar are not equivalent —
   * pass the string unless you want the period shape.
   * @default "day"
   * @example scales={['day', 'month', 'quarter']}
   */
  scales?: Scale | Scale[];

  /** The scale the picker opens on. Defaults to the first of `scales`. */
  defaultScale?: Scale;

  /** The active scale (controlled). */
  scale?: Scale;

  /** Called when the switcher moves. */
  onScaleChange?: (scale: Scale) => void;

  /**
   * Whether a period emits its last day rather than its first — an end field
   * wants 31 July from "July 2026", a start field wants the 1st. It changes the
   * value, not the formatting.
   * @default false
   */
  trailingValue?: boolean;

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
  /**
   * The committed value, or null. A day, a range at `selection="range"`, or a
   * period at a coarser scale — whichever shape this root holds.
   */
  value:
    | Date
    | { from: Date; to: Date }
    | { date: string; scale: Scale }
    | null;

  /** Commit a value, or clear with `null`. Emits `onValueChange`. */
  setValue: (
    value:
      | Date
      | { from: Date; to: Date }
      | { date: string; scale: Scale }
      | null
  ) => void;

  /**
   * The granularity the value is committed at. Read-only — switching scale is
   * `.Scales` and `.Scale`, which take `render` for custom chrome.
   */
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
   * Called when the typed text starts or stops being a usable date. `message`
   * is resolved against `errorMessages` and absent while valid, so it can be
   * handed straight to `Field`'s `error`.
   * @example onValidityChange={({ message }) => setError(message)}
   */
  onValidityChange?: (validity: {
    valid: boolean;
    reason?: 'unparseable' | 'out-of-bounds' | 'unavailable' | 'out-of-order';
    message?: string;
  }) => void;

  /**
   * Replaces the message for one or more reasons; anything left out keeps the
   * default.
   * @default "Invalid input", except out-of-order, which words itself
   */
  errorMessages?: Partial<
    Record<
      'unparseable' | 'out-of-bounds' | 'unavailable' | 'out-of-order',
      string
    >
  >;

  /** Read and navigable, but not typeable. */
  readOnly?: boolean;
}
