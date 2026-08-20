import type { IconOptions } from '~/icons/create-icon';

interface ValueObject {
  [themeName: string]: string;
}

export const COLOR_SCHEMES = ['light', 'dark'] as const;
export const ACCENT_COLORS = ['indigo', 'orange', 'mint'] as const;
export const GRAY_COLORS = ['gray', 'mauve', 'slate'] as const;
export const STYLE_VARIANTS = ['modern', 'traditional'] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];
export type AccentColor = (typeof ACCENT_COLORS)[number];
export type GrayColor = (typeof GRAY_COLORS)[number];
export type StyleVariant = (typeof STYLE_VARIANTS)[number];

/**
 * A minimal reference to a scope's theme state. Used internally by the
 * `scopes` registry to let `useTheme({ storageKey })` target a specific
 * scope past the nearest one.
 */
export interface ScopeRef {
  theme?: string;
  setTheme: (theme: string | undefined) => void;
}

export interface UseThemeOptions {
  /**
   * Target a scope (or the root) by its `storageKey` instead of the nearest
   * ancestor. Useful for flipping the page-level theme from inside a
   * nested scope.
   */
  storageKey?: string;
}

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /**
   * Update the theme of the nearest scope. At the root this persists the
   * user's choice. Inside a persistent scope (a nested `<Theme storageKey=…>`)
   * it updates and persists the scope's theme; passing `undefined` clears the
   * scope's storage entry and re-inherits from the parent.
   */
  setTheme: (theme: string | undefined) => void;
  /** Active theme name */
  theme?: string;
  /** The actually applied theme. Returns `forcedTheme` when set; otherwise the system preference (`"light"`/`"dark"`) when `theme` is `"system"`; otherwise identical to `theme`. */
  resolvedTheme?: string;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light';
  /** Active style variant. Reflects the nearest provider's effective value. */
  style?: StyleVariant;
  /** Active accent color. Reflects the nearest provider's effective value. */
  accentColor?: AccentColor;
  /** Active gray color. Reflects the nearest provider's effective value. */
  grayColor?: GrayColor;
  /**
   * Registry of all ancestor scopes keyed by `storageKey`. Used by
   * `useTheme({ storageKey })` to address a specific scope. Internal API.
   */
  scopes?: Record<string, ScopeRef>;
}

export interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string;
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: string | 'class';
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string;
  /** React children to be rendered within the Theme component */
  children?: React.ReactNode;
  /** Style variant of the theme. Affects the radius and font properties. */
  style?: StyleVariant;
  /** Accent color for the theme. */
  accentColor?: AccentColor;
  /** Gray color variant for the theme. */
  grayColor?: GrayColor;
  /** Called when the active theme changes. `resolvedTheme` is the actual applied theme (`'light'`/`'dark'` when `theme` is `'system'`). Not fired on initial mount. */
  onThemeChange?: (theme: string, resolvedTheme: string) => void;
  /**
   * The icons inside Apsara's components, and the props applied to every icon.
   *
   * `components` replaces a drawing by key — `{ ErrorIcon: MyError }`. A partial
   * map changes only the keys it names, and a nested `<Theme icons={…}>` layers
   * on top of an outer one, per key.
   *
   * `props` applies to every icon built by `createIcon`, the consumer's own
   * included — `{ strokeWidth: 2 }`. The props at the call site still win.
   * Prefer the `data-icon` attribute and CSS where a style rule is enough,
   * because CSS re-renders nothing.
   *
   * The map holds functions, so a React Server Component cannot pass it. Set it
   * from a client component (the `providers.tsx` pattern).
   */
  icons?: IconOptions;
}
