import { fnv1a } from '~/shared/hash';

/**
 * Fixtures shared by the data-view util suites.
 *
 * Kept in one place because `pack-lanes.test.ts` pins recorded goldens built
 * from these generators: a golden only means something if the data behind it
 * cannot drift, and two copies of an LCG eventually stop agreeing.
 */

/** Seeded LCG, so a failing case is reproducible. */
export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** FNV-1a over the decimal text, so [1, 23] and [12, 3] can't collide. */
export function digest(values: readonly number[]): string {
  let hash = fnv1a('');
  for (const value of values) {
    hash = fnv1a(`${value},`, hash);
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
