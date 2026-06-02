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

  /** Props forwarded to the underlying DatePicker for `columnType="date"`. Refer to DatePicker for full props list. `dateFormat` defaults to `"DD MMM YYYY"`. */
  calendarProps?: {
    dateFormat?: string;
    showCalendarIcon?: boolean;
    timeZone?: string;
    slotProps?: {
      input?: Record<string, unknown>;
      calendar?: Record<string, unknown>;
      popover?: Record<string, unknown>;
    };
  };

  /** Additional CSS class names */
  className?: string;
}
