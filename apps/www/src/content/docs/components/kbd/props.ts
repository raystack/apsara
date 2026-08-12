import type { ReactNode } from 'react';

export interface KbdProps {
  /** The key to display, e.g. `⌘`, `Esc`, or `Enter`. */
  children?: ReactNode;

  /**
   * Visual style variant. Inherited from a parent `Kbd.Group` when set there.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'ghost';

  /** Additional CSS class names. */
  className?: string;
}

export interface KbdGroupProps {
  /** The keys in the sequence, plus any plain-text separators between them. */
  children?: ReactNode;

  /**
   * Visual style variant applied to every key in the group.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'ghost';

  /** Additional CSS class names. */
  className?: string;
}
