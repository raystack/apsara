export interface SelectRootProps {
  /** Enables multiple selection.
   * When enabled, value, onValueChange, and defaultValue will be an array of strings.
   * @default false
   */
  multiple?: boolean;

  /** The controlled value of the select. */
  value?: string | string[];

  /** The default value when uncontrolled. */
  defaultValue?: string | string[];

  /** Callback fired when the value changes. */
  onValueChange?: (value: string | string[]) => void;

  /** Enables search functionality within the select using a combobox.
   * @default false
   */
  autocomplete?: boolean;

  /** Controls the autocomplete behavior mode.
   * - "auto": Automatically filters items as user types
   * - "manual": Requires explicit filtering through onSearch callback
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';

  /** Current search value for autocomplete (controlled). */
  searchValue?: string;

  /** Initial search value for autocomplete (uncontrolled). */
  defaultSearchValue?: string;

  /** Callback fired when the search value changes. */
  onSearch?: (value: string) => void;

  /** Whether the select popup is open (controlled). */
  open?: boolean;

  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;

  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Whether the select is disabled. */
  disabled?: boolean;

  /** Whether the select is required. */
  required?: boolean;

  /** The name of the select for form submission. */
  name?: string;

  /** List of items for combobox native filtering (autocomplete mode only). */
  items?: string[];
}

export interface SelectTriggerProps {
  /** Defines the size of the trigger.
   * @default "medium"
   */
  size?: 'small' | 'medium';

  /** Visual style variant.
   * @default "outline"
   */
  variant?: 'outline' | 'text';

  /** Props for the chevron icon. */
  iconProps?: Record<string, any>;

  /** Accessible label for the trigger. */
  'aria-label'?: string;

  /** Whether the trigger is disabled. */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectContentProps {
  /** Placeholder text for the autocomplete search input.
   * Only shown in autocomplete mode.
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /** Offset from the trigger element in pixels.
   * @default 4
   */
  sideOffset?: number;

  /** Additional CSS class names. */
  className?: string;

  /** Additional inline styles. */
  style?: React.CSSProperties;
}

export interface SelectValueProps {
  /** Placeholder text displayed when no value is selected. */
  placeholder?: string;

  /** Custom render function or static content.
   * When a function, receives the selected item data as an argument.
   */
  children?: ((value?: any) => React.ReactNode) | React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectItemProps {
  /** The value of the item. */
  value: string;

  /** An icon to display before the item label. */
  leadingIcon?: React.ReactNode;

  /** Whether the item is disabled. */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /** The item label content. */
  children: React.ReactNode;
}

export interface SelectGroupProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface SelectLabelProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface SelectSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}
