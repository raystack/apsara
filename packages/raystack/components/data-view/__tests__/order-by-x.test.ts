import { describe, expect, it } from 'vitest';
import { orderByX } from '../utils/order-by-x';
import { seededRandom } from './helpers';

/**
 * `orderByX` returns indices ascending by `x`, ties broken by input order.
 *
 * It has two implementations behind one signature — a comparison sort below 64
 * items, a counting sort at or above it — so most of these run a differential
 * against `Array#sort`, which is the specification the counting sort has to
 * reproduce exactly (including the tie-break, which lane packing depends on).
 */

const BUCKET_SORT_MIN_ITEMS = 64;

/** The order the counting sort has to match. */
const referenceOrder = (items: { x: number }[]) =>
  items.map((_, i) => i).sort((a, b) => items[a].x - items[b].x || a - b);

describe('orderByX', () => {
  const sortedXs = (items: { x: number }[]) =>
    Array.from(orderByX(items), index => items[index].x);

  it('returns an empty order for empty input', () => {
    expect(Array.from(orderByX([]))).toEqual([]);
  });

  it('returns the only index for a single item', () => {
    expect(Array.from(orderByX([{ x: 42 }]))).toEqual([0]);
  });

  it('orders ascending by x, breaking ties by input order', () => {
    const items = [{ x: 30 }, { x: 10 }, { x: 30 }, { x: -5 }];
    expect(Array.from(orderByX(items))).toEqual([3, 1, 0, 2]);
  });

  /* Past 64 items orderByX swaps its comparison sort for a counting sort, so
     the rest of these run above that threshold. */

  it('agrees with itself either side of the counting-sort threshold', () => {
    // The implementation is chosen by item count, so the same data must order
    // identically at 63 items and at 64 — otherwise adding one card silently
    // repacks the lanes. Ties are dense here to put the tie-break under load.
    const items = Array.from({ length: BUCKET_SORT_MIN_ITEMS }, (_, i) => ({
      x: (i % 8) * 50
    }));
    const below = items.slice(0, BUCKET_SORT_MIN_ITEMS - 1);
    expect(Array.from(orderByX(below))).toEqual(referenceOrder(below));
    expect(Array.from(orderByX(items))).toEqual(referenceOrder(items));
  });

  it('matches a comparison sort on randomly spread items', () => {
    const random = seededRandom(7);
    for (let round = 0; round < 20; round++) {
      const items = Array.from({ length: 500 }, () => ({
        x: Math.round((random() - 0.5) * 20000)
      }));
      expect(Array.from(orderByX(items))).toEqual(referenceOrder(items));
    }
  });

  it('matches a comparison sort when every x is negative', () => {
    // `minX` is negative, so the bucket index is driven entirely by the offset
    // rather than by x itself — the case where a missing `- minX` still looks
    // correct on non-negative data.
    const random = seededRandom(13);
    const items = Array.from({ length: 400 }, () => ({
      x: -Math.round(random() * 50000) - 1
    }));
    expect(Array.from(orderByX(items))).toEqual(referenceOrder(items));
  });

  it('keeps input order when every item shares one x', () => {
    // Zero extent — nothing to bucket by, and the tie-break is input order.
    const items = Array.from({ length: 100 }, () => ({ x: 42 }));
    expect(Array.from(orderByX(items))).toEqual(
      Array.from({ length: 100 }, (_, i) => i)
    );
  });

  it('sorts a bucket deeper than the insertion-sort cutoff', () => {
    // 80 items on one x land in a single bucket, past the depth where that
    // bucket hands off to a comparison sort.
    const items = [
      ...Array.from({ length: 80 }, () => ({ x: 100 })),
      ...Array.from({ length: 40 }, (_, i) => ({ x: 900 - i }))
    ];
    expect(sortedXs(items)).toEqual(
      items.map(item => item.x).sort((a, b) => a - b)
    );
  });

  it('orders items clustered at both ends of the extent', () => {
    // A near-empty middle makes the uniform bucket split maximally uneven.
    const items = [
      ...Array.from({ length: 60 }, (_, i) => ({ x: i / 1000 })),
      ...Array.from({ length: 60 }, (_, i) => ({ x: 10000 + i / 1000 }))
    ];
    expect(sortedXs(items)).toEqual(
      items.map(item => item.x).sort((a, b) => a - b)
    );
  });

  it('still returns a usable permutation for non-finite x', () => {
    // Non-finite geometry shouldn't reach here — x comes from the time scale —
    // but a NaN must not corrupt the ordering of the cards around it or drop
    // an index, which would lose a card from the canvas entirely. Ordering
    // *among* non-finite values is not asserted: `a.x - b.x` is NaN for those
    // pairs, so no total order exists to assert against.
    const cases: { x: number }[][] = [
      Array.from({ length: 70 }, (_, i) => ({
        x: i === 30 ? Number.NaN : i * 10
      })),
      Array.from({ length: 70 }, (_, i) => ({
        x: i === 5 ? Number.POSITIVE_INFINITY : i * 10
      })),
      Array.from({ length: 70 }, () => ({ x: Number.NaN }))
    ];
    for (const items of cases) {
      const order = Array.from(orderByX(items));
      expect(order.length).toBe(items.length);
      expect([...order].sort((a, b) => a - b)).toEqual(
        Array.from({ length: items.length }, (_, i) => i)
      );
    }
  });

  it('orders the finite items correctly around an infinity', () => {
    // Infinity widens the extent to the point where every finite item buckets
    // together, which forces the deep-bucket comparison fallback. The finite
    // cards must still come out in order.
    const items = [
      ...Array.from({ length: 69 }, (_, i) => ({ x: 690 - i * 10 })),
      { x: Number.POSITIVE_INFINITY }
    ];
    const finite = Array.from(orderByX(items))
      .map(index => items[index].x)
      .filter(Number.isFinite);
    expect(finite).toEqual([...finite].sort((a, b) => a - b));
  });
});
