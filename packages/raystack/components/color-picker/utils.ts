import {
  clampChroma,
  clampRgb,
  converter,
  formatHex,
  formatHex8,
  formatHsl,
  formatRgb,
  parse,
  toGamut
} from 'culori';

export const SUPPORTED_MODES = ['hex', 'hsl', 'rgb', 'oklch'] as const;

export type ModeType = (typeof SUPPORTED_MODES)[number];

export type ColorObject = {
  l: number;
  c: number;
  h: number;
  alpha?: number;
};

// Practical upper bound for the chroma axis. Covers Rec.2020; the displayable
// region for sRGB and Display-P3 falls inside this range.
export const CHROMA_MAX = 0.4;

const toOklch = converter('oklch');
const toRgb = converter('rgb');
const toHsl = converter('hsl');

// Reusable gamut-mapper: reduces chroma in OKLCH space until the color fits
// sRGB while preserving lightness and hue. Created once because `toGamut`
// returns a function and the inputs ('rgb' / 'oklch') are constant.
const toSrgb = toGamut('rgb', 'oklch');

const FALLBACK: ColorObject = { l: 1, c: 0, h: 0, alpha: 1 };

const round = (n: number, p: number) => Number.parseFloat(n.toFixed(p));

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Parses any CSS color string into the picker's OKLCH `{l, c, h, alpha}` shape.
 * Returns white when the input fails to parse so the picker never throws on
 * bad consumer input. Hue is pinned to 0 for achromatic colors because culori
 * may report it as NaN per CSS Color 4.
 */
export const parseColor = (value: string): ColorObject => {
  const parsed = parse(value);
  if (!parsed) return FALLBACK;
  const oklch = toOklch(parsed);
  if (!oklch) return FALLBACK;
  const c = oklch.c ?? 0;
  return {
    l: oklch.l ?? 0,
    c,
    h: c === 0 || !Number.isFinite(oklch.h) ? 0 : (oklch.h as number),
    alpha: oklch.alpha ?? 1
  };
};

const formatOklchString = (color: ColorObject): string => {
  const L = round(color.l, 4);
  const C = round(color.c, 4);
  const H = C === 0 ? 0 : round(color.h, 2);
  const alpha = color.alpha ?? 1;
  const body = `${L} ${C} ${H}`;
  return alpha === 1 ? `oklch(${body})` : `oklch(${body} / ${round(alpha, 4)})`;
};

/**
 * Convert any CSS color string to the requested format.
 *
 * Wide-gamut OKLCH inputs are gamut-mapped into sRGB for `hex`/`rgb`/`hsl`
 * outputs (chroma reduced, lightness and hue preserved), so the result is
 * the closest sRGB representation of the requested color rather than a
 * per-channel-clipped one that would distort hue. `oklch` output preserves
 * the full color, since OKLCH can express the wide gamut natively.
 *
 * Hex is uppercase; uses 8-digit form when alpha < 1. RGB/HSL produce
 * `rgb()`/`rgba()` and `hsl()`/`hsla()`. OKLCH matches the design system's
 * token format (4-decimal L/C, 2-decimal H, hue pinned to 0 when achromatic).
 *
 * Returns `null` for unparseable input.
 *
 * @example
 *   formatColor('oklch(0.5438 0.191 267.01)', 'hex')   // '#3E63DD'
 *   formatColor('oklch(0.7 0.32 30)', 'hex')           // '#FF5843'
 *   formatColor('red', 'rgb')                          // 'rgb(255, 0, 0)'
 *   formatColor('rgba(255, 0, 0, 0.5)', 'hsl')         // 'hsla(0, 100%, 50%, 0.5)'
 *   formatColor('#FF0000', 'oklch')                    // 'oklch(0.6279 0.2577 29.23)'
 *   formatColor('not a color', 'hex')                  // null
 */
export const formatColor = (
  value: string,
  format: 'hex' | 'rgb' | 'hsl' | 'oklch'
): string | null => {
  const parsed = parse(value);
  if (!parsed) return null;

  if (format === 'oklch') {
    const oklch = toOklch(parsed);
    if (!oklch) return null;
    return formatOklchString({
      l: oklch.l ?? 0,
      c: oklch.c ?? 0,
      h: Number.isFinite(oklch.h) ? (oklch.h as number) : 0,
      alpha: oklch.alpha ?? 1
    });
  }

  // sRGB-bound formats: gamut-map first so wide-gamut OKLCH inputs land on
  // the closest sRGB color (hue/lightness preserved) instead of producing
  // per-channel-clipped hex/rgb/hsl that would shift the hue.
  const safe = toSrgb(parsed);
  if (format === 'hex') {
    const hex = (safe.alpha ?? 1) === 1 ? formatHex(safe) : formatHex8(safe);
    return hex.toUpperCase();
  }
  if (format === 'hsl') return formatHsl(safe);
  return formatRgb(safe);
};

/**
 * Serializes the OKLCH color to a CSS string in the requested mode. Non-oklch
 * modes clip out-of-gamut channels to sRGB so the output is always a valid
 * representable value in that format.
 */
export const getColorString = (color: ColorObject, mode: ModeType): string => {
  if (mode === 'oklch') return formatOklchString(color);

  const rgb = toRgb({
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h,
    alpha: color.alpha ?? 1
  });
  if (!rgb) return '';
  // clampRgb is culori's per-channel clip to [0, 1] — identical to the manual
  // clamp it replaces, keeping non-oklch output a valid representable value.
  const clipped = clampRgb(rgb);

  if (mode === 'hex') {
    const hex = clipped.alpha === 1 ? formatHex(clipped) : formatHex8(clipped);
    return hex.toUpperCase();
  }
  if (mode === 'hsl') return formatHsl(clipped);
  return formatRgb(clipped);
};

/**
 * Converts an OKLCH triple to a culori RGB object. The returned r/g/b channels
 * may fall outside [0, 1] when the input is outside the sRGB gamut — callers
 * use that signal to detect and mark the gamut boundary.
 */
export const oklchToRgb = (l: number, c: number, h: number) =>
  toRgb({ mode: 'oklch', l, c, h });

type HslView = {
  h: number;
  s: number;
  l: number;
};

/**
 * Derives an HSL view (h: 0-360, s/l: 0-100) from the picker's OKLCH state.
 * Falls back to the input hue when the color is achromatic so the user's last
 * hue choice isn't lost at the s=0 axis. Used by the area + hue slider in
 * non-oklch modes to drive the classic gradient square.
 */
export const oklchToHsl = (color: ColorObject): HslView => {
  const hsl = toHsl({
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h,
    alpha: color.alpha ?? 1
  });
  if (!hsl) return { h: color.h, s: 0, l: 100 };
  // At c=0 the color is achromatic and the HSL hue carries no information;
  // culori may still return a finite hue from floating-point drift, so trust
  // the input hue to keep the user's last choice intact at the s=0 axis.
  const isAchromatic = color.c <= 1e-6;
  return {
    h: isAchromatic || !Number.isFinite(hsl.h) ? color.h : (hsl.h as number),
    s: clamp01(hsl.s ?? 0) * 100,
    l: clamp01(hsl.l ?? 0) * 100
  };
};

/**
 * Converts an HSL triple (h: 0-360, s/l: 0-100) back to the picker's OKLCH
 * shape. Preserves the input hue when culori reports NaN (e.g. on grays) so
 * the user's hue choice survives a round-trip through s=0.
 */
export const hslToOklch = (
  h: number,
  s: number,
  l: number,
  alpha = 1
): ColorObject => {
  const oklch = toOklch({
    mode: 'hsl',
    h,
    s: clamp01(s / 100),
    l: clamp01(l / 100),
    alpha
  });
  if (!oklch) return { l: 0, c: 0, h, alpha };
  return {
    l: oklch.l ?? 0,
    c: oklch.c ?? 0,
    h: Number.isFinite(oklch.h) ? (oklch.h as number) : h,
    alpha
  };
};

/**
 * Reduces chroma until the OKLCH color is displayable in sRGB, preserving L
 * and H. Used in non-oklch modes so the picker can only emit colors that the
 * output format can actually represent.
 */
export const clampToSrgb = (color: ColorObject): ColorObject => {
  const result = clampChroma(
    {
      mode: 'oklch',
      l: color.l,
      c: color.c,
      h: color.h,
      alpha: color.alpha ?? 1
    },
    'oklch',
    'rgb'
  );
  return {
    l: result.l ?? color.l,
    c: result.c ?? 0,
    h: result.h ?? color.h,
    alpha: result.alpha ?? color.alpha ?? 1
  };
};
