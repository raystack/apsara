import Color from 'color';
import type { Color as VSCodeColorType } from 'vscode-languageserver';
import tokens from '../tokens';

export const TOKEN_PREFIX = 'rs';

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
 * Converts a Color object to VS Code Color format
 * @param color - The color to convert
 * @returns The color in VS Code Color format
 */
export const colorToVSCodeColor = (color: string): VSCodeColorType | null => {
  try {
    // Handle transparent values
    if (color === 'transparent') {
      return {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
      };
    }
    // handles special CSS values that don't have a specific color
    if (color === 'currentColor' || color === 'inherit') {
      return null;
    }

    const rgb = Color(color).rgb();
    return {
      red: rgb.red() / 255,
      green: rgb.green() / 255,
      blue: rgb.blue() / 255,
      alpha: rgb.alpha()
    };
  } catch {
    // If the color library can't parse the value, return null
    return null;
  }
};

/**
 * Converts a VS Code Color to a Color object
 * @param color - The VS Code color object to convert
 * @returns The color in hex format
 */
export const VSCodeColorToColor = (color: VSCodeColorType): string => {
  return Color.rgb(
    Math.round(color.red * 255),
    Math.round(color.green * 255),
    Math.round(color.blue * 255)
  )
    .alpha(color.alpha)
    .hex();
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
