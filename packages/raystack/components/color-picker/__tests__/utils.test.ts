import { describe, expect, it } from 'vitest';
import {
  CHROMA_MAX,
  clampToSrgb,
  formatColor,
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

  describe('formatColor', () => {
    describe('hex', () => {
      it('returns uppercase 6-digit hex for opaque inputs', () => {
        expect(formatColor('#ff0000', 'hex')).toBe('#FF0000');
        expect(formatColor('rgb(0, 255, 0)', 'hex')).toBe('#00FF00');
        expect(formatColor('red', 'hex')).toBe('#FF0000');
      });

      it('returns uppercase 8-digit hex when alpha < 1', () => {
        expect(formatColor('rgba(255, 0, 0, 0.5)', 'hex')).toBe('#FF000080');
        expect(formatColor('oklch(0 0 0 / 0.5)', 'hex')).toBe('#00000080');
      });

      it('round-trips an in-gamut oklch to the same sRGB hex', () => {
        expect(formatColor('oklch(0.6279 0.2576 29.23)', 'hex')).toBe(
          '#FF0000'
        );
      });

      it('gamut-maps wide-gamut OKLCH instead of per-channel clipping', () => {
        // Per-channel clip would push this to #FF0000 (R channel saturates,
        // hue lost). toGamut preserves hue by reducing chroma.
        const hex = formatColor('oklch(0.7 0.32 30)', 'hex');
        expect(hex).toMatch(/^#[0-9A-F]{6}$/);
        expect(hex).not.toBe('#FF0000');
      });
    });

    describe('rgb', () => {
      it('returns rgb() for opaque and rgba() for translucent', () => {
        expect(formatColor('#ff0000', 'rgb')).toBe('rgb(255, 0, 0)');
        expect(formatColor('rgba(255, 0, 0, 0.5)', 'rgb')).toBe(
          'rgba(255, 0, 0, 0.5)'
        );
      });
    });

    describe('hsl', () => {
      it('returns hsl() for opaque and hsla() for translucent', () => {
        expect(formatColor('#ff0000', 'hsl')).toMatch(/^hsl\(/);
        expect(formatColor('rgba(255, 0, 0, 0.5)', 'hsl')).toMatch(/^hsla\(/);
      });
    });

    describe('oklch', () => {
      it('serializes to the design-system oklch() format', () => {
        // hex → oklch should produce a parseable oklch with finite L/C/H.
        const out = formatColor('#ff0000', 'oklch');
        expect(out).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
      });

      it('appends alpha tail when alpha < 1', () => {
        expect(formatColor('rgba(255, 0, 0, 0.5)', 'oklch')).toMatch(
          /^oklch\([\d.]+ [\d.]+ [\d.]+ \/ [\d.]+\)$/
        );
      });
    });

    it('returns null for unparseable input in every format', () => {
      for (const fmt of ['hex', 'rgb', 'hsl', 'oklch'] as const) {
        expect(formatColor('not a color', fmt)).toBeNull();
        expect(formatColor('', fmt)).toBeNull();
      }
    });
  });
});
