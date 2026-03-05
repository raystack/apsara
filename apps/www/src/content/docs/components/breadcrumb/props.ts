import { ReactElement, ReactEventHandler, ReactNode } from 'react';

export interface BreadcrumbItem {
  /** Text to display for the item */
  label: string;

  /** URL for the item link */
  href?: string;

  /** Optional icon element to display before the label */
  leadingIcon?: ReactNode;

  /** Optional icon element to display after the label */
  trailingIcon?: ReactNode;

  /**
   * Whether the item is the current page
   * @defaultValue false
   */
  current?: boolean;

  /**
   * When true, the item is non-clickable and visually muted (e.g. loading or no access).
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Optional array of dropdown items
   *
   * When `dropdownItems` is provided, the `as` and `href` props are ignored.
   */
  dropdownItems?: {
    /** Text to display for the dropdown item */
    label: string;
    /** Callback function when a dropdown item is clicked */
    onClick?: ReactEventHandler<HTMLDivElement>;
  }[];

  /**
   * Custom element used to render the Item.
   *
   * All props are merged, with the custom component's props taking precedence over the breadcrumb item's props.
   *
   * @default "<a />"
   */
  as?: ReactElement;

  /** Custom CSS class name applied to the list item wrapper */
  className?: string;
}

export interface BreadcrumbProps {
  /**
   * Size variant of the breadcrumb
   * @defaultValue "medium"
   */
  size?: 'small' | 'medium';

  /**
   * Maximum number of breadcrumb items to show. When there are more items, the list is collapsed.
   * When collapsed: at least 1 item is always shown at the start and 1 at the end (minimum 2 visible items; there cannot be fewer than 2).
   * Values less than 2 are treated as 2.
   */
  maxItems?: number;

  /**
   * Number of items to show before the ellipsis when collapsed.
   * When not set, derived from maxItems (e.g. maxItems=5 → 2 before, rest after).
   */
  itemsBeforeCollapse?: number;

  /** Custom CSS class names */
  className?: string;
}

export interface BreadcrumbSeparatorProps {
  /**
   * Custom separator between items
   * @defaultValue "/"
   */
  children?: ReactNode;
  /** Custom CSS class names */
  className?: string;
}

export interface BreadcrumbEllipsisProps {
  /**
   * Custom ellipsis element
   * @defaultValue <DotsHorizontalIcon />
   */
  children?: ReactNode;
  /** Custom CSS class names */
  className?: string;
}
