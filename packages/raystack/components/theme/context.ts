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
  /** Partial settings. Controlled keys are reported, not applied. */
  setValue: (next: Partial<ThemeSettings>) => void;
  /** What the OS reports, whatever the current setting is. */
  systemAppearance: Appearance;
}

export interface ThemeContextValue extends ThemeHandle {
  /** Whether this theme owns the document's colour scheme. */
  isRoot: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = 'ThemeContext';

/** The root provider's handle, carried past every nested scope. */
export const RootThemeContext = createContext<ThemeHandle | null>(null);
RootThemeContext.displayName = 'RootThemeContext';

export interface UseThemeReturn extends ThemeHandle {
  /** The same shape bound to the root provider. */
  root: ThemeHandle;
}

/** Nearest theme. Throws outside a provider, where no colour tokens exist. */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);
  const root = useContext(RootThemeContext);
  if (!context) {
    throw new Error(
      '`useTheme` must be called inside a `<Theme>`. Wrap your ' +
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
