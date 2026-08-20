import { describe, expect, it } from 'vitest';
import { packLanes } from '../utils/pack-lanes';
import { digest, randomItems } from './helpers';

/**
 * `packLanes` is greedy first-fit interval scheduling: items are visited in
 * ascending x and dropped into the lowest-numbered lane free at that point.
 *
 * It has two implementations behind one signature — a direct lane scan below 64
 * items, an O(n) sweep at or above it — so most of these are differentials
 * against the scan. The scan is the specification: it is the pre-rewrite
 * implementation, transcribed, and lane assignment is visible output (a card's
 * lane is its vertical position, and `context.laneIndex` is public API through
 * `renderCard`).
 */

const SWEEP_MIN_ITEMS = 64;
const DEFAULT_GAP_PX = 8;

/** First-fit by scanning every lane end — the pre-rewrite implementation. */
function packByScanReference(
  items: { x: number; width: number }[],
  gapPx = DEFAULT_GAP_PX
) {
  const order = items
    .map((_, i) => i)
    .sort((a, b) => items[a].x - items[b].x || a - b);
  const laneEnds: number[] = [];
  const lanes = new Array<number>(items.length).fill(0);
  for (const index of order) {
    const item = items[index];
    let lane = laneEnds.findIndex(end => end + gapPx <= item.x);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = item.x + item.width;
    lanes[index] = lane;
  }
  return { lanes, laneCount: laneEnds.length };
}

/* ─────────────────── characterisation: lane assignment ───────────────────
   Goldens pinning `packLanes` output at sizes too large to hand-write. They
   were recorded from the implementation before the O(n) rewrite, so a digest
   mismatch means lane assignment moved — which is a visible change.

   Digests rather than 500-element literals: the arrays are only ever compared,
   never read, and an unreadable wall of numbers hides what the test is for. */

describe('packLanes (characterisation)', () => {
  it('pins lane assignment for randomly spread items', () => {
    const { lanes, laneCount } = packLanes(randomItems(42, 500));
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 13,
        "lanes": "908c8fec",
      }
    `);
  });

  it('pins lane assignment for a second, denser spread', () => {
    const { lanes, laneCount } = packLanes(randomItems(7, 500), 4);
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 12,
        "lanes": "e1515f6a",
      }
    `);
  });

  it('pins lane assignment when every item overlaps every other', () => {
    // No lane is ever reusable, so lane count tracks item count — the shape
    // that makes the lane scan quadratic.
    const items = Array.from({ length: 400 }, (_, i) => ({
      x: i,
      width: 10000
    }));
    const { lanes, laneCount } = packLanes(items);
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 400,
        "lanes": "732748cb",
      }
    `);
  });

  it('pins lane assignment when items cluster on a single x', () => {
    const items = Array.from({ length: 200 }, (_, i) => ({
      x: 500,
      width: i % 3
    }));
    const { lanes, laneCount } = packLanes(items);
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 200,
        "lanes": "23ec0f1f",
      }
    `);
  });

  it('pins lane assignment across the gap boundary', () => {
    // Alternates releases landing exactly on the gap boundary (reusable) with
    // ones a pixel short (not) — the comparison most at risk from a rewrite.
    const items = Array.from({ length: 300 }, (_, i) => ({
      x: i * 108 + (i % 2),
      width: 100
    }));
    const { lanes, laneCount } = packLanes(items);
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 2,
        "lanes": "05a0dca4",
      }
    `);
  });

  it('pins lane assignment for items sharing exact edges', () => {
    // Ties on x, where assignment depends on the visit order the sort gives.
    const items = Array.from({ length: 120 }, (_, i) => ({
      x: (i % 4) * 250,
      width: 100 + (i % 7) * 10
    }));
    const { lanes, laneCount } = packLanes(items);
    expect({ laneCount, lanes: digest(lanes) }).toMatchInlineSnapshot(`
      {
        "laneCount": 30,
        "lanes": "34e5e40d",
      }
    `);
  });
});

/* ────────────────────────────── behaviour ────────────────────────────── */

describe('packLanes', () => {
  it('returns no lanes for empty input', () => {
    expect(packLanes([])).toEqual({ lanes: [], laneCount: 0 });
  });

  it('packs non-overlapping items into the same lane', () => {
    const { lanes, laneCount } = packLanes([
      { x: 0, width: 100 },
      { x: 120, width: 50 }
    ]);
    expect(lanes).toEqual([0, 0]);
    expect(laneCount).toBe(1);
  });

  it('opens a new lane for overlapping items', () => {
    const { lanes, laneCount } = packLanes([
      { x: 0, width: 100 },
      { x: 50, width: 100 }
    ]);
    expect(lanes).toEqual([0, 1]);
    expect(laneCount).toBe(2);
  });

  it('respects the gap: items closer than gapPx do not share a lane', () => {
    // First ends at 100; second starts at 104 < 100 + 8 → new lane.
    const tight = packLanes([
      { x: 0, width: 100 },
      { x: 104, width: 50 }
    ]);
    expect(tight.lanes).toEqual([0, 1]);
    // Exactly at the gap boundary → same lane.
    const exact = packLanes([
      { x: 0, width: 100 },
      { x: 108, width: 50 }
    ]);
    expect(exact.lanes).toEqual([0, 0]);
  });

  it('packs edge-to-edge when the gap is zero', () => {
    // gapPx 0 makes touching cards reusable, the boundary the default gap
    // hides: lane reuse now turns on `end <= x` rather than `end + 8 <= x`.
    const { lanes, laneCount } = packLanes(
      [
        { x: 0, width: 100 },
        { x: 100, width: 50 },
        { x: 99, width: 10 }
      ],
      0
    );
    expect(lanes).toEqual([0, 0, 1]);
    expect(laneCount).toBe(2);
  });

  it('assigns lanes by ascending x regardless of input order', () => {
    const { lanes, laneCount } = packLanes([
      { x: 220, width: 60 }, // fits after the first item
      { x: 0, width: 100 },
      { x: 50, width: 100 } // overlaps the first → lane 1
    ]);
    expect(lanes).toEqual([0, 0, 1]);
    expect(laneCount).toBe(2);
  });

  it('gives every zero-width item its own lane at a shared x', () => {
    // Width 0 still occupies its x, and the gap keeps the next item out, so
    // these cannot collapse onto one lane.
    const items = Array.from({ length: 5 }, () => ({ x: 40, width: 0 }));
    const { lanes, laneCount } = packLanes(items);
    expect(lanes).toEqual([0, 1, 2, 3, 4]);
    expect(laneCount).toBe(5);
  });

  it('agrees with the lane scan either side of the sweep threshold', () => {
    // The implementation is chosen by item count, so the same data must pack
    // identically at 63 items and at 64. A mismatch means adding one card
    // repacks every lane.
    const items = Array.from({ length: SWEEP_MIN_ITEMS }, (_, i) => ({
      x: (i % 16) * 60,
      width: 100 + (i % 5) * 20
    }));
    const below = items.slice(0, SWEEP_MIN_ITEMS - 1);
    expect(packLanes(below)).toEqual(packByScanReference(below));
    expect(packLanes(items)).toEqual(packByScanReference(items));
  });

  it('matches a lane scan across many random inputs', () => {
    // The goldens above pin six fixed shapes; this sweeps far more input than
    // snapshots can carry, and reports the mismatched lane directly rather
    // than as a changed hash.
    for (let seed = 1; seed <= 25; seed++) {
      const items = randomItems(seed, 300);
      expect(packLanes(items)).toEqual(packByScanReference(items));
    }
  });

  it('matches a lane scan on negative coordinates', () => {
    // Column bucketing is offset by the minimum x, so an entirely negative
    // domain is the case where a missing offset still passes on ordinary data.
    const items = Array.from({ length: 300 }, (_, i) => ({
      x: -30000 + i * 37,
      width: 40 + (i % 11) * 15
    }));
    expect(packLanes(items)).toEqual(packByScanReference(items));
  });

  it('reuses lanes above the first bitmap block', () => {
    // The free-lane bitmap is two-level: 32 words of 32 lanes per summary
    // block, so lanes 0-1023 live in block 0 and everything above in block 1.
    // Every other test tops out at 400 lanes, leaving the multi-block walk in
    // `takeSmallestFree` unexercised.
    //
    // Widths shrink as x grows, so higher lanes free up first. By x = 4000
    // lanes 0-1334 are still occupied and 1335+ are free, which forces the
    // search past an all-zero block-0 summary before it finds anything.
    const opening = Array.from({ length: 1500 }, (_, i) => ({
      x: i,
      width: 12000 - 7 * i
    }));
    const followers = Array.from({ length: 120 }, (_, i) => ({
      x: 4000 + i,
      width: 50
    }));
    const items = [...opening, ...followers];

    const result = packLanes(items);
    expect(result).toEqual(packByScanReference(items));

    // Proves the block-1 path actually ran rather than the data quietly
    // staying inside block 0.
    const followerLanes = result.lanes.slice(opening.length);
    expect(Math.min(...followerLanes)).toBeGreaterThanOrEqual(1024);
    expect(result.laneCount).toBe(1500);
  });

  it('survives non-finite geometry without losing a card', () => {
    // Non-finite geometry shouldn't reach here — x and width come from the
    // time scale — but a NaN must not throw or drop an item, which would leave
    // a card unplaced on the canvas. The assignment itself is not pinned: NaN
    // comparisons are false in both directions, so "first fit" has no meaning
    // for those items and the two implementations are free to disagree.
    const cases: { x: number; width: number }[][] = [
      Array.from({ length: 80 }, (_, i) => ({
        x: i * 20,
        width: i === 9 ? Number.NaN : 30
      })),
      Array.from({ length: 80 }, (_, i) => ({
        x: i === 3 ? Number.NaN : i * 20,
        width: 30
      })),
      Array.from({ length: 80 }, (_, i) => ({
        x: i * 20,
        width: i === 40 ? Number.POSITIVE_INFINITY : 30
      }))
    ];
    for (const items of cases) {
      const { lanes, laneCount } = packLanes(items);
      expect(lanes).toHaveLength(items.length);
      expect(laneCount).toBeGreaterThan(0);
      for (const lane of lanes) {
        expect(Number.isInteger(lane)).toBe(true);
        expect(lane).toBeGreaterThanOrEqual(0);
        expect(lane).toBeLessThan(laneCount);
      }
    }
  });
});
