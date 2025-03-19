export interface CalendarProps {
  /** Number of months to display */
  numberOfMonths?: number;

  /** Layout for the month caption (e.g., "dropdown") */
  captionLayout?: string;

  /** Boolean to show loading state */
  loadingData?: boolean;

  /** Object containing date-specific information like icons and text */
  dateInfo?: Record<string, unknown>;

  /** Boolean to show days from previous/next months */
  showOutsideDays?: boolean;

  /** Additional CSS class names */
  className?: string;
}

export interface RangePickerProps {
  /** Format for displaying the date (e.g., "DD/MM/YYYY") */
  dateFormat?: string;

  /** Callback function when date range is selected */
  onSelect?: (range: { start: Date; end: Date }) => void;

  /** Initial date range value */
  value?: { start: Date; end: Date };

  /** Props for customizing the calendar */
  calendarProps?: CalendarProps;

  /** Props for customizing the text field */
  textFieldProps?: Record<string, unknown>;

  /** Render prop for custom trigger */
  children?: React.ReactNode;

  /**
   * Boolean to show/hide calendar icon
   * @defaultValue true
   */
  showCalendarIcon?: boolean;
}

export interface DatePickerProps {
  /** Props for customizing the text field */
  textFieldProps?: Record<string, unknown>;

  /** Render prop for custom trigger */
  children?: React.ReactNode;

  /**
   * Boolean to show/hide calendar icon
   * @defaultValue true
   */
  showCalendarIcon?: boolean;
}
