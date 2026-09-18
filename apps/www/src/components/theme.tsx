'use client';

import { Theme } from '@raystack/apsara';
import type { ReactNode } from 'react';
import styles from './theme.module.css';

/**
 * The docs' root theme. It is the same component the demos on this site mount,
 * so a nested `Theme` inherits appearance from the page rather than
 * resolving `system` on its own, and the inline script it emits replaces
 * `next-themes` for pre-hydration appearance.
 */
export function DocsTheme({ children }: { children: ReactNode }) {
  return (
    <Theme
      persistKey='apsara-docs-theme'
      persist={['appearance']}
      className={styles.root}
    >
      {children}
    </Theme>
  );
}
