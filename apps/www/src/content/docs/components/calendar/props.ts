import { InputProps } from '../input/props';
import { PopoverContentProps } from '../popover/props';

export interface CalendarProps {
  /**
   * Number of months to render side-by-side.
   * @example numberOfMonths={2}
   */
  numberOfMonths?: number;

  /**
   * Caption layout: plain label or month/year dropdown(s).
   * @example captionLayout="dropdown"
   */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';

  /**
   * Earliest navigable month (was `fromYear` / `fromMonth` — both deprecated).
   * Bounds the chevrons and the year dropdown.
   * @example startMonth={new Date(2020, 0)}
   */
  startMonth?: Date;

  /**
   * Latest navigable month (was `toYear` / `toMonth` — both deprecated).
   * Bounds the chevrons and the year dropdown.
   * @example endMonth={new Date(2030, 11)}
   */
  endMonth?: Date;

  /** Initial visible month (uncontrolled). */
  defaultMonth?: Date;

  /** Controlled visible month — pair with `onMonthChange`. */
  month?: Date;

  /** Fires when the visible month changes (chevron paging, dropdown). */
  onMonthChange?: (month: Date) => void;

  /**
   * Selection mode.
   * @defaultValue "single"
   */
  mode?: 'single' | 'multiple' | 'range';

  /** Currently selected date(s). Shape depends on `mode`. */
  selected?: Date | Date[] | { from: Date; to?: Date };

  /** Fires when the user picks a date. */
  onSelect?: (selected: Date | Date[] | { from: Date; to?: Date }) => void;

  /** Day on which the week starts. 0 = Sunday, 1 = Monday, …, 6 = Saturday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Show week numbers in a leading column. */
  showWeekNumber?: boolean;

  /**
   * Disabled dates. Accepts a Date, an array, a matcher object
   * (e.g. `{ before: date }`, `{ after: date }`, `{ from, to }`), or a
   * predicate.
   */
  disabled?:
    | Date
    | Date[]
    | { before?: Date; after?: Date; from?: Date; to?: Date }
    | ((date: Date) => boolean);

  /**
   * Hidden dates (was `fromDate` / `toDate` — both deprecated; use
   * `hidden={{ before: date }}` / `hidden={{ after: date }}`).
   * Same matcher options as `disabled`.
   */
  hidden?:
    | Date
    | Date[]
    | { before?: Date; after?: Date; from?: Date; to?: Date }
    | ((date: Date) => boolean);

  /**
   * Boolean to show loading state.
   * @example loadingData={true}
   */
  loadingData?: boolean;

  /**
   * Enable tooltips on dates that have a matching `tooltipMessages` entry.
   * @defaultValue false
   */
  showTooltip?: boolean;

  /**
   * Tooltip text keyed by date string in `"dd-MM-yyyy"` format. Lookup is
   * timezone-aware when `timeZone` is set.
   * @example tooltipMessages={{ "15-01-2024": "Holiday" }}
   */
  tooltipMessages?: Record<string, React.ReactNode>;

  /**
   * Custom React components to render above each date.
   * Can be either:
   * - An object with date strings in "dd-MM-yyyy" format as keys
   * - A function that receives a Date and returns a ReactNode or null
   * The component will be rendered above the date number.
   *
   * @example
   * // Object approach (static data)
   * dateInfo={{ "15-01-2024": <div><Icon /> 17%</div> }}
   *
   * @example
   * // Function approach (dynamic logic)
   * dateInfo={(date) => date.getDay() === 0 ? <div>Sunday</div> : null}
   */
  dateInfo?:
    | Record<string, React.ReactNode>
    | ((date: Date) => React.ReactNode | null);

  /** Fires when the year/month dropdown opens (only with `captionLayout="dropdown"`). */
  onDropdownOpen?: () => void;

  /** Boolean to show days from previous/next months */
  showOutsideDays?: boolean;

  /** Footer rendered below the month grid. */
  footer?: React.ReactNode;

  /** Per-element class name overrides passed through to DayPicker. */
  classNames?: Record<string, string>;

  /** Additional CSS class names */
  className?: string;

  /**
   * IANA timezone name (e.g., "America/New_York"), "UTC", or UTC offset (e.g., "+02:00").
   * If not provided, uses the local timezone.
   */
  timeZone?: string;
}

export interface RangePickerProps {
  /**
   * Format for displaying the date. Supports various formats:
   * - With slashes: "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"
   * - With dashes: "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"
   * - With dots: "DD.MM.YYYY", "MM.DD.YYYY", "YYYY.MM.DD"
   * - With spaces: "DD MMM YYYY", "MMM DD YYYY", "YYYY MMM DD"
   * - With full month: "DD MMMM YYYY", "MMMM DD YYYY", "YYYY MMMM DD"
   * - For more supported formats, refer to https://day.js.org/docs/en/display/format
   * @defaultValue "DD/MM/YYYY"
   */
  dateFormat?: string;

  /**
   * Fires on every step of range selection — not only on the completed range.
   * Both fields are optional during partial selection; gate on `range.to` if
   * you only want completed ranges.
   */
  onSelect?: (range: { from?: Date; to?: Date }) => void;

  /** Initial (uncontrolled) date range. */
  defaultValue?: { from?: Date; to?: Date };

  /** Controlled date range. */
  value?: { from?: Date; to?: Date };

  /**
   * Props for each picker slot. When both this and the legacy
   * `inputsProps` / `calendarProps` / `popoverProps` are set, `slotProps` wins.
   *
   * Input event handlers (`onChange`, `onFocus`, `onBlur`, `onKeyUp`) are not
   * forwarded — use `onSelect` for value changes.
   */
  slotProps?: {
    startInput?: InputProps;
    endInput?: InputProps;
    calendar?: CalendarProps;
    popover?: PopoverContentProps;
  };

  /** @deprecated Use `slotProps.calendar` instead. */
  calendarProps?: CalendarProps;

  /** @deprecated Use `slotProps.startInput` / `slotProps.endInput` instead. */
  inputsProps?: {
    startDate?: InputProps;
    endDate?: InputProps;
  };

  /**
   * Render prop or custom trigger. Pass a function to render a custom trigger
   * receiving the formatted `startDate` / `endDate` strings, or a ReactNode to
   * replace the default inputs entirely.
   *
   * @example
   * <RangePicker>
   *   {({ startDate, endDate }) => (
   *     <button>{startDate} – {endDate}</button>
   *   )}
   * </RangePicker>
   */
  children?:
    | React.ReactNode
    | ((props: { startDate: string; endDate: string }) => React.ReactNode);

  /**
   * Boolean to show/hide calendar icon
   * @defaultValue true
   */
  showCalendarIcon?: boolean;

  /** Optional footer content for the calendar popover */
  footer?: React.ReactNode;

  /**
   * IANA timezone name (e.g., "America/New_York"), "UTC", or UTC offset (e.g., "+02:00").
   * If not provided, uses the local timezone.
   */
  timeZone?: string;

  /** @deprecated Use `slotProps.popover` instead. */
  popoverProps?: PopoverContentProps;
}

export interface DatePickerProps {
  /**
   * Format for displaying the date. Supports various formats:
   * - With slashes: "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"
   * - With dashes: "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"
   * - With dots: "DD.MM.YYYY", "MM.DD.YYYY", "YYYY.MM.DD"
   * - With spaces: "DD MMM YYYY", "MMM DD YYYY", "YYYY MMM DD"
   * - With full month: "DD MMMM YYYY", "MMMM DD YYYY", "YYYY MMMM DD"
   * @defaultValue "DD/MM/YYYY"
   */
  dateFormat?: string;

  /**
   * Props for each picker slot. When both this and the legacy
   * `inputProps` / `calendarProps` / `popoverProps` are set, `slotProps` wins.
   *
   * Input event handlers (`onChange`, `onFocus`, `onBlur`, `onKeyUp`) are not
   * forwarded — use `onSelect` for value changes.
   */
  slotProps?: {
    input?: InputProps;
    calendar?: CalendarProps;
    popover?: PopoverContentProps;
  };

  /** @deprecated Use `slotProps.input` instead. */
  inputProps?: InputProps;

  /**
   * Controlled date value. Pair with `onSelect`. Omit (along with
   * `defaultValue`) to start the picker in an unselected state — the
   * input shows its placeholder until the user selects a date.
   */
  value?: Date;

  /**
   * Initial (uncontrolled) date value. Ignored if `value` is set. Omit to
   * start unselected.
   */
  defaultValue?: Date;

  /** Callback function when date is selected */
  onSelect?: (date: Date) => void;

  /** @deprecated Use `slotProps.calendar` instead. */
  calendarProps?: CalendarProps;

  /**
   * Render prop or custom trigger. Pass a function to render a custom trigger
   * receiving the formatted `selectedDate` string, or a ReactNode to replace
   * the default input entirely.
   *
   * @example
   * <DatePicker>
   *   {({ selectedDate }) => (
   *     <button>Selected: {selectedDate}</button>
   *   )}
   * </DatePicker>
   */
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);

  /**
   * Boolean to show/hide calendar icon
   * @defaultValue true
   */
  showCalendarIcon?: boolean;

  /**
   * IANA timezone name (e.g., "America/New_York"), "UTC", or UTC offset (e.g., "+02:00").
   * If not provided, uses the local timezone.
   */
  timeZone?: string;

  /** @deprecated Use `slotProps.popover` instead. */
  popoverProps?: PopoverContentProps;
}
