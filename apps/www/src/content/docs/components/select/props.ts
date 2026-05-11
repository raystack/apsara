export interface SelectRootProps {
  /** Enables multiple selection.
   * When enabled, value, onValueChange, and defaultValue will be an array of strings.
   * @default false
   */
  multiple?: boolean;

  /** Enables search functionality within the select.
   * @default false
   */
  autocomplete?: boolean;

  /** Controls the autocomplete behavior mode
   * - "auto": Automatically filters items as user types
   * - "manual": Requires explicit filtering through onSearch callback
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';

  /** Current search value for autocomplete */
  searchValue?: string;

  /** Initial search value for autocomplete */
  defaultSearchValue?: string;

  /** Callback fired when the search value changes */
  onSearch?: (value: string) => void;
}

export interface SelectTriggerProps {
  /** Defines the size of the trigger. */
  size?: 'small' | 'medium';

  /** Visual style variant. */
  variant?: 'default' | 'filter';

  /** Props for the chevron icon. */
  iconProps?: Record<string, unknown>;

  /** Accessible label. */
  ariaLabel?: string;

  /** ID of element describing the select. */
  ariaDescribedby?: string;

  /** Whether the select is required. */
  ariaRequired?: boolean;

  /** Whether the select has an invalid value. */
  ariaInvalid?: boolean;
}

export interface SelectContentProps {
  /** Placeholder text for the autocomplete search input
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Which side of the trigger to render the content on.
   * @default "bottom"
   */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

  /**
   * Alignment of the content relative to the trigger along the chosen side.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Distance in pixels between the trigger and the content.
   * @default 4
   */
  sideOffset?: number;

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectItemProps {
  /** The value of the item. */
  value: string;

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectGroupProps {
  /** Additional CSS class names */
  className?: string;

  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;
}

export interface SelectLabelProps {
  /** Additional CSS class names */
  className?: string;

  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;
}

export interface SelectSeparatorProps {
  /** Additional CSS class names */
  className?: string;

  /**
   * Allows rendering as a different element.
   * Accepts a React element or a function that receives props and returns an element.
   *
   * @remarks `ReactElement | function`
   */
  render?: React.ReactElement;
}
