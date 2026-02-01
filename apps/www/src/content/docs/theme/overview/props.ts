export type ThemeProviderProps = {
  /**
   * Default theme on first load
   * @defaultValue "system"
   */
  defaultTheme?: string;

  /**
   * List of available theme names
   * @defaultValue ["light", "dark"]
   */
  themes?: string[];

  /** Force a specific theme, ignoring user preference */
  forcedTheme?: string;

  /**
   * Enable system theme detection
   * @defaultValue true
   */
  enableSystem?: boolean;

  /**
   * localStorage key for persisting theme
   * @defaultValue "theme"
   */
  storageKey?: string;

  /**
   * HTML attribute to set on document element
   * @defaultValue "data-theme"
   */
  attribute?: string | 'class';

  /**
   * Visual style variant
   * @defaultValue "modern"
   */
  style?: 'modern' | 'traditional';

  /**
   * Primary accent color
   * @defaultValue "indigo"
   */
  accentColor?: 'indigo' | 'orange' | 'mint';

  /**
   * Neutral gray color variant
   * @defaultValue "gray"
   */
  grayColor?: 'gray' | 'mauve' | 'slate';

  /**
   * Disable CSS transitions when switching themes
   * @defaultValue false
   */
  disableTransitionOnChange?: boolean;

  /**
   * Set color-scheme CSS property for native elements
   * @defaultValue true
   */
  enableColorScheme?: boolean;

  /** Nonce string for CSP headers */
  nonce?: string;

  /** Mapping of theme name to HTML attribute value */
  value?: { [themeName: string]: string };

  /** React children */
  children?: React.ReactNode;
};

export type UseThemeProps = {
  /** Current theme name ("light", "dark", or "system") */
  theme?: string;

  /** Function to change the theme */
  setTheme: (theme: string) => void;

  /** Resolved theme ("light" or "dark"), useful when theme is "system" */
  resolvedTheme?: string;

  /** System preference, regardless of current theme */
  systemTheme?: 'light' | 'dark';

  /** List of all available themes */
  themes: string[];

  /** Forced theme if set, otherwise undefined */
  forcedTheme?: string;
};
