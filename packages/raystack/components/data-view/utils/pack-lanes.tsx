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

const DEFAULT_LANE_GAP_PX = 8;

/**
 * Greedy interval scheduling. Items are visited in ascending `x` order and
 * each is dropped into the first lane whose last occupant ends at least
 * `gapPx` before the item starts; a new lane is opened when none fits.
 * Produces the dense "packed" layout of the timeline design — many
 * non-overlapping cards share a lane.
 */
export function packLanes(
  items: PackLaneItem[],
  gapPx: number = DEFAULT_LANE_GAP_PX
): PackLanesResult {
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
