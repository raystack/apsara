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
   * When `dropdownItems` is provided, the `render` and `href` props are ignored.
   */
  dropdownItems?: {
    /** Optional stable key for list reconciliation. Falls back to index if omitted. */
    key?: string;
    /** Text to display for the dropdown item */
    label: string;
    /** Callback function when a dropdown item is clicked */
    onClick?: ReactEventHandler<HTMLDivElement>;
  }[];

  /**
   * Render prop for polymorphism (Base UI `useRender`).
   * Pass a JSX element to replace the default rendered `<a>`.
   *
   * Example: `render={<NextLink />}`
   */
  render?: ReactElement;
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
