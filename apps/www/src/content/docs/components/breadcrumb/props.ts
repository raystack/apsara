import { ReactElement } from 'react';

export interface BreadcrumbItem {
  /** Text to display for the item */
  label: string;
  /** URL for the item link */
  href?: string;
  /** Optional icon element to display */
  icon?: React.ReactNode;
  /** Optional array of dropdown items */
  dropdownItems?: {
    /** Text to display for the dropdown item */
    label: string;
    /** URL for the dropdown item link */
    href?: string;
  }[];
  /**
   * Custom element used to render the Item.
   *
   * All props are merged.
   *
   * @default "<a />"
   */
  as?: ReactElement;
}

export interface BreadcrumbProps {
  /**
   * Array of breadcrumb items.
   *
   * You can pass custom element to render using `as`
   */
  items: BreadcrumbItem[];

  /**
   * Size variant of the breadcrumb
   * @defaultValue "medium"
   */
  size?: 'small' | 'medium';

  /** Maximum number of items to display before showing ellipsis */
  maxVisibleItems?: number;

  /**
   * Custom separator between items
   * @defaultValue "/"
   */
  separator?: React.ReactNode;

  /** Callback function when an item is clicked */
  onItemClick?: (item: { label: string; href?: string }) => void;

  /** Custom CSS class names */
  className?: string;
}
