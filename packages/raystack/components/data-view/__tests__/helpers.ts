/**
 * Fixtures shared by the data-view util suites.
 *
 * Kept in one place because `pack-lanes.test.ts` pins recorded goldens built
 * from these generators: a golden only means something if the data behind it
 * cannot drift, and two copies of an LCG eventually stop agreeing.
 */

/** Seeded LCG — a failing case has to be reproducible. */
export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** FNV-1a over the decimal text, so [1, 23] and [12, 3] can't collide. */
export function digest(values: readonly number[]): string {
  let hash = 0x811c9dc5;
  for (const value of values) {
    const text = `${value},`;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }
  return hash.toString(16).padStart(8, '0');
}

export const randomItems = (seed: number, count: number) => {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: Math.round(random() * 10000),
    width: Math.round(random() * 200)
  }));
};
