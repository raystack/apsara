'use client';

import { type RefObject, useMemo } from 'react';

import { useThemeContextOrNull } from './context';
import { settingsToAttributes, THEME_CLASS } from './settings';

/** Where a portalling component puts its content. */
export type PortalContainer =
  | HTMLElement
  | ShadowRoot
  | null
  | RefObject<HTMLElement | ShadowRoot | null>;

export interface ThemeInjectionProps {
  className: string;
  [attribute: string]: string;
}

/**
 * Re-emits the theme onto a portalled element; `undefined` outside a provider.
 * Spread first, then pass `className` yourself:
 * `<Popup {...theme} className={cx(theme?.className, className)} />`
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
