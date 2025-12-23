import type React from 'react';

export interface ScrollAreaRootProps {
  /**
   * Controls when the scrollbar appears.
   * - `auto`: Scrollbar appears only when content overflows (default)
   * - `always`: Scrollbar is always visible
   * - `scroll`: Scrollbar appears during scrolling
   * - `hover`: Scrollbar appears on hover
   * @default 'auto'
   */
  type?: 'auto' | 'always' | 'scroll' | 'hover';

  /**
   * Custom className for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * The content to be scrolled. Both vertical and horizontal scrollbars are automatically rendered and shown when content overflows.
   */
  children?: React.ReactNode;
}
