import type { ReactNode } from 'react';

export interface KbdProps {
  /** The key to display, e.g. `⌘`, `Esc`, or `Enter`. */
  children?: ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface KbdGroupProps {
  /** The keys in the sequence, plus any plain-text separators between them. */
  children?: ReactNode;

  /** Additional CSS class names. */
  className?: string;
}
