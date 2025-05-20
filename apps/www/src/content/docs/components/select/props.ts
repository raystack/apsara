export interface SelectRootProps {
  /** Enables search functionality within the select */
  autocomplete?: boolean;

  /** Controls the autocomplete behavior mode
   * - "auto": Automatically filters items as user types
   * - "manual": Requires explicit filtering through onSearch callback
   * @default "auto"
   */
  autocompleteMode?: "auto" | "manual";

  /** Current search value for autocomplete */
  searchValue?: string;

  /** Initial search value for autocomplete */
  defaultSearchValue?: string;

  /** Callback fired when the search value changes */
  onSearch?: (value: string) => void;
}

export interface SelectTriggerProps {
  /** Defines the size of the trigger. */
  size?: "small" | "medium";

  /** Visual style variant. */
  variant?: "default" | "filter";

  /** Props for the chevron icon. */
  iconProps?: Record<string, any>;

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
   * Position of the content
   * @default "popper"
   */
  position?: "item-aligned" | "popper";

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectItemProps {
  /** The value of the item. */
  value: string;

  /** Props passed to the Text component. */
  textProps?: Record<string, any>;

  /** Additional CSS class names. */
  className?: string;
}
