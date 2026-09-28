export type Appearance = 'light' | 'dark';
export type AppearanceSetting = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'orange' | 'mint';
export type GrayColorSetting = 'gray' | 'mauve' | 'slate' | 'sage' | 'auto';
export type Radius = 'none' | 'small' | 'medium' | 'large' | 'full';
export type Scaling = '0.9' | '0.95' | '1' | '1.05' | '1.1';
export type PanelBackground = 'solid' | 'translucent';
export type ReducedMotion = 'true' | 'false' | 'system';

/** The theme settings. Every key is independent. */
export type ThemeSettings = {
  /**
   * Colour scheme. `system` resolves against `prefers-color-scheme`.
   * @defaultValue "system"
   */
  appearance: AppearanceSetting;

  /**
   * Accent ramp.
   * @defaultValue "indigo"
   */
  accentColor: AccentColor;

  /**
   * Gray ramp. `auto` pairs a complementary gray to the accent.
   * @defaultValue "auto"
   */
  grayColor: GrayColorSetting;

  /**
   * Corner radius, applied as a factor over a fixed base scale.
   * @defaultValue "medium"
   */
  radius: Radius;

  /**
   * Zoom. Multiplies spacing, radius, type and line height together.
   * @defaultValue "1"
   */
  scaling: Scaling;

  /**
   * Whether overlay surfaces are opaque or translucent.
   * @defaultValue "solid"
   */
  panelBackground: PanelBackground;

  /**
   * Motion preference. A forced value collapses the duration tokens.
   * @defaultValue "system"
   */
  reducedMotion: ReducedMotion;
};

export type ThemeProps = {
  /** Seeds uncontrolled keys. A stored user choice overrides it. */
  defaultValue?: Partial<ThemeSettings>;

  /**
   * Controlled keys, per key. A controlled key always wins and is never
   * persisted.
   */
  value?: Partial<ThemeSettings>;

  /**
   * Fires when `setValue` requests a change. Controlled keys are reported but
   * not applied; changes arriving from storage do not fire it.
   */
  onValueChange?: (
    value: ThemeSettings,
    changed: Partial<ThemeSettings>
  ) => void;

  /**
   * Which settings this namespace covers.
   * @defaultValue all seven keys
   */
  persist?: (keyof ThemeSettings)[];

  /** Storage namespace. Persistence is off unless this is set. */
  persistKey?: string;

  /**
   * Whether this theme owns the document's colour scheme. An embedded widget
   * with no ancestor theme should pass `false`.
   * @defaultValue true when there is no ancestor theme
   */
  isRoot?: boolean;

  /**
   * Overrides the painting heuristic: true at the root or for a nested theme
   * with its own `light` or `dark` appearance, false otherwise.
   */
  hasBackground?: boolean;

  /**
   * Suppresses the colour transition during an appearance switch.
   * @defaultValue false
   */
  disableTransitionOnChange?: boolean;

  /** CSP nonce for the inline script. */
  nonce?: string;

  /** `asChild`-style escape hatch: merges the theme onto your own element. */
  render?: React.ReactElement | ((props: object) => React.ReactElement);

  /** Extra classes. `rs-theme` is always present alongside them. */
  className?: string;

  children?: React.ReactNode;
};

/** The theme, as read and driven from anywhere inside a provider. */
export type ThemeHandle = {
  /** Settings as set, `system` and `auto` included. */
  value: ThemeSettings;
  /** Settings as applied, with `system` and `auto` resolved. */
  resolved: ThemeSettings & { appearance: Appearance };
  /** Partial settings. Controlled keys are reported, not applied. */
  setValue: (next: Partial<ThemeSettings>) => void;
  /** What the OS reports, whatever the current setting is. */
  systemAppearance: Appearance;
};

export type UseThemeReturn = ThemeHandle & {
  /** The same handle bound to the root provider. */
  root: ThemeHandle;
};

export type ThemeSwitcherProps = {
  /**
   * Square size of the button box, in pixels.
   * @defaultValue 30
   */
  size?: number;
  /**
   * Whether to flip the root theme rather than the nearest scope.
   * @defaultValue "nearest"
   */
  target?: 'nearest' | 'root';
};
