import { orderByX } from './order-by-x';

export interface PackLaneItem {
  /** Left edge in px (time-scale space). */
  x: number;
  /** Rendered width in px. */
  width: number;
}

export interface PackLanesResult {
  /** Lane index per input item, in the input's original order. */
  lanes: number[];
  laneCount: number;
}

/**
 * Horizontal gap between cards sharing a lane. Not the vertical gap between
 * lanes — that's the `laneGap` prop (default 16) applied in timeline.tsx.
 */
const DEFAULT_CARD_GAP_PX = 8;

/**
 * Below this, scanning `laneEnds` linearly beats the sweep's typed-array
 * setup — the scan is only quadratic once both the item count and the lane
 * count are large.
 */
const SWEEP_MIN_ITEMS = 64;

/**
 * Greedy interval scheduling. Items are visited in ascending `x` order and
 * each is dropped into the first lane whose last occupant ends at least
 * `gapPx` before the item starts; a new lane is opened when none fits.
 * Produces the dense "packed" layout of the timeline design — many
 * non-overlapping cards share a lane.
 *
 * Two implementations, identical output: a direct scan for small inputs, and
 * an O(n) sweep once the input is large enough for the scan's O(items × lanes)
 * to bite (10k mutually overlapping cards is ~10^7 comparisons).
 */
export function packLanes(
  items: PackLaneItem[],
  gapPx: number = DEFAULT_CARD_GAP_PX
): PackLanesResult {
  const order = orderByX(items);
  return items.length < SWEEP_MIN_ITEMS
    ? packByScan(items, gapPx, order)
    : packBySweep(items, gapPx, order);
}

/** First-fit by scanning every lane end — O(items × lanes). */
function packByScan(
  items: PackLaneItem[],
  gapPx: number,
  order: Int32Array
): PackLanesResult {
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

/**
 * First-fit as a left-to-right sweep — same assignment as `packByScan`, in
 * O(n) rather than O(items × lanes).
 *
 * Two structures replace the linear `findIndex`:
 *
 * - A **free-lane bitmap** (words plus a summary word per 32 words) answers
 *   "smallest free lane" in a couple of `Math.clz32` calls. Smallest-free-id
 *   is exactly what first-fit picks, so lane assignment is unchanged.
 * - A **bucket queue** releases lanes as the sweep passes them. Lanes are
 *   filed under the column their occupant frees up in; because the sweep
 *   advances monotonically in x, columns strictly behind the current one
 *   release wholesale, and only the current column needs an exact per-lane
 *   check. That is Dial's monotone priority queue: O(1) amortized per
 *   insert/extract, versus O(log lanes) for a heap.
 */
function packBySweep(
  items: PackLaneItem[],
  gapPx: number,
  order: Int32Array
): PackLanesResult {
  const n = items.length;
  const lanes = new Array<number>(n).fill(0);

  // Column space spans starts *and* release times, so a lane always files
  // into a real column.
  let minX = Infinity;
  let maxRelease = -Infinity;
  for (let i = 0; i < n; i++) {
    const item = items[i];
    if (item.x < minX) minX = item.x;
    const release = item.x + item.width + gapPx;
    if (release > maxRelease) maxRelease = release;
  }
  // Degenerate extents (every card at one x, non-finite geometry) collapse to
  // a single column: the exact per-lane check still runs, it just runs on the
  // whole queue.
  const span = maxRelease - minX;
  const colCount = span > 0 ? n : 1;
  const colScale = span > 0 ? colCount / span : 0;
  const colOf = (value: number) => {
    const col = Math.floor((value - minX) * colScale);
    if (col < 0) return 0;
    return col >= colCount ? colCount - 1 : col;
  };

  // Release queue: an intrusive singly-linked list per column. A lane is in at
  // most one column at a time, so `releaseNext` needs one slot per lane and
  // lanes never exceed items.
  const releaseHead = new Int32Array(colCount).fill(-1);
  const releaseNext = new Int32Array(n).fill(-1);
  /** Time (px) at which each lane's occupant frees it — end + gap. */
  const laneRelease = new Float64Array(n);

  // Free-lane bitmap. `summary` bit s.w is set when word w of block s has any
  // free lane, so the search skips 1024 lanes at a time.
  const wordCount = (n + 31) >> 5;
  const words = new Uint32Array(wordCount);
  const summary = new Uint32Array((wordCount + 31) >> 5);

  const markFree = (lane: number) => {
    const word = lane >> 5;
    words[word] |= 1 << (lane & 31);
    summary[word >> 5] |= 1 << (word & 31);
  };

  /** Lowest set bit's index. Undefined for 0 — callers guard. */
  const lowestBit = (bits: number) => 31 - Math.clz32(bits & -bits);

  const takeSmallestFree = () => {
    for (let block = 0; block < summary.length; block++) {
      while (summary[block] !== 0) {
        const blockBits = summary[block];
        const wordOffset = lowestBit(blockBits);
        const word = (block << 5) + wordOffset;
        const bits = words[word];
        if (bits === 0) {
          // Word emptied without its summary bit clearing — can't happen
          // below, but clearing here keeps the loop finite regardless.
          summary[block] = blockBits & ~(1 << wordOffset);
          continue;
        }
        const bitOffset = lowestBit(bits);
        words[word] = bits & ~(1 << bitOffset);
        if (words[word] === 0) summary[block] = blockBits & ~(1 << wordOffset);
        return (word << 5) + bitOffset;
      }
    }
    return -1;
  };

  let laneCount = 0;
  // Every column before this one has been drained.
  let drainedCol = 0;

  for (let k = 0; k < n; k++) {
    const index = order[k];
    const item = items[index];
    const x = item.x;
    const col = colOf(x);

    // Columns strictly behind the sweep release unconditionally: their release
    // times all fall below the current column's left edge, which is <= x.
    while (drainedCol < col) {
      let lane = releaseHead[drainedCol];
      while (lane !== -1) {
        const next = releaseNext[lane];
        releaseNext[lane] = -1;
        markFree(lane);
        lane = next;
      }
      releaseHead[drainedCol] = -1;
      drainedCol++;
    }

    // The current column straddles x, so its lanes need the exact test. Ones
    // that aren't free yet are relinked for the next item in this column.
    let pending = releaseHead[col];
    let stillBusy = -1;
    while (pending !== -1) {
      const next = releaseNext[pending];
      if (laneRelease[pending] <= x) {
        releaseNext[pending] = -1;
        markFree(pending);
      } else {
        releaseNext[pending] = stillBusy;
        stillBusy = pending;
      }
      pending = next;
    }
    releaseHead[col] = stillBusy;

    let lane = takeSmallestFree();
    if (lane === -1) lane = laneCount++;
    lanes[index] = lane;

    const release = x + item.width + gapPx;
    laneRelease[lane] = release;
    // Release is at or after x, so this never files into a drained column.
    const releaseCol = colOf(release);
    releaseNext[lane] = releaseHead[releaseCol];
    releaseHead[releaseCol] = lane;
  }

  return { lanes, laneCount };
}
