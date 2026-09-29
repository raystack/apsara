import type React from 'react';

export interface ScrollAreaProps {
  /**
   * Controls when the scrollbar appears.
   * - `always`: Scrollbar is always visible
   * - `hover`: Scrollbar appears on hover (default)
   * - `scroll`: Scrollbar appears during scrolling
   * @default 'hover'
   */
  type?: 'always' | 'hover' | 'scroll';

  /**
   * Custom className for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * The content to be scrolled. Both vertical and horizontal scrollbars are automatically rendered.
   */
  children?: React.ReactNode;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts a `ReactElement` or a function that returns the element to render.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLElement>) => React.ReactElement);
}
