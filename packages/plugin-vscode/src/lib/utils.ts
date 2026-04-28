import { converter, parse } from 'culori';
import type { Color as VSCodeColorType } from 'vscode-languageserver';
import tokens from '../tokens';

export const TOKEN_PREFIX = 'rs';

const toRgb = converter('rgb');
const toOklch = converter('oklch');

const round = (n: number | undefined, p: number) =>
  Number.parseFloat((n ?? 0).toFixed(p));

const clamp01 = (v: number | undefined) => Math.max(0, Math.min(1, v ?? 0));

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
 * Parses a CSS color string (oklch, hex, rgb, etc.) into VS Code's Color shape.
 * Returns null for non-renderable inputs (currentColor, inherit, parse failure).
 */
export const colorToVSCodeColor = (color: string): VSCodeColorType | null => {
  if (color === 'transparent') {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }
  if (color === 'currentColor' || color === 'inherit') {
    return null;
  }
  try {
    const parsed = parse(color);
    if (!parsed) return null;
    const rgb = toRgb(parsed);
    if (!rgb) return null;
    return {
      red: clamp01(rgb.r),
      green: clamp01(rgb.g),
      blue: clamp01(rgb.b),
      alpha: rgb.alpha ?? 1
    };
  } catch {
    return null;
  }
};

/**
 * Serializes VS Code's Color (sRGB 0-1 floats) to an oklch() string.
 * Output format matches the design system convention so picker edits
 * stay consistent with the rest of the codebase.
 */
export const VSCodeColorToColor = (color: VSCodeColorType): string => {
  const oklch = toOklch({
    mode: 'rgb',
    r: color.red,
    g: color.green,
    b: color.blue,
    alpha: color.alpha
  });
  if (!oklch) return '';

  const L = round(oklch.l, 4);
  const C = round(oklch.c, 4);
  const H = Number.isFinite(oklch.h) ? round(oklch.h, 2) : 0;
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
