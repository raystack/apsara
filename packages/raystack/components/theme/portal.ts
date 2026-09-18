'use client';

import { useMemo } from 'react';

import { useThemeContextOrNull } from './context';
import { settingsToAttributes, THEME_CLASS } from './settings';

export interface ThemeInjectionProps {
  className: string;
  [attribute: string]: string;
}

/**
 * Re-emits the theme onto a portalled element; `undefined` outside a provider.
 * Spread first, then pass `className` yourself:
 * `<Popup {...theme} className={cx(theme?.className, className)} />`
 *
 * Spread it on the `Portal` as well as the popup. A Base UI portal renders its
 * own `<div>` under `<body>`, one per instance, so the theme reaches the parts
 * that are siblings of the popup rather than inside it — a dialog's backdrop
 * draws `--rs-color-overlay`, which is only declared under `[data-theme]`, and
 * without this resolves to nothing and leaves the scrim invisible.
 */
export function useThemeInjection(): ThemeInjectionProps | undefined {
  const theme = useThemeContextOrNull();
  const resolved = theme?.resolved;

  return useMemo(() => {
    if (!resolved) return undefined;
    return {
      className: THEME_CLASS,
      ...settingsToAttributes(resolved)
    };
  }, [resolved]);
}
