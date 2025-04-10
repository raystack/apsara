export const COLORS = [
  "indigo",
  "orange",
  "mint",
  "neutral",
  "sky",
  "lime",
  "grass",
  "cyan",
  "iris",
  "purple",
  "pink",
  "crimson",
  "gold",
] as const;

export type AVATAR_COLORS = typeof COLORS[number];

export function getAvatarColor(str: string): AVATAR_COLORS {
  const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % COLORS.length;
  return COLORS[index];
}
