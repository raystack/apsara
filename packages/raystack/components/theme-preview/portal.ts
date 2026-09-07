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
 * Theme values cross a portal through React context rather than the DOM, so a
 * portalled element has to re-emit them. The returned props merge onto that
 * element rather than adding a node — spread them first and pass `className`
 * explicitly afterwards:
 *
 * ```tsx
 * const theme = useThemeInjection();
 * <Popup {...theme} className={cx(styles.popup, theme?.className, className)} />
 * ```
 *
 * Returns `undefined` outside a provider, leaving such a portal unchanged.
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
