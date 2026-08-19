/**
 * Bucket key standing in for a null/undefined/empty grouping value. `groupData`
 * already keys that bucket by the empty string; Timeline lanes map their `null`
 * lane key onto it so both share the ordering rule below.
 */
export const EMPTY_BUCKET_KEY = '';

/**
 * Order bucket keys for a grouped renderer: declared keys first in the order
 * they are declared, then everything undeclared in first-seen order, then the
 * empty bucket last.
 *
 * `keys` arrives in first-seen order (a `Map`'s key order, which is insertion
 * order), and only keys that are actually present are emitted — a declared
 * value with no rows produces no section and no lane, so ordering never
 * conjures empty bands. The empty bucket is pinned last regardless of where it
 * appears in `order`, so a declared list doesn't have to mention it.
 *
 * Shared by `groupData` (section order for every renderer) and
 * `packLanesBySortValue` (Timeline lane order) so sections and lanes can never
 * disagree about where a value sits.
 */
export function orderBucketKeys(keys: string[], order?: string[]): string[] {
  const hasEmpty = keys.includes(EMPTY_BUCKET_KEY);
  const present = new Set(keys);
  present.delete(EMPTY_BUCKET_KEY);

  const ordered: string[] = [];
  if (order) {
    for (const key of order) {
      if (!present.has(key)) continue;
      present.delete(key);
      ordered.push(key);
    }
  }
  // Undeclared keys keep first-seen order — `keys`, not the Set, drives this.
  for (const key of keys) {
    if (!present.has(key)) continue;
    present.delete(key);
    ordered.push(key);
  }
  if (hasEmpty) ordered.push(EMPTY_BUCKET_KEY);
  return ordered;
}
