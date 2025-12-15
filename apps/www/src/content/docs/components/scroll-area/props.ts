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
}

export interface ScrollAreaViewportProps {
  /**
   * Custom className for the viewport element.
   */
  className?: string;

  /**
   * Inline styles for the viewport element.
   */
  style?: React.CSSProperties;
}

export interface ScrollAreaScrollbarProps {
  /**
   * Orientation of the scrollbar.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Custom className for the scrollbar element.
   */
  className?: string;

  /**
   * Inline styles for the scrollbar element.
   */
  style?: React.CSSProperties;
}

export interface ScrollAreaCornerProps {
  /**
   * Custom className for the corner element.
   */
  className?: string;

  /**
   * Inline styles for the corner element.
   */
  style?: React.CSSProperties;
}
