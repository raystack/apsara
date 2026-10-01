import { CalendarPreviewInputProps } from '../calendar-preview/props';
import { PopoverContentProps } from '../popover/props';

export interface FilterChipProps {
  /** Text label for the filter (required) */
  label: string;

  /** Current value of the filter. `multiselect` takes a `string[]`; `date`
   * takes a `Date` (a string or epoch number is parsed for you). */
  value?: string | string[] | number | Date;

  /** Type of input for the filter
   * @default "string"
   */
  columnType?: 'select' | 'multiselect' | 'date' | 'string' | 'number';

  /** Filterchip variant
   * @default "default"
   */
  variant?: 'default' | 'text';

  /** Array of options for the select and multiselect type inputs */
  options?: { label: string; value: string }[];

  /** Optional array of operations for the type of filter operation */
  operations?: { label: string; value: string }[];

  /** Callback when the filter value changes; receives the value and the active operation */
  onValueChange?: (
    value: string | string[] | number | Date,
    operation: string
  ) => void;

  /** Callback when the filter operation changes */
  onOperationChange?: (operation: string) => void;

  /** Icon element to display before the label */
  leadingIcon?: React.ReactNode;

  /** Callback to remove the filter chip */
  onRemove?: () => void;

  /** Props forwarded to the underlying Select component. Refer to Select component for full props list. */
  selectProps?: {
    autocomplete?: boolean;
    autocompleteMode?: 'auto' | 'manual';
    onSearch?: (value: string) => void;
    searchValue?: string;
    defaultSearchValue?: string;
  };

  /** Props for the date control at `columnType="date"`. `timeZone` through `today` are CalendarPreview props. */
  calendarProps?: {
    /** Formats the selected date for the input. The chip calls it with a `Date` and the `timeZone`. */
    formatValue?: (date: Date, timeZone?: string) => string;
    /** The zone the calendar reads days in. DataView and DataTable filter in the viewer's zone, so a different zone can shift the filter day. */
    timeZone?: string;
    minDate?: Date;
    maxDate?: Date;
    isDateUnavailable?: (date: Date) => boolean;
    yearRange?: { from: number; to: number };
    defaultMonth?: Date;
    today?: Date;
    /** Props for the date input (`CalendarPreview.Input`) and its popup (`CalendarPreview.Content`). */
    slotProps?: {
      input?: Omit<CalendarPreviewInputProps, 'field'>;
      popover?: Omit<PopoverContentProps, 'children'>;
    };
    /**
     * Shows the calendar icon in the date input.
     * @default false
     */
    showCalendarIcon?: boolean;
    /** Called with a message when the typed date is invalid, and with `undefined` when it is valid again. */
    onErrorChange?: (error: string | undefined) => void;
  };

  /** Additional CSS class names */
  className?: string;
}
