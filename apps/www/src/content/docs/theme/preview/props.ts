export type Appearance = 'light' | 'dark';
export type AppearanceSetting = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'orange' | 'mint';
export type GrayColorSetting = 'gray' | 'mauve' | 'slate' | 'sage' | 'auto';
export type Radius = 'none' | 'small' | 'medium' | 'large' | 'full';
export type Scaling = '0.9' | '0.95' | '1' | '1.05' | '1.1';
export type PanelBackground = 'solid' | 'translucent';
export type ReducedMotion = 'true' | 'false' | 'system';

/** One settings object describes the theme. Every key is independent. */
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

export type ThemeSettingKey = keyof ThemeSettings;

export type ThemePreviewProps = {
  /**
   * Partial settings that seed uncontrolled keys. A stored user choice
   * overrides them, so this is a seed rather than a value.
   */
  defaultValue?: Partial<ThemeSettings>;

  /**
   * Partial settings that are controlled. A controlled key always wins, is
   * never persisted, and is never written by the inline script. Control is per
   * key: drive `appearance` from a cookie while accent and radius stay
   * adjustable.
   */
  value?: Partial<ThemeSettings>;

  /** Fires with the full next settings object and the changed subset. */
  onValueChange?: (
    value: ThemeSettings,
    changed: Partial<ThemeSettings>
  ) => void;

  /**
   * Which settings this namespace covers.
   * @defaultValue all seven keys
   */
  persist?: ThemeSettingKey[];

  /**
   * Storage namespace. Persistence is off unless this is set; a theme without
   * one holds its settings in memory and emits no inline script.
   */
  persistKey?: string;

  /**
   * Whether this theme owns the document's colour scheme. An embedded widget
   * or micro-frontend that has no ancestor theme but does not own the page
   * must pass `false`.
   * @defaultValue true when there is no ancestor theme
   */
  isRoot?: boolean;

  /**
   * Overrides the painting heuristic: true at the root, true for a nested
   * theme that sets an explicit `light` or `dark` appearance, false for one
   * that only changes accent, gray, radius or scaling.
   */
  hasBackground?: boolean;

  /**
   * Suppresses the 0.4s colour transition during an appearance switch.
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
  /** Takes a partial settings object. Controlled keys are ignored. */
  setValue: (next: Partial<ThemeSettings>) => void;
  /** What the OS reports, whatever the current setting is. */
  systemAppearance: Appearance;
};

export type UseThemePreviewReturn = ThemeHandle & {
  /**
   * The same shape bound to the root provider, for flipping the page theme
   * from inside a scope.
   */
  root: ThemeHandle;
};

export type ThemePreviewSwitcherProps = {
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
