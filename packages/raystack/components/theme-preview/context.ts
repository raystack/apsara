'use client';

import { createContext, useContext } from 'react';

import type {
  Appearance,
  ResolvedThemeSettings,
  ThemeSettings
} from './settings';

/** The theme, as read and driven from anywhere inside a provider. */
export interface ThemeHandle {
  /** Settings as set, `system` and `auto` included. */
  value: ThemeSettings;
  /** Settings as applied, with `system` and `auto` resolved. */
  resolved: ResolvedThemeSettings;
  /** Takes a partial settings object. Controlled keys are ignored. */
  setValue: (next: Partial<ThemeSettings>) => void;
  /** What the OS reports, whatever the current setting is. */
  systemAppearance: Appearance;
}

export interface ThemeContextValue extends ThemeHandle {
  /** Whether this theme owns the document's colour scheme. */
  isRoot: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = 'ThemePreviewContext';

/** The root provider's handle, carried past every nested scope. */
export const RootThemeContext = createContext<ThemeHandle | null>(null);
RootThemeContext.displayName = 'RootThemePreviewContext';

export interface UseThemePreviewReturn extends ThemeHandle {
  /** The same shape bound to the root provider. */
  root: ThemeHandle;
}

/**
 * Reads the nearest theme. Throws outside a provider rather than returning a
 * no-op: every colour token is declared under `[data-theme]`, so a tree with
 * no provider has no colours at all.
 */
export function useThemePreview(): UseThemePreviewReturn {
  const context = useContext(ThemeContext);
  const root = useContext(RootThemeContext);
  if (!context) {
    throw new Error(
      '`useThemePreview` must be called inside a `<ThemePreview>`. Wrap your ' +
        'application in one — component colours are declared under the theme ' +
        "element's attributes and do not exist without it."
    );
  }
  return { ...context, root: root ?? context };
}

/** The raw context, for internals that must tolerate its absence. */
export function useThemeContextOrNull(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
