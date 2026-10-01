import { fnv1a } from '../../shared/hash';

export const COLORS = [
  'indigo',
  'orange',
  'mint',
  'neutral',
  'sky',
  'lime',
  'grass',
  'cyan',
  'iris',
  'purple',
  'pink',
  'crimson',
  'gold'
] as const;

export type AVATAR_COLORS = (typeof COLORS)[number];

/** All avatar colors, in hash order. Use it to build a `palette` subset. */
export const AVATAR_COLOR_PALETTE = COLORS;

export interface GetAvatarColorOptions {
  /** Mixed into the hash so the same string can map to a different color. A number and its string form give the same color. */
  seed?: string | number;
  /** Restricts the result to these colors. Order matters. Duplicates and unknown colors are ignored. If none remain, all colors are used. */
  palette?: readonly AVATAR_COLORS[];
}

const COLOR_SET: ReadonlySet<string> = new Set(COLORS);
let warnedEmptyPalette = false;

function resolvePalette(
  palette?: readonly AVATAR_COLORS[]
): readonly AVATAR_COLORS[] {
  if (!palette) return COLORS;
  const resolved = [...new Set(palette)].filter(color => COLOR_SET.has(color));
  if (resolved.length > 0) return resolved;
  if (process.env.NODE_ENV !== 'production' && !warnedEmptyPalette) {
    warnedEmptyPalette = true;
    console.warn(
      'getAvatarColor: `palette` has no valid colors. Falling back to all avatar colors.'
    );
  }
  return COLORS;
}

export function getAvatarColor(
  str: string,
  { seed, palette }: GetAvatarColorOptions = {}
): AVATAR_COLORS {
  const colors = resolvePalette(palette);
  // The separator keeps seed 'ab' + 'c' apart from seed 'a' + 'bc'.
  const start = seed === undefined ? undefined : fnv1a(`${seed}\u0000`);
  return colors[fnv1a(str, start) % colors.length];
}
