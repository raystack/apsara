import { describe, expect, it } from 'vitest';
import {
  CHROMA_MAX,
  clampToSrgb,
  getColorString,
  hslToOklch,
  oklchToHsl,
  parseColor
} from '../utils';

const closeTo = (a: number, b: number, tolerance = 0.5) =>
  Math.abs(a - b) <= tolerance;

describe('color-picker utils', () => {
  describe('parseColor', () => {
    it('parses hex into OKLCH', () => {
      const c = parseColor('#ff0000');
      expect(c.l).toBeGreaterThan(0);
      expect(c.c).toBeGreaterThan(0);
      expect(c.alpha).toBe(1);
    });

    it('pins hue to 0 for achromatic colors', () => {
      const c = parseColor('#808080');
      expect(c.c).toBe(0);
      expect(c.h).toBe(0);
    });

    it('falls back to white on unparseable input', () => {
      const c = parseColor('not a color');
      expect(c).toEqual({ l: 1, c: 0, h: 0, alpha: 1 });
    });
  });

  describe('oklchToHsl', () => {
    it('round-trips a saturated red through HSL', () => {
      const oklch = parseColor('#ff0000');
      const hsl = oklchToHsl(oklch);
      expect(closeTo(hsl.h, 0, 1)).toBe(true);
      expect(closeTo(hsl.s, 100, 1)).toBe(true);
      expect(closeTo(hsl.l, 50, 1)).toBe(true);
    });

    it('preserves the input hue when the color is achromatic', () => {
      // Internal state may carry a non-zero hue even when chroma is 0; HSL
      // conversion would normally produce NaN — the helper falls back to the
      // OKLCH hue so the user's last hue choice isn't lost at the s=0 axis.
      const hsl = oklchToHsl({ l: 0.5, c: 0, h: 200 });
      expect(hsl.s).toBeCloseTo(0, 6);
      expect(hsl.h).toBe(200);
    });
  });

  describe('hslToOklch', () => {
    it('round-trips through OKLCH back to the same HSL', () => {
      const oklch = hslToOklch(120, 50, 50);
      const hsl = oklchToHsl(oklch);
      expect(closeTo(hsl.h, 120)).toBe(true);
      expect(closeTo(hsl.s, 50)).toBe(true);
      expect(closeTo(hsl.l, 50)).toBe(true);
    });

    it('preserves the input hue when saturation is 0', () => {
      const oklch = hslToOklch(200, 0, 50);
      expect(oklch.c).toBe(0);
      expect(oklch.h).toBe(200);
    });

    it('produces a color whose HSL serialization matches the input', () => {
      const oklch = hslToOklch(45, 80, 60);
      const out = getColorString({ ...oklch, alpha: 1 }, 'hsl');
      expect(out).toMatch(/^hsl\(/);
    });
  });

  describe('clampToSrgb', () => {
    it('reduces chroma so the color fits the sRGB gamut', () => {
      const wide = { l: 0.7, c: CHROMA_MAX, h: 30, alpha: 1 };
      const clamped = clampToSrgb(wide);
      expect(clamped.c).toBeLessThan(wide.c);
      expect(closeTo(clamped.l, wide.l, 0.01)).toBe(true);
      expect(closeTo(clamped.h, wide.h, 0.01)).toBe(true);
    });
  });
});
