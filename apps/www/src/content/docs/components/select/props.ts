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
  /** Defines the size of the trigger.
   * @default "medium"
   */
  size?: 'small' | 'medium';

  /** Visual style variant.
   * @default "outline"
   */
  variant?: 'outline' | 'text';

  /** Props for the chevron icon. */
  iconProps?: Record<string, unknown>;

  /** Whether the element supplied through `render` is a native button.
   * Set to false when the rendered element is not a button, so Base UI
   * skips button-only attributes and behaviors.
   * @defaultValue true
   */
  nativeButton?: boolean;

  /** Accessible label for the trigger. Falls back to "Select option" when omitted.
   * The trigger also accepts all native button attributes, including
   * `aria-describedby`, `aria-required`, and `aria-invalid`.
   */
  'aria-label'?: string;
}

export interface SelectValueProps {
  /** Text shown when no item is selected. */
  placeholder?: string;

  /**
   * Content shown in place of the selected item's label.
   * A function receives the selected item, or an array of items when `multiple` is set.
   *
   * @remarks `ReactNode | function`
   */
  children?:
    | React.ReactNode
    | ((
        value?:
          | { value: string; leadingIcon?: React.ReactNode }
          | { value: string; leadingIcon?: React.ReactNode }[]
      ) => React.ReactNode);

  /** Additional CSS class names */
  className?: string;
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

  /**
   * Overlaps the trigger so the selected item's text lines up with the trigger's value. Has no effect in autocomplete mode.
   * @default false
   */
  alignItemWithTrigger?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /**
   * Corner radius for this popup only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
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
  /**
   * Whether the select is required. When `false`, an optional
   * indicator (see `optionalText`) is rendered next to the label.
   */
  required?: boolean;

  /**
   * Text rendered next to the label when `required={false}`.
   * @defaultValue "(optional)"
   */
  optionalText?: string;

  /** Text rendered next to the label when `required={true}`. No indicator is rendered if this is omitted. */
  requiredText?: string;

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

export interface SelectGroupLabelProps {
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

export interface SelectEmptyProps {
  /** Content shown when the list has no items, or when no item matches the search. */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
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
