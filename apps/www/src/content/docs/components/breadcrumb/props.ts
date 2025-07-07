import { ReactElement, ReactEventHandler, ReactNode } from 'react';

export interface BreadcrumbItem {
  /** Text to display for the item */
  label: string;

  /** URL for the item link */
  href?: string;

  /** Optional icon element to display */
  leadingIcon?: ReactNode;

  /**
   * Whether the item is the current page
   * @defaultValue false
   */
  current?: boolean;

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
}

export interface BreadcrumbProps {
  /**
   * Size variant of the breadcrumb
   * @defaultValue "medium"
   */
  size?: 'small' | 'medium';

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
