export interface DropdownMenuRootProps {
  /** Enables search functionality within the dropdown menu */
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

  /** Placement of the dropdown relative to the trigger
   * @default "bottom-start""
   */
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

  /** Whether the dropdown should loop focus when navigating with keyboard
   * @default true
   */
  focusLoop?: boolean;

  /** Control the open state of the dropdown
   * @default false
   */
  open?: boolean;

  /** Callback fired when the dropdown is opened or closed */
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownMenuTriggerProps {
  /** Boolean to merge props onto child element */
  asChild?: boolean;

  /** Whether the dropdown should stop propagation of the click event
   * @default true
   */
  stopPropagation?: boolean;
}

export interface DropdownMenuContentProps {
  /** Placeholder text for the autocomplete search input
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * The distance between the popover and the anchor element.
   * @default 4
   */
  gutter?: number;

  /**
   * The skidding of the popover along the anchor element. Can be set to negative values to make the popover shift to the opposite side.
   * @default 0
   */
  shift?: number;

  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuItemProps {
  /** Icon element to display before item text */
  leadingIcon?: React.ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: React.ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Value of the item to be used for autocomplete */
  value?: string;

  /** Additional CSS class names */
  className?: string;

  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuGroupProps {
  /** Additional CSS class names */
  className?: string;

  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuLabelProps {
  /** Additional CSS class names */
  className?: string;

  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuSeparatorProps {
  /** Additional CSS class names */
  className?: string;

  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuEmptyStateProps {
  /** React nodes to render in empty state */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
