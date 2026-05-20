import {
  converter,
  formatHex,
  formatHex8,
  formatHsl,
  formatRgb,
  parse
} from 'culori';

export const SUPPORTED_MODES = ['hex', 'hsl', 'rgb', 'oklch'];

export type ModeType = (typeof SUPPORTED_MODES)[number];

export type ColorObject = {
  h: number;
  s: number;
  l: number;
  alpha?: number;
};

const toHsl = converter('hsl');
const toOklch = converter('oklch');

// culori stores HSL with s/l in 0-1; the picker stores them in 0-100 to keep
// the existing context contract intact.
const HSL_PERCENT = 100;

const FALLBACK: ColorObject = { h: 0, s: 0, l: 100, alpha: 1 };

const round = (n: number, p: number) => Number.parseFloat(n.toFixed(p));

/**
 * Serializes a culori-shaped HSL color as oklch(L C H[ / A]).
 * Matches the design system's token format: 4-decimal L/C, 2-decimal H,
 * H pinned to 0 for achromatic colors (culori would emit `none` per CSS
 * Color 4, which is correct but inconsistent with how tokens are written).
 */
const formatOklch = (hsl: {
  mode: 'hsl';
  h: number;
  s: number;
  l: number;
  alpha: number;
}): string => {
  const oklch = toOklch(hsl);
  if (!oklch) return '';
  const L = round(oklch.l ?? 0, 4);
  const C = round(oklch.c ?? 0, 4);
  const H = C === 0 || !Number.isFinite(oklch.h) ? 0 : round(oklch.h ?? 0, 2);
  const body = `${L} ${C} ${H}`;
  return hsl.alpha === 1
    ? `oklch(${body})`
    : `oklch(${body} / ${round(hsl.alpha, 4)})`;
};

/**
 * Parses any CSS color string into the picker's `{h, s, l, alpha}` shape.
 * Returns a white fallback (matching the picker's previous default) when the
 * input fails to parse, so the picker never throws on bad consumer input.
 */
export const parseColor = (value: string): ColorObject => {
  const parsed = parse(value);
  if (!parsed) return FALLBACK;
  const hsl = toHsl(parsed);
  if (!hsl) return FALLBACK;
  return {
    h: hsl.h ?? 0,
    s: (hsl.s ?? 0) * HSL_PERCENT,
    l: (hsl.l ?? 0) * HSL_PERCENT,
    alpha: hsl.alpha ?? 1
  };
};

/**
 * Serializes `{h, s, l, alpha}` to a CSS string in the requested mode.
 * Hex output is uppercase and uses 8-digit form only when alpha < 1, mirroring
 * the previous `color@5` behavior the tests depend on.
 */
export const getColorString = (color: ColorObject, mode: ModeType): string => {
  const culoriColor = {
    mode: 'hsl' as const,
    h: color.h,
    s: color.s / HSL_PERCENT,
    l: color.l / HSL_PERCENT,
    alpha: color.alpha ?? 1
  };

  if (mode === 'hex') {
    const hex =
      culoriColor.alpha === 1
        ? formatHex(culoriColor)
        : formatHex8(culoriColor);
    return hex.toUpperCase();
  }
  if (mode === 'hsl') return formatHsl(culoriColor);
  if (mode === 'oklch') return formatOklch(culoriColor);
  return formatRgb(culoriColor);
};
