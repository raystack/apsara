export const AVATAR_COLORS = [
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

export type AvatarColor = (typeof AVATAR_COLORS)[number];

export interface GetAvatarColorOptions {
  /** Restricts the result to these colors. Order matters. If empty, all colors are used. */
  palette?: readonly AvatarColor[];
}

export function getAvatarColor(
  str: string,
  { palette }: GetAvatarColorOptions = {}
): AvatarColor {
  const colors = palette?.length ? palette : AVATAR_COLORS;
  // 32-bit FNV-1a
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // The lowest bit of FNV-1a is an XOR of each character's lowest bit, so it
  // ignores order. Mixing the high bits in keeps a 2-color palette order-sensitive.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x45d9f3b) >>> 0;
  return colors[hash % colors.length];
}
