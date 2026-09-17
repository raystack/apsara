/** Single source of truth for setting names, defaults, attributes and values. */

import { RADII, type Radius } from '../../shared/radius';

export const APPEARANCES = ['light', 'dark'] as const;
export const APPEARANCE_VALUES = ['light', 'dark', 'system'] as const;
export const ACCENT_COLORS = ['indigo', 'orange', 'mint'] as const;
export const GRAY_COLORS = ['gray', 'mauve', 'slate', 'sage'] as const;
export const GRAY_COLOR_VALUES = [...GRAY_COLORS, 'auto'] as const;
export const SCALINGS = ['0.9', '0.95', '1', '1.05', '1.1'] as const;
export const PANEL_BACKGROUNDS = ['solid', 'translucent'] as const;
export const REDUCED_MOTION_VALUES = ['true', 'false', 'system'] as const;

/** Appearance with `system` resolved. */
export type Appearance = (typeof APPEARANCES)[number];
export type AppearanceSetting = (typeof APPEARANCE_VALUES)[number];
export type AccentColor = (typeof ACCENT_COLORS)[number];
/** Gray with `auto` resolved. */
export type GrayColor = (typeof GRAY_COLORS)[number];
export type GrayColorSetting = (typeof GRAY_COLOR_VALUES)[number];
export { RADII, type Radius };
export type Scaling = (typeof SCALINGS)[number];
export type PanelBackground = (typeof PANEL_BACKGROUNDS)[number];
export type ReducedMotion = (typeof REDUCED_MOTION_VALUES)[number];

/** Settings as set, `system` and `auto` included. */
export interface ThemeSettings {
  appearance: AppearanceSetting;
  accentColor: AccentColor;
  grayColor: GrayColorSetting;
  radius: Radius;
  scaling: Scaling;
  panelBackground: PanelBackground;
  reducedMotion: ReducedMotion;
}

/** Settings as applied, `system` and `auto` resolved. */
export interface ResolvedThemeSettings extends ThemeSettings {
  appearance: Appearance;
  grayColor: GrayColor;
}

export type ThemeSettingKey = keyof ThemeSettings;

// Order matters: the script walks it, and `accentColor` must precede `grayColor`.
export const THEME_SETTING_KEYS = [
  'appearance',
  'accentColor',
  'grayColor',
  'radius',
  'scaling',
  'panelBackground',
  'reducedMotion'
] as const satisfies readonly ThemeSettingKey[];

export const THEME_DEFAULT_SETTINGS: ThemeSettings = {
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

/** Legal values per setting. */
export const THEME_SETTING_VALUES = {
  appearance: APPEARANCE_VALUES,
  accentColor: ACCENT_COLORS,
  grayColor: GRAY_COLOR_VALUES,
  radius: RADII,
  scaling: SCALINGS,
  panelBackground: PANEL_BACKGROUNDS,
  reducedMotion: REDUCED_MOTION_VALUES
} as const satisfies Record<ThemeSettingKey, readonly string[]>;

/** The gray `auto` pairs with each accent. */
export const GRAY_PAIRING = {
  indigo: 'slate',
  orange: 'mauve',
  mint: 'sage'
} as const satisfies Record<AccentColor, GrayColor>;

/** Marks the theme that owns the document colour scheme. */
export const ROOT_ATTRIBUTE = 'data-rs-root';

/** Stable override class for consumer stylesheets. */
export const THEME_CLASS = 'rs-theme';

/** Bump when the stored shape changes. */
export const STORAGE_VERSION = 1;

export const SYSTEM_APPEARANCE_QUERY = '(prefers-color-scheme: dark)';

/** Narrows to a legal value for `key`, or `undefined`. */
export function coerceSetting<K extends ThemeSettingKey>(
  key: K,
  value: unknown
): ThemeSettings[K] | undefined {
  const allowed: readonly string[] = THEME_SETTING_VALUES[key];
  return typeof value === 'string' && allowed.includes(value)
    ? (value as ThemeSettings[K])
    : undefined;
}

// Generic so key and value are checked against each other across the union.
export function assignSetting<K extends ThemeSettingKey>(
  target: Partial<ThemeSettings>,
  key: K,
  value: ThemeSettings[K]
): void {
  target[key] = value;
}

/** Keeps legal keys with legal values, dropping bad fields individually. */
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

/** Resolves `system` against the OS and `auto` against the accent. */
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
