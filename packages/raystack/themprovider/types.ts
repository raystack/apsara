interface ValueObject {
  [themeName: string]: string;
}

/**
 * @deprecated Use UseThemeProps from '@raystack/apsara/v1' instead.
 */
export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /** Update the theme */
  setTheme: (theme: string) => void;
  /** Active theme name */
  theme?: string;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: "dark" | "light";
}

/**
 * @deprecated Use ThemeProviderProps from '@raystack/apsara/v1' instead.
 */
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
  attribute?: string | "class";
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string;
  /** React children to be rendered within the ThemeProvider */
  children?: React.ReactNode;
  /** Style variant of the theme, either 'modern' or 'traditional'. Affects the radius and font properties. */
  style?: 'modern' | 'traditional';
  /** Accent color for the theme, options are 'indigo', 'orange', or 'mint' */
  accentColor?: 'indigo' | 'orange' | 'mint';
  /** Gray color variant for the theme, options are 'gray', 'mauve', or 'slate' */
  grayColor?: 'gray' | 'mauve' | 'slate';
}
