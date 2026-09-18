'use client';

import { ThemePreview } from '@raystack/apsara';
import type { ReactNode } from 'react';
import styles from './theme.module.css';

/**
 * The docs' root theme. It is the same component the demos on this site mount,
 * so a nested `ThemePreview` inherits appearance from the page rather than
 * resolving `system` on its own, and the inline script it emits replaces
 * `next-themes` for pre-hydration appearance.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemePreview
      persistKey='apsara-docs-theme'
      persist={['appearance']}
      className={styles.root}
    >
      {children}
    </ThemePreview>
  );
}
