import { InputFieldProps } from "../input-field/props";

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
   * @defaultValue "DD/MM/YYYY"
   */
  dateFormat?: string;

  /** Callback function when date range is selected */
  onSelect?: (range: { from: Date; to: Date }) => void;

  /** Initial date range value */
  value?: { from: Date; to: Date };

  /** Props for customizing the calendar */
  calendarProps?: CalendarProps;

  /** Props for customizing the input fields */
  inputFieldsProps?: { 
    startDate?: InputFieldProps; 
    endDate?: InputFieldProps 
  };

  /** Render prop for custom trigger */
  children?: React.ReactNode;

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

  /** Props for customizing the input field */
  inputFieldProps?: InputFieldProps;

  /** Initial date value */
  value?: Date;

  /** Callback function when date is selected */
  onSelect?: (date: Date) => void;

  /** Props for customizing the calendar */
  calendarProps?: CalendarProps;

  /** Render prop for custom trigger */
  children?: React.ReactNode;

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
}
