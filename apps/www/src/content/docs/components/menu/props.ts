import { CSSProperties, ReactElement, ReactNode } from 'react';

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
   * @default false
   */
  loopFocus?: boolean;
}

export interface MenuTriggerProps {
  /** Render a custom element as the trigger using Base UI's render prop pattern */
  render?: ReactElement;

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
  render?: ReactElement;

  /** Inline styles */
  style?: CSSProperties;

  /** Additional CSS class names */
  className?: string;

  /**
   * Corner radius for this menu only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface MenuItemProps {
  /** Icon element to display before item text */
  leadingIcon?: ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Value of the item used for autocomplete matching. If not provided, `children` text content is used. */
  value?: string;

  /** Additional CSS class names */
  className?: string;

  /** Render a custom element using Base UI's render prop pattern */
  render?: ReactElement;
}

export interface MenuCheckboxItemProps {
  /** Whether the item is checked (controlled) */
  checked?: boolean;

  /** Whether the item is checked by default (uncontrolled)
   * @default false
   */
  defaultChecked?: boolean;

  /** Callback fired when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** Whether to close the menu when the item is clicked
   * @default false
   */
  closeOnClick?: boolean;

  /** Icon element to display before item text */
  leadingIcon?: ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Value of the item used for autocomplete matching. If not provided, `children` text content is used. */
  value?: string;

  /** Additional CSS class names */
  className?: string;

  /** Render a custom element using Base UI's render prop pattern. Replaces the default layout and check mark. */
  render?: ReactElement;
}

export interface MenuRadioGroupProps {
  /** The value of the checked radio item (controlled) */
  value?: unknown;

  /** The value of the radio item checked by default (uncontrolled) */
  defaultValue?: unknown;

  /** Callback fired when the checked radio item changes */
  onValueChange?: (value: unknown) => void;

  /** Whether all radio items in the group are disabled
   * @default false
   */
  disabled?: boolean;

  /** Additional CSS class names */
  className?: string;
}

export interface MenuRadioItemProps {
  /** Value of the radio item. Also used for autocomplete matching when it is a string. */
  value: unknown;

  /** Whether to close the menu when the item is clicked
   * @default false
   */
  closeOnClick?: boolean;

  /** Icon element to display before item text */
  leadingIcon?: ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Additional CSS class names */
  className?: string;

  /** Render a custom element using Base UI's render prop pattern. Replaces the default layout and dot. */
  render?: ReactElement;
}

export interface MenuLinkItemProps {
  /** The URL the link points to */
  href?: string;

  /** Whether to close the menu when the link is clicked
   * @default false
   */
  closeOnClick?: boolean;

  /** Icon element to display before item text */
  leadingIcon?: ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: ReactNode;

  /** Value of the item used for autocomplete matching. If not provided, `children` text content is used. */
  value?: string;

  /** Additional CSS class names */
  className?: string;

  /** The link element to render, for example a router link. The item keeps its layout and icons.
   * @default <a />
   */
  render?: ReactElement;
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
  /** Content to show when the menu has no items or nothing matches the search */
  children: ReactNode;

  /** Additional CSS class names */
  className?: string;
}

export interface MenuStatusProps {
  /** Text to announce. A function receives the number of matching items.
   * @default count => `${count} results`
   */
  children?: ReactNode | ((count: number) => ReactNode);

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
  leadingIcon?: ReactNode;

  /** Icon element to display after trigger text. Defaults to a chevron right icon. */
  trailingIcon?: ReactNode;

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
  render?: ReactElement;

  /** Inline styles */
  style?: CSSProperties;

  /** Additional CSS class names */
  className?: string;

  /**
   * Corner radius for this submenu only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}
