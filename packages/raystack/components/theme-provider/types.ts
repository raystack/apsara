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

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /**
   * Update the theme. At the root this persists the user's choice. Inside a
   * persistent scope (a nested `<Theme storageKey=…>`) it updates and persists
   * the scope's theme; passing `undefined` clears the scope's storage entry
   * and re-inherits from the parent.
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
}
