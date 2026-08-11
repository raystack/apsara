/** Anything placed on the timeline's x axis. */
export interface XPositioned {
  x: number;
}

/**
 * Below this the counting sort's setup (three passes plus two typed arrays)
 * costs more than a comparison sort. `packLanes` runs per group section, so
 * most calls are small.
 */
const BUCKET_SORT_MIN_ITEMS = 64;

/**
 * A bucket deeper than this would drag insertion sort towards O(m²) (thousands
 * of cards landing in one pixel column), so it hands off to a comparison sort
 * instead — bounding the pathological case at O(n log n).
 */
const INSERTION_SORT_MAX_BUCKET = 32;

/**
 * Item indices ordered ascending by `x`, ties broken by input order.
 *
 * Counting sort over uniform x buckets. `x` is affine in time, so cards spread
 * near-uniformly across the domain and buckets stay ~1 deep — O(n) at the
 * sizes that matter, where a comparison sort is O(n log n). Clustered input
 * degrades gracefully rather than falling off a cliff (see the two constants
 * above).
 *
 * Returns indices rather than sorted items so callers can reuse one ordering
 * for several parallel arrays without copying the items themselves.
 */
export function orderByX(items: readonly XPositioned[]): Int32Array {
  const n = items.length;
  const order = new Int32Array(n);
  if (n === 0) return order;

  if (n < BUCKET_SORT_MIN_ITEMS) {
    const plain = new Array<number>(n);
    for (let i = 0; i < n; i++) plain[i] = i;
    plain.sort((a, b) => items[a].x - items[b].x || a - b);
    order.set(plain);
    return order;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < n; i++) {
    const { x } = items[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }

  const span = maxX - minX;
  // Every item at the same x (or a non-finite extent): input order already is
  // the tie-break order.
  if (!(span > 0)) {
    for (let i = 0; i < n; i++) order[i] = i;
    return order;
  }

  // One bucket per item — the density that keeps buckets ~1 deep.
  const bucketCount = n;
  const scale = bucketCount / span;
  const bucketOf = new Int32Array(n);
  // `starts` is counts shifted by one, prefix-summed in place: after the sum,
  // starts[b] is bucket b's first slot and starts[b + 1] its end.
  const starts = new Int32Array(bucketCount + 1);
  for (let i = 0; i < n; i++) {
    let bucket = Math.floor((items[i].x - minX) * scale);
    if (bucket < 0) bucket = 0;
    else if (bucket >= bucketCount) bucket = bucketCount - 1;
    bucketOf[i] = bucket;
    starts[bucket + 1]++;
  }
  for (let bucket = 0; bucket < bucketCount; bucket++) {
    starts[bucket + 1] += starts[bucket];
  }

  // Stable scatter — within a bucket, items stay in input order, which is the
  // tie-break the comparison path applies for equal x.
  const cursor = Int32Array.from(starts.subarray(0, bucketCount));
  for (let i = 0; i < n; i++) order[cursor[bucketOf[i]]++] = i;

  for (let bucket = 0; bucket < bucketCount; bucket++) {
    const from = starts[bucket];
    const to = starts[bucket + 1];
    const size = to - from;
    if (size < 2) continue;
    if (size <= INSERTION_SORT_MAX_BUCKET) {
      // Insertion sort with a strict `>` shift is stable, so equal-x items
      // keep the input order the scatter gave them.
      for (let i = from + 1; i < to; i++) {
        const index = order[i];
        const { x } = items[index];
        let j = i - 1;
        while (j >= from && items[order[j]].x > x) {
          order[j + 1] = order[j];
          j--;
        }
        order[j + 1] = index;
      }
    } else {
      const slice = Array.from(order.subarray(from, to));
      slice.sort((a, b) => items[a].x - items[b].x || a - b);
      order.set(slice, from);
    }
  }

  return order;
}
