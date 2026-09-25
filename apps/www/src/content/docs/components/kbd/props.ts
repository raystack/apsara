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
   * Visual style variant inherited by every key in the group. A key's own
   * `variant` takes precedence over it.
   * @defaultValue "solid"
   */
  variant?: 'solid' | 'ghost';

  /** Additional CSS class names. */
  className?: string;
}
