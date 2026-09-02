/**
 * Single source of truth for the theme's settings. The component, the
 * persistence layer, the inline script and the portal re-injector all read
 * names, defaults, attributes and legal values from here.
 */

export const APPEARANCES = ['light', 'dark'] as const;
export const APPEARANCE_VALUES = ['light', 'dark', 'system'] as const;
export const ACCENT_COLORS = ['indigo', 'orange', 'mint'] as const;
export const GRAY_COLORS = ['gray', 'mauve', 'slate', 'sage'] as const;
export const GRAY_COLOR_VALUES = [...GRAY_COLORS, 'auto'] as const;
export const RADII = ['none', 'small', 'medium', 'large', 'full'] as const;
export const SCALINGS = ['0.9', '0.95', '1', '1.05', '1.1'] as const;
export const PANEL_BACKGROUNDS = ['solid', 'translucent'] as const;
export const REDUCED_MOTION_VALUES = ['true', 'false', 'system'] as const;

/** An appearance after `system` has been resolved against the OS. */
export type Appearance = (typeof APPEARANCES)[number];
export type AppearanceSetting = (typeof APPEARANCE_VALUES)[number];
export type AccentColor = (typeof ACCENT_COLORS)[number];
/** A gray after `auto` has been resolved against the accent. */
export type GrayColor = (typeof GRAY_COLORS)[number];
export type GrayColorSetting = (typeof GRAY_COLOR_VALUES)[number];
export type Radius = (typeof RADII)[number];
export type Scaling = (typeof SCALINGS)[number];
export type PanelBackground = (typeof PANEL_BACKGROUNDS)[number];
export type ReducedMotion = (typeof REDUCED_MOTION_VALUES)[number];

/** The theme as the consumer set it, `system` and `auto` included. */
export interface ThemeSettings {
  appearance: AppearanceSetting;
  accentColor: AccentColor;
  grayColor: GrayColorSetting;
  radius: Radius;
  scaling: Scaling;
  panelBackground: PanelBackground;
  reducedMotion: ReducedMotion;
}

/** The theme as it is applied, with `system` and `auto` resolved. */
export interface ResolvedThemeSettings extends ThemeSettings {
  appearance: Appearance;
  grayColor: GrayColor;
}

export type ThemeSettingKey = keyof ThemeSettings;

/**
 * Declaration order matters: it is the order the inline script walks, so
 * `accentColor` must precede `grayColor` for `auto` to resolve.
 */
export const THEME_SETTING_KEYS = [
  'appearance',
  'accentColor',
  'grayColor',
  'radius',
  'scaling',
  'panelBackground',
  'reducedMotion'
] as const satisfies readonly ThemeSettingKey[];

export const DEFAULT_SETTINGS: ThemeSettings = {
  appearance: 'system',
  accentColor: 'indigo',
  grayColor: 'auto',
  radius: 'medium',
  scaling: '1',
  panelBackground: 'solid',
  reducedMotion: 'system'
};

export const SETTING_ATTRIBUTES = {
  appearance: 'data-theme',
  accentColor: 'data-accent-color',
  grayColor: 'data-gray-color',
  radius: 'data-radius',
  scaling: 'data-scaling',
  panelBackground: 'data-panel-background',
  reducedMotion: 'data-reduced-motion'
} as const satisfies Record<ThemeSettingKey, string>;

/** Legal values per setting. Anything outside the union is discarded. */
export const SETTING_VALUES = {
  appearance: APPEARANCE_VALUES,
  accentColor: ACCENT_COLORS,
  grayColor: GRAY_COLOR_VALUES,
  radius: RADII,
  scaling: SCALINGS,
  panelBackground: PANEL_BACKGROUNDS,
  reducedMotion: REDUCED_MOTION_VALUES
} as const satisfies Record<ThemeSettingKey, readonly string[]>;

/** `grayColor: 'auto'` pairs a complementary gray to the accent. */
export const GRAY_PAIRING = {
  indigo: 'slate',
  orange: 'mauve',
  mint: 'sage'
} as const satisfies Record<AccentColor, GrayColor>;

/** Marks the one theme element that owns the document's colour scheme. */
export const ROOT_ATTRIBUTE = 'data-rs-root';

/** Stable, unhashed override target. Documented for consumer stylesheets. */
export const THEME_CLASS = 'rs-theme';

/** Bumped when the stored object's shape changes, so entries can migrate. */
export const STORAGE_VERSION = 1;

export const SYSTEM_APPEARANCE_QUERY = '(prefers-color-scheme: dark)';

/** Narrows an unknown value to a legal value for `key`, or `undefined`. */
export function coerceSetting<K extends ThemeSettingKey>(
  key: K,
  value: unknown
): ThemeSettings[K] | undefined {
  const allowed: readonly string[] = SETTING_VALUES[key];
  return typeof value === 'string' && allowed.includes(value)
    ? (value as ThemeSettings[K])
    : undefined;
}

/**
 * Per-key assignment across the settings union. Generic so the key and the
 * value are checked against each other, which `target[key] = value` over a
 * union of literal types cannot express.
 */
export function assignSetting<K extends ThemeSettingKey>(
  target: Partial<ThemeSettings>,
  key: K,
  value: ThemeSettings[K]
): void {
  target[key] = value;
}

/** Keeps the legal keys with legal values, discarding bad fields one by one. */
export function sanitizeSettings(input: unknown): Partial<ThemeSettings> {
  const out: Partial<ThemeSettings> = {};
  if (typeof input !== 'object' || input === null) return out;
  const record = input as Record<string, unknown>;
  for (const key of THEME_SETTING_KEYS) {
    const value = coerceSetting(key, record[key]);
    if (value !== undefined) assignSetting(out, key, value);
  }
  return out;
}

/**
 * Resolves `system` against the OS and `auto` against the accent. Both must
 * resolve before the attribute is written, so `data-theme` only ever holds
 * `light` or `dark`.
 */
export function resolveSettings(
  settings: ThemeSettings,
  systemAppearance: Appearance
): ResolvedThemeSettings {
  return {
    ...settings,
    appearance:
      settings.appearance === 'system' ? systemAppearance : settings.appearance,
    grayColor:
      settings.grayColor === 'auto'
        ? GRAY_PAIRING[settings.accentColor]
        : settings.grayColor
  };
}

/** The data attributes a resolved theme writes onto its element. */
export function settingsToAttributes(
  resolved: ResolvedThemeSettings
): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const key of THEME_SETTING_KEYS) {
    attributes[SETTING_ATTRIBUTES[key]] = resolved[key];
  }
  return attributes;
}
