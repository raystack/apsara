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
    /** When set, the option renders as a link. Use with target and rel for new tab (e.g. target="_blank" rel="noopener noreferrer"). */
    href?: string;
    /** Link target (e.g. "_blank" for new tab). */
    target?: string;
    /** Link rel (e.g. "noopener noreferrer" when target="_blank"). */
    rel?: string;
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
