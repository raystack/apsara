import convertImport from 'color-convert';
import type { Color as VSCodeColorType } from 'vscode-languageserver';
import tokens from '../tokens';

export const TOKEN_PREFIX = 'rs';

// color-convert@^3.1.3 ships oklch at runtime but its .d.ts omits it; shim until upstream catches up.
type RawTriple = (input: [number, number, number]) => [number, number, number];
const convert = convertImport as typeof convertImport & {
  rgb: { oklch: { raw: RawTriple } };
  oklch: { rgb: { raw: RawTriple } };
};

// Tokens are always written as oklch(L C H) or oklch(L C H / A).
const OKLCH_REGEX =
  /^\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)\s*$/;

// color-convert uses L 0-100 and C in the 0-100 range that matches CSS × 100.
const CSS_TO_CC = 100;

const round = (n: number, p: number) => Number.parseFloat(n.toFixed(p));

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Get the token name for a given token group and name
 * @param tokenGroupName - The name of the token group
 * @param tokenName - The name of the token
 * @returns The token name
 */
export const getTokenName = (tokenGroupName: string, tokenName: string) => {
  return `--${TOKEN_PREFIX}-${tokenGroupName}-${tokenName}`;
};

/**
 * Get the token value from a given token name
 * @param tokenName - The name of the token
 * @returns The token value
 */
export const getTokenValueFromName = (tokenName: string): string | null => {
  const tokenWithoutPrefix = tokenName.replace(`--${TOKEN_PREFIX}-`, '');
  const [tokenGroup, ...tokenNameParts] = tokenWithoutPrefix.split('-');
  const tokenNameKey = tokenNameParts.join('-');

  if (!tokenGroup || !tokenNameKey) {
    return null;
  }

  const tokenValue =
    tokens[tokenGroup as keyof typeof tokens][
      tokenNameKey as keyof typeof tokens
    ];

  if (!tokenValue) {
    return null;
  }

  return tokenValue;
};

/**
 * Parses an oklch() token value into VS Code's Color shape.
 * Tokens are the only callers; non-oklch inputs (other than the
 * transparent/currentColor/inherit keywords) return null.
 */
export const colorToVSCodeColor = (color: string): VSCodeColorType | null => {
  if (color === 'transparent') {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }
  if (color === 'currentColor' || color === 'inherit') {
    return null;
  }
  const match = OKLCH_REGEX.exec(color);
  if (!match) return null;
  const [, lStr, cStr, hStr, aStr] = match;
  const l = Number.parseFloat(lStr) * CSS_TO_CC;
  const c = Number.parseFloat(cStr) * CSS_TO_CC;
  const h = Number.parseFloat(hStr);
  const alpha = aStr === undefined ? 1 : Number.parseFloat(aStr);
  const [r, g, b] = convert.oklch.rgb.raw([l, c, h]);
  return {
    red: clamp01(r / 255),
    green: clamp01(g / 255),
    blue: clamp01(b / 255),
    alpha
  };
};

/**
 * Serializes VS Code's Color (sRGB 0-1 floats) to an oklch() string,
 * matching the design system's token format so picker edits stay
 * consistent with the rest of the codebase.
 */
export const VSCodeColorToColor = (color: VSCodeColorType): string => {
  const [l, c, h] = convert.rgb.oklch.raw([
    color.red * 255,
    color.green * 255,
    color.blue * 255
  ]);
  const L = round(l / CSS_TO_CC, 4);
  const C = round(c / CSS_TO_CC, 4);
  // color-convert returns an arbitrary hue for achromatic colors; pin to 0.
  const H = C === 0 ? 0 : round(h, 2);
  const body = `${L} ${C} ${H}`;
  if (color.alpha === undefined || color.alpha === 1) {
    return `oklch(${body})`;
  }
  return `oklch(${body} / ${round(color.alpha, 4)})`;
};

// Function to get the pattern match and the range around the cursor
export const getPatternMatch = (
  pattern: RegExp,
  text: string,
  cursorPosition: number
) => {
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    // Check if cursor is within this match
    if (cursorPosition >= start && cursorPosition <= end) {
      return { start, end, match: match[0] };
    }
  }

  // Fallback: return the cursor position
  return { start: cursorPosition, end: cursorPosition, match: null };
};
