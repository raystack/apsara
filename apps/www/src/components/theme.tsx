'use client';

import { Theme } from '@raystack/apsara';
import type { ReactNode } from 'react';
import styles from './theme.module.css';

/**
 * The docs' root theme, the same component the demos mount, so a nested `Theme`
 * inherits appearance rather than resolving `system` on its own. Its inline
 * script replaces `next-themes` for pre-hydration appearance.
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
