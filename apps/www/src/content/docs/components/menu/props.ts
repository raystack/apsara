export interface MenuRootProps {
  /** Enables search functionality within the menu */
  autocomplete?: boolean;

  /** Controls the autocomplete behavior mode
   * - "auto": Automatically filters items as user types
   * - "manual": Requires explicit filtering through onInputValueChange callback
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';

  /** Current search input value (controlled) */
  inputValue?: string;

  /** Initial search input value (uncontrolled)
   * @default ""
   */
  defaultInputValue?: string;

  /** Callback fired when the search input value changes */
  onInputValueChange?: (value: string) => void;

  /** Control the open state of the menu */
  open?: boolean;

  /** Whether the menu is open by default (uncontrolled)
   * @default false
   */
  defaultOpen?: boolean;

  /** Callback fired when the menu is opened or closed */
  onOpenChange?: (open: boolean) => void;

  /** Whether the menu is modal (traps focus and blocks outside interaction)
   * @default true
   */
  modal?: boolean;

  /** Whether the menu should loop focus when navigating with keyboard
   * @default true
   */
  loopFocus?: boolean;
}

export interface MenuTriggerProps {
  /** Render a custom element as the trigger using Base UI's render prop pattern */
  render?: React.ReactElement;

  /** Whether the menu should stop propagation of the click event
   * @default true
   */
  stopPropagation?: boolean;
}

export interface MenuContentProps {
  /** Placeholder text for the autocomplete search input
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * The distance between the popup and the anchor element.
   * @default 4
   */
  sideOffset?: number;

  /**
   * The side of the anchor element to place the popup.
   * @default "bottom"
   */
  side?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * The alignment of the popup relative to the anchor element.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';

  /** Render a custom element using Base UI's render prop pattern */
  render?: React.ReactElement;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Additional CSS class names */
  className?: string;
}

export interface MenuItemProps {
  /** Icon element to display before item text */
  leadingIcon?: React.ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: React.ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Value of the item used for autocomplete matching. If not provided, `children` text content is used. */
  value?: string;

  /** Additional CSS class names */
  className?: string;

  /** Render a custom element using Base UI's render prop pattern */
  render?: React.ReactElement;
}

export interface MenuGroupProps {
  /** Additional CSS class names */
  className?: string;
}

export interface MenuLabelProps {
  /** Additional CSS class names */
  className?: string;
}

export interface MenuSeparatorProps {
  /** Additional CSS class names */
  className?: string;
}

export interface MenuEmptyStateProps {
  /** React nodes to render in empty state */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}

export interface MenuSubMenuProps {
  /** Enables search functionality within the submenu */
  autocomplete?: boolean;

  /** Controls the autocomplete behavior mode for the submenu
   * - "auto": Automatically filters items as user types
   * - "manual": Requires explicit filtering through onInputValueChange callback
   * @default "auto"
   */
  autocompleteMode?: 'auto' | 'manual';

  /** Current search input value (controlled) */
  inputValue?: string;

  /** Initial search input value (uncontrolled)
   * @default ""
   */
  defaultInputValue?: string;

  /** Callback fired when the search input value changes */
  onInputValueChange?: (value: string) => void;

  /** Control the open state of the submenu */
  open?: boolean;

  /** Whether the submenu is open by default (uncontrolled)
   * @default false
   */
  defaultOpen?: boolean;

  /** Callback fired when the submenu is opened or closed */
  onOpenChange?: (open: boolean) => void;
}

export interface MenuSubTriggerProps {
  /** Icon element to display before trigger text */
  leadingIcon?: React.ReactNode;

  /** Icon element to display after trigger text. Defaults to a chevron right icon. */
  trailingIcon?: React.ReactNode;

  /** Value used for autocomplete matching when inside a searchable parent menu */
  value?: string;
}

export interface MenuSubContentProps {
  /** Placeholder text for the autocomplete search input
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * The distance between the popup and the anchor element.
   * @default 2
   */
  sideOffset?: number;

  /**
   * The side of the anchor element to place the popup.
   * @default "bottom"
   */
  side?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * The alignment of the popup relative to the anchor element.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';

  /** Render a custom element using Base UI's render prop pattern */
  render?: React.ReactElement;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Additional CSS class names */
  className?: string;
}
