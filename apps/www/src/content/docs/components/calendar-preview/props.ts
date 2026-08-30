export type CalendarSelection = 'single' | 'range' | 'multiple';

export type CalendarGranularity =
  | 'day'
  | 'month'
  | 'quarter'
  | 'half-year'
  | 'year';

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

export interface CalendarPreviewProps {
  /**
   * What may be selected. `range` pairs with `CalendarPreview.RangeInput`.
   * @defaultValue 'single'
   */
  selection?: CalendarSelection;

  /** The selected value (controlled). Shape follows `selection`. */
  value?: Date | DateRangeValue | Date[] | null;
  /** The initially selected value (uncontrolled). */
  defaultValue?: Date | DateRangeValue | Date[] | null;
  /**
   * Called with the complete value on every change. The second argument names
   * the granularity that produced it: a month pick emits the first day of that
   * month, so without it `1 June` chosen as a day is indistinguishable from
   * June chosen as a month.
   */
  onValueChange?: (
    value: Date | DateRangeValue | Date[] | null,
    details: { granularity: CalendarGranularity }
  ) => void;

  /** Whether the popover is open (controlled). */
  open?: boolean;
  /** @defaultValue false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details?: { reason?: string }) => void;

  /**
   * The visible month (controlled). Independent of the selected value, but
   * initialised from it when no `defaultMonth` is given.
   */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  /** The active granularity (controlled). */
  granularity?: CalendarGranularity;
  /** @defaultValue 'day' */
  defaultGranularity?: CalendarGranularity;
  onGranularityChange?: (granularity: CalendarGranularity) => void;
  /**
   * Granularities the user may switch between. `CalendarPreview.GranularityTabs`
   * renders only when there is more than one.
   * @defaultValue the active granularity
   */
  granularities?: CalendarGranularity[];

  /** Earliest selectable date, inclusive. */
  minDate?: Date;
  /** Latest selectable date, inclusive. */
  maxDate?: Date;
  /** Marks individual dates unselectable without react-day-picker matchers. */
  isDateUnavailable?: (date: Date) => boolean;

  /**
   * Display and input format for typed fields at the `day` granularity. The
   * other granularities read as `Jun 2026`, `Q3 2026`, `H1 2026` and `2026`.
   * @defaultValue 'DD MMM YYYY'
   */
  format?: string;
  /** IANA time zone applied to parsing, formatting and the grid. */
  timeZone?: string;
  /** @defaultValue 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * `'immediate'` fires `onValueChange` on every interaction. `'explicit'`
   * buffers edits until `CalendarPreview.Apply` commits them.
   * @defaultValue 'immediate'
   */
  commit?: 'immediate' | 'explicit';

  /**
   * Range only. Holds one endpoint read-only in both the input and the grid,
   * so "fix the start, pick the end" does not disable the whole picker.
   */
  lock?: 'from' | 'to';

  /**
   * Reports whether a typed value parses and lands in range. Renders no error
   * UI — compose in `Field` for that.
   */
  onValidityChange?: (validity: {
    valid: boolean;
    reason?: 'unparseable' | 'out-of-bounds' | 'unavailable';
  }) => void;

  /**
   * Replaces the caption and the grid with a shimmer and disables every
   * control, rather than leaving the chrome live while the grid loads.
   * @defaultValue false
   */
  loading?: boolean;

  /** @defaultValue false */
  disabled?: boolean;
  /** Shows the value but refuses edits. @defaultValue false */
  readOnly?: boolean;
}

export interface CalendarPreviewTriggerProps {
  /** Element to render as. Never a `<button>` — it may contain an input. */
  render?: React.ReactElement;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewContentProps {
  /** @defaultValue 'bottom' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** @defaultValue 'start' */
  align?: 'start' | 'center' | 'end';
  /** @defaultValue 4 */
  sideOffset?: number;
  /**
   * Pass `false` when the trigger contains a typed field, or the popup takes
   * focus on open and keystrokes never reach it.
   */
  initialFocus?: boolean;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewInputProps {
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewRangeInputProps {
  /** Props for the start field. */
  startProps?: Record<string, unknown>;
  /** Props for the end field. */
  endProps?: Record<string, unknown>;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewNavProps {
  /**
   * Where the caption sits relative to the buttons.
   * @defaultValue 'start'
   */
  align?: 'start' | 'end';
  /** @defaultValue 'MMMM YYYY' */
  captionFormat?: string;
  /**
   * How many months the grid beside it shows. Keep in step with `Grid`'s
   * `months`, or the caption names a month the grid does not show alone.
   * @defaultValue 1
   */
  months?: 1 | 2;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewGridProps {
  /** @defaultValue 1 */
  months?: 1 | 2;
  /** @defaultValue false */
  showOutsideDays?: boolean;
  /** @defaultValue false */
  showWeekNumber?: boolean;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewMonthGridProps {
  /**
   * Years either side of the active one to offer when unbounded by `minDate`
   * or `maxDate`.
   * @defaultValue 5
   */
  yearWindow?: number;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewGranularityTabsProps {
  /** Override the label for one or more granularities. */
  labels?: Partial<Record<CalendarGranularity, string>>;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewPresetsProps {
  /**
   * A column beside the grid, or a row above it.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewPresetProps {
  /** The value this preset applies. Use for `single` and `multiple`. */
  value?: Date | Date[] | null;
  /** The range this preset applies. Required when `selection="range"`. */
  range?: DateRangeValue;
  /** Render as another element — an Apsara `Button`, say. */
  render?: React.ReactElement;
  /** Custom CSS class names */
  className?: string;
}

export interface CalendarPreviewFooterProps {
  /** Custom CSS class names */
  className?: string;
}
