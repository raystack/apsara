'use client';

import type { Row } from '@tanstack/react-table';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import {
  CSSProperties,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { Badge } from '../../badge';
import styles from '../data-view.module.css';
import {
  DataViewTimelineProps,
  GroupedData,
  TimelineActions,
  TimelineCardContext,
  TimelineScale
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { orderByX } from '../utils/order-by-x';
import { packLanes } from '../utils/pack-lanes';
import {
  buildAxis,
  createTimeScale,
  startOfUnit,
  TIMELINE_DEFAULT_UNIT_WIDTH,
  TIMELINE_UNIT_MS,
  toTimestamp
} from '../utils/time-scale';
import { FilterSummary } from './clear-filters';

const DEFAULT_ROW_HEIGHT = 66;
const DEFAULT_LANE_GAP = 16;
/**
 * Height (px) of a group section's header band: `DataView.List`'s group header
 * box exactly — `--rs-space-3` padding above and below a small `Badge` (8 + 22
 * + 8) — so the band reads identically when switching between the two
 * renderers. Fixed rather than measured because lane tops are derived from it,
 * so a content-driven height would feed back into the geometry it seeds. (List
 * only needs its own 36 as a virtualizer estimate, which it corrects by
 * measuring after paint; the timeline has no such correction pass.)
 */
const GROUP_BAND_HEIGHT = 38;
const DEFAULT_MIN_CARD_WIDTH = 60;
/** Assumed width of content-sized point cards for lane packing and culling. */
const DEFAULT_POINT_WIDTH = 120;
/** Floor for the rendered wrapper so near-zero spans stay visible and clickable. */
const MIN_RENDER_WIDTH = 24;
/** Units of padding around the data extent when no explicit `range` is given. */
const DOMAIN_PAD_UNITS = 2;
/** Half-window (in units) of the fallback domain used while loading with no data. */
const FALLBACK_DOMAIN_UNITS = 15;
/** Below this speed (px/ms) a release doesn't glide, and a glide stops. */
const MOMENTUM_MIN_SPEED = 0.05;
/** Speed cap (px/ms) so event-timing spikes can't launch a huge fling. */
const MOMENTUM_MAX_SPEED = 4;
/** Exponential decay constant (ms) of the post-release glide. */
const MOMENTUM_DECAY_TAU = 325;
/** Releasing this long (ms) after the last move means "held still" — no glide. */
const MOMENTUM_STALE_MS = 80;
/**
 * Breathing room between an edge-aligned scroll target ('start'/'end') and
 * the viewport edge — a card flush against the edge reads as clipped. The
 * domain clamp wins when there's no room, so targets at the domain edges
 * still sit flush instead of revealing space past the domain.
 */
const SCROLL_EDGE_INSET_PX = 24;

const clampSpeed = (v: number) =>
  Math.max(-MOMENTUM_MAX_SPEED, Math.min(v, MOMENTUM_MAX_SPEED));

/**
 * `lo + ((hi - lo) >> 1)` rather than `(lo + hi) >> 1` throughout: `>>` coerces
 * to int32, so the latter wraps to a negative midpoint once `lo + hi` passes
 * 2^31. These lists can't approach that, but the two forms cost the same and
 * mixing them in one file reads as though one of them were load-bearing.
 */

/** First index in `list` (ascending by `x`) with `x >= value`. */
function lowerBoundByX(list: readonly { x: number }[], value: number): number {
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (list[mid].x < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** First index in `list` (ascending by `x`) with `x > value`. */
function upperBoundByX(list: readonly { x: number }[], value: number): number {
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (list[mid].x <= value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * First box whose bottom edge reaches `value`, over parallel top/height
 * arrays. Used for lanes and for group-section slots: both stack without
 * overlapping, so tops *and* bottoms ascend, which holds for the measured
 * (variable-height) lane geometry as well as the fixed pitch.
 */
function lowerBoundByBottom(
  tops: readonly number[],
  heights: readonly number[],
  value: number
): number {
  let lo = 0;
  let hi = tops.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (tops[mid] + heights[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** First box whose top edge is past `value`. */
function upperBoundByTop(tops: readonly number[], value: number): number {
  let lo = 0;
  let hi = tops.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (tops[mid] <= value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Lane runs at or below this length scan faster than they binary-search. */
const LANE_SCAN_MAX = 8;

/**
 * Overscan floor, in px, on each side of the viewport. Also sets how far the
 * pane may travel before the culling window is recomputed — see `readViewport`.
 */
const MIN_OVERSCAN_PX = 200;

/**
 * Overscan as a fraction of the viewport, per side. The mounted set covers
 * `(1 + 2r)²` viewports of canvas, so the cost of a commit grows with the
 * *square* of this while the distance it buys before the next commit grows
 * only linearly — a full viewport each side (r = 1) mounts 9 viewports' worth
 * to save one viewport of travel. Half is the better trade: 4 viewports
 * mounted, commits roughly twice as cheap, twice as often.
 */
const OVERSCAN_RATIO = 0.5;

/** Overscan for one axis, given that axis's viewport extent. */
const overscanFor = (extent: number) =>
  Math.max(extent * OVERSCAN_RATIO, MIN_OVERSCAN_PX);

/**
 * Lane tops as an arithmetic series, when the stack is uninterrupted enough to
 * have one — see where it's built in the geometry memo.
 */
interface UniformPitch {
  /** Top of lane 0. */
  first: number;
  /** Lane height plus the gap below it. */
  pitch: number;
  /** Lane height alone. */
  height: number;
}

/**
 * Lanes intersecting the vertical window `[min, max]`, as a `[start, end)`
 * range. Uniform geometry inverts the series arithmetically — O(1), no search
 * at all; anything else binary-searches the lane boxes.
 */
function resolveLaneRange(
  min: number,
  max: number,
  uniform: UniformPitch | null,
  tops: readonly number[],
  heights: readonly number[]
): { start: number; end: number } {
  const laneCount = tops.length;
  if (uniform) {
    // Lane i spans [first + i·pitch, first + i·pitch + height].
    const start = Math.ceil(
      (min - uniform.first - uniform.height) / uniform.pitch
    );
    const end = Math.floor((max - uniform.first) / uniform.pitch) + 1;
    return {
      start: Math.max(0, Math.min(start, laneCount)),
      end: Math.max(0, Math.min(end, laneCount))
    };
  }
  return {
    start: lowerBoundByBottom(tops, heights, min),
    end: upperBoundByTop(tops, max)
  };
}

/**
 * First slot in one lane's run of the card index (`[from, to)` of `items`,
 * ascending by x) whose card starts at or past `value`.
 */
function lowerBoundLaneCard(
  cards: readonly { x: number }[],
  items: Int32Array,
  from: number,
  to: number,
  value: number
): number {
  let lo = from;
  let hi = to;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (cards[items[mid]].x < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** A row with its start/end resolved to timestamps. */
interface TimedItem<TData> {
  row: Row<TData>;
  startTime: number;
  /** Null when `endField` is omitted (point marker). */
  endTime: number | null;
}

/** A timed row placed on the time scale. */
interface PositionedItem<TData> extends TimedItem<TData> {
  x: number;
  spanWidth: number;
  /** Null for point cards — the wrapper sizes to its content. */
  renderWidth: number | null;
  /** Width the lane packer and the culling window assume. */
  packWidth: number;
}

/**
 * A positioned row with its lane resolved, ready to render. The lane fields
 * are filled in after packing rather than at construction — see the `cards`
 * memo — so they are mutable and zero until then.
 */
interface LaidOutCard<TData> extends PositionedItem<TData> {
  /** Section-relative — what `renderCard` sees as `context.laneIndex`. */
  laneIndex: number;
  /** Global across sections — indexes `laneTops` and the card index. */
  lane: number;
}

/**
 * One vertical section of the canvas. `group` is the row model's group row
 * (`groupData` entry) when `group_by` is active, null for the implicit
 * single section of an ungrouped timeline.
 */
interface TimelineSection<TData, TItem> {
  key: string;
  group: GroupedData<TData> | null;
  items: TItem[];
}

interface TimelineCardViewProps<TData> {
  row: Row<TData>;
  x: number;
  top: number;
  /** Null for point cards — the wrapper sizes to its content. */
  renderWidth: number | null;
  spanWidth: number;
  collapsed: boolean;
  laneIndex: number;
  startTime: number;
  /** Null when `endField` is omitted (point marker). */
  endTime: number | null;
  renderCard: DataViewTimelineProps<TData>['renderCard'];
  /**
   * False under a fixed lane pitch (virtualized), where nothing consumes the
   * measurement — skipping it drops one ResizeObserver per rendered card.
   */
  measure: boolean;
  /** Reports the wrapper's rendered height so lanes can size to content. */
  onMeasure: (rowId: string, height: number) => void;
  onRowClick?: (row: TData) => void;
  className?: string;
}

/**
 * Memoized positioning wrapper for one card. Isolates `renderCard` from the
 * root's per-frame re-renders (hover cursor, viewport tracking) — a card only
 * re-renders when its own row or geometry changes. All props except `row`,
 * `renderCard`, `onMeasure`, and `onRowClick` are primitives, so the default
 * shallow compare holds as long as those identities are stable across renders.
 */
function TimelineCardViewInner<TData>({
  row,
  x,
  top,
  renderWidth,
  spanWidth,
  collapsed,
  laneIndex,
  startTime,
  endTime,
  renderCard,
  measure,
  onMeasure,
  onRowClick,
  className
}: TimelineCardViewProps<TData>) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const rowId = row.id;

  // Height is content-driven (same contract as `DataView.List` rows):
  // measure after paint and on resize, and report up so the lane layout can
  // replace its `estimatedRowHeight` seed with the real value.
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !measure) return;
    const report = () => onMeasure(rowId, el.offsetHeight);
    report();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, onMeasure, rowId]);

  const context: TimelineCardContext = {
    width: spanWidth,
    collapsed,
    laneIndex,
    start: new Date(startTime),
    end: endTime !== null ? new Date(endTime) : null
  };
  const style: CSSProperties = {
    left: x,
    top,
    ...(renderWidth !== null ? { width: renderWidth } : null)
  };
  return (
    <div
      ref={elementRef}
      role='listitem'
      className={className}
      style={style}
      data-collapsed={collapsed || undefined}
      data-slot='data-view-timeline-card'
      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
    >
      {renderCard(row, context)}
    </div>
  );
}

const TimelineCardView = memo(
  TimelineCardViewInner
) as unknown as typeof TimelineCardViewInner & { displayName?: string };
TimelineCardView.displayName = 'DataView.TimelineCard';

interface ResolvedMarker {
  key: string;
  time: number;
  x: number;
  label: ReactNode;
  variant: 'default' | 'accent' | 'danger';
}

const MARKER_BADGE_VARIANT: Record<
  ResolvedMarker['variant'],
  'accent' | 'danger' | 'neutral'
> = {
  accent: 'accent',
  danger: 'danger',
  default: 'neutral'
};

/** Axis-badge label for the hover cursor, formatted per scale granularity. */
function cursorLabel(time: number, scale: TimelineScale): string {
  const date = dayjs(time);
  switch (scale) {
    case 'day':
    case 'week':
      return date.format('D MMM');
    case 'month':
      return date.format('MMM YYYY');
    case 'quarter':
      return `Q${Math.floor(date.month() / 3) + 1} ${date.format('YYYY')}`;
  }
}

/**
 * Time-positioned card renderer. The Timeline owns the time scale (date → x,
 * span → width), lane packing, the sticky two-tier axis (ticks, month/year
 * bands, today + custom markers, gridlines), and native x/y scrolling. The
 * card interior is entirely consumer-owned via `renderCard` — analogous to how
 * `columns[].cell` owns cell interiors in `DataView.List`.
 */
export function DataViewTimeline<TData>({
  name,
  fields: fieldsOverride,
  'aria-label': ariaLabel,
  startField,
  endField,
  renderCard,
  scale = 'day',
  unitWidth,
  range,
  today = true,
  markers,
  showGridlines = true,
  tickInterval,
  gridlineInterval = 1,
  showCursorLine = true,
  defaultScrollTo = 'today',
  scrollToResults = true,
  onVisibleRangeChange,
  actionsRef,
  lanePacking = 'auto',
  estimatedRowHeight = DEFAULT_ROW_HEIGHT,
  laneGap = DEFAULT_LANE_GAP,
  minCardWidth = DEFAULT_MIN_CARD_WIDTH,
  estimatedPointWidth = DEFAULT_POINT_WIDTH,
  virtualized = false,
  showGroupHeaders = true,
  classNames = {}
}: DataViewTimelineProps<TData>) {
  const {
    table,
    onRowClick,
    activeView,
    registerFieldsForView,
    hasData,
    tableQuery
  } = useDataView<TData>();

  // Register per-view field override so the toolbar's effectiveFields reflects
  // this renderer's metadata while it's the active view.
  useEffect(() => {
    if (!name || !fieldsOverride) return;
    return registerFieldsForView(name, fieldsOverride);
  }, [name, fieldsOverride, registerFieldsForView]);

  // Multi-view gate. When `name` is set, render only when this is the active
  // view. When unset (single-renderer mode), always render.
  const isActive = !name || activeView === undefined || activeView === name;

  // Clamped: a zero/negative width would zero out px density and hang the
  // viewport-fill loop in createTimeScale (see the guard there).
  const effectiveUnitWidth = Math.max(
    1,
    unitWidth ?? TIMELINE_DEFAULT_UNIT_WIDTH[scale]
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Viewport fill — when the domain renders narrower than the scroll
  // container, the domain end extends so the axis/gridlines span the full
  // visible width (see `minWidth` in createTimeScale). Extension only ever
  // widens, so an explicit `range` wider than the container is untouched.
  const [containerWidth, setContainerWidth] = useState(0);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // Re-attach when the renderer mounts its DOM (ref is null while the view
    // is gated or there's no data yet).
  }, [isActive, hasData]);

  // Quantized to whole units so sub-unit resizes (e.g. dragging a panel
  // divider 1px at a time) don't rebuild the scale and re-run layout.
  const fillWidth =
    Math.ceil(containerWidth / effectiveUnitWidth) * effectiveUnitWidth;

  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  // Sections walked out of the row model exactly as `DataView.List` reads it: a
  // row with `subRows` is a group header (its `original` is the `groupData`
  // entry), the leaf rows after it are that group's rows. Section order,
  // labels, and counts therefore match List for free — in client *and* server
  // mode, since the root groups unconditionally. Ungrouped data has no group
  // rows, so the walk yields one implicit section with no band and the
  // geometry below degenerates to the flat single-section layout.
  const sections = useMemo(() => {
    const list: TimelineSection<TData, Row<TData>>[] = [];
    for (const row of rows) {
      if (row.subRows && row.subRows.length > 0) {
        list.push({
          key: row.id,
          group: row.original as GroupedData<TData>,
          items: []
        });
        continue;
      }
      let current = list[list.length - 1];
      if (!current) {
        current = { key: '__ungrouped', group: null, items: [] };
        list.push(current);
      }
      current.items.push(row);
    }
    return list;
  }, [rows]);

  // Resolve each row's start/end timestamps, per section. Rows without a valid
  // start are skipped (one dev warning for the whole model); inverted ranges
  // clamp to zero-length spans.
  const timedSections = useMemo(() => {
    let dropped = 0;
    const list = sections.map(section => {
      const items: TimedItem<TData>[] = [];
      for (const row of section.items) {
        const original = row.original as Record<string, unknown>;
        const startTime = toTimestamp(original?.[startField]);
        if (startTime === null) {
          dropped++;
          continue;
        }
        let endTime: number | null = null;
        if (endField) {
          endTime = toTimestamp(original?.[endField]);
          if (endTime !== null && endTime < startTime) endTime = startTime;
        }
        items.push({ row, startTime, endTime });
      }
      const timed: TimelineSection<TData, TimedItem<TData>> = {
        key: section.key,
        group: section.group,
        items
      };
      return timed;
    });
    if (process.env.NODE_ENV !== 'production' && dropped > 0) {
      console.warn(
        `[DataView.Timeline] Skipped ${dropped} row(s) with a missing or invalid "${startField}" value.`
      );
    }
    return list;
  }, [sections, startField, endField]);

  // Data extent, for the domain below — grouping never changes the time domain.
  // Reduced in place rather than through a flattened copy: the extent is two
  // numbers, and materialising every row again to find them doubled the
  // pipeline's peak allocation for nothing.
  const dataExtent = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const section of timedSections) {
      for (const item of section.items) {
        if (item.startTime < min) min = item.startTime;
        const end = item.endTime ?? item.startTime;
        if (end > max) max = end;
      }
    }
    return { min, max };
  }, [timedSections]);

  const todayTime = useMemo(() => {
    if (today === false) return null;
    if (today === true) {
      // Day precision: aligns the line with its day tick and keeps SSR and
      // client renders consistent (no per-ms Date.now() drift → no hydration
      // mismatch).
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now.getTime();
    }
    return toTimestamp(today);
  }, [today]);

  const markerTimes = useMemo(
    () =>
      (markers ?? [])
        .map(marker => toTimestamp(marker.date))
        .filter((time): time is number => time !== null),
    [markers]
  );

  // Domain: explicit `range` wins; otherwise the extent of data + today +
  // markers. With nothing to show (e.g. initial server load), fall back to a
  // window centered on today so the axis and skeletons still render.
  const domain = useMemo(() => {
    if (range) {
      const a = toTimestamp(range[0]);
      const b = toTimestamp(range[1]);
      if (a !== null && b !== null) {
        return { min: Math.min(a, b), max: Math.max(a, b), explicit: true };
      }
    }
    let { min, max } = dataExtent;
    for (const time of [todayTime ?? Infinity, ...markerTimes]) {
      if (!Number.isFinite(time)) continue;
      min = Math.min(min, time);
      max = Math.max(max, time);
    }
    if (!Number.isFinite(min)) {
      const fallback = new Date();
      fallback.setHours(0, 0, 0, 0);
      const anchor = todayTime ?? fallback.getTime();
      const pad = FALLBACK_DOMAIN_UNITS * TIMELINE_UNIT_MS[scale];
      return { min: anchor - pad, max: anchor + pad, explicit: false };
    }
    return { min, max, explicit: false };
  }, [range, dataExtent, todayTime, markerTimes, scale]);

  const timeScale = useMemo(
    () =>
      createTimeScale({
        minTime: domain.min,
        maxTime: domain.max,
        scale,
        unitWidth: effectiveUnitWidth,
        padUnits: domain.explicit ? 0 : DOMAIN_PAD_UNITS,
        minWidth: fillWidth
      }),
    [domain, scale, effectiveUnitWidth, fillWidth]
  );

  const { ticks, bands } = useMemo(
    () => buildAxis(timeScale, scale, effectiveUnitWidth, tickInterval),
    [timeScale, scale, effectiveUnitWidth, tickInterval]
  );

  // Gridline thinning is visual only — positioning (cards, today, cursor
  // snapping) stays at full `scale`-unit granularity.
  const gridlineEvery = Math.max(1, Math.floor(gridlineInterval));

  // Card geometry, per section. `renderWidth` is null for point markers (no
  // endField) — the wrapper sizes to its content instead of the time span. Rows
  // entirely outside the domain are dropped: with an explicit `range`, fetched
  // data routinely extends past the window (e.g. whole-month API buckets), and
  // those rows must not render beyond the axis or occupy lanes. A section left
  // with no cards is dropped entirely (no band, no empty strip), the same way
  // the ungrouped timeline silently culls out-of-domain rows.
  const positionedSections = useMemo(() => {
    const list: TimelineSection<TData, LaidOutCard<TData>>[] = [];
    for (const section of timedSections) {
      const items: LaidOutCard<TData>[] = [];
      for (const item of section.items) {
        const effectiveEnd = item.endTime ?? item.startTime;
        if (item.startTime > timeScale.t1 || effectiveEnd < timeScale.t0) {
          continue;
        }
        const x = timeScale.x(item.startTime);
        const spanWidth =
          item.endTime !== null
            ? (item.endTime - item.startTime) * timeScale.pxPerMs
            : 0;
        const renderWidth =
          item.endTime !== null ? Math.max(spanWidth, MIN_RENDER_WIDTH) : null;
        // Point cards (no endField) size to their content, so the packer can't
        // know their width — `estimatedPointWidth` stands in for lane packing
        // and culling so wide chips don't overlap within a lane.
        const packWidth = renderWidth ?? estimatedPointWidth;
        // Lane fields are declared here, filled by the `cards` memo once
        // packing has run: one object per card for the whole pipeline, and one
        // hidden class for V8 rather than a reshape halfway through.
        items.push({
          ...item,
          x,
          spanWidth,
          renderWidth,
          packWidth,
          laneIndex: 0,
          lane: 0
        });
      }
      if (items.length === 0) continue;
      list.push({ key: section.key, group: section.group, items });
    }
    return list;
  }, [timedSections, timeScale, estimatedPointWidth]);

  // Lane assignment runs per section, so a card only ever shares a lane with
  // cards in its own group. Section-relative lanes are what `renderCard` sees
  // (`context.laneIndex`); `laneOffset` maps them into one global lane list for
  // the vertical geometry below.
  const { laidOutSections, laneCount } = useMemo(() => {
    let offset = 0;
    const list = positionedSections.map(section => {
      const packed =
        lanePacking === 'one-per-row'
          ? {
              lanes: section.items.map((_, i) => i),
              laneCount: section.items.length
            }
          : packLanes(
              section.items.map(item => ({ x: item.x, width: item.packWidth }))
            );
      const entry = { ...section, ...packed, laneOffset: offset };
      offset += packed.laneCount;
      return entry;
    });
    return { laidOutSections: list, laneCount: offset };
  }, [positionedSections, lanePacking]);

  /**
   * Virtualizing vertically means a card off-screen never mounts and so never
   * measures — leaving lanes to resize under the user as they scroll. Lanes
   * therefore take `estimatedRowHeight` as their exact height while
   * virtualized: geometry stays stable, and cards taller than it overflow
   * their lane rather than growing it.
   */
  const fixedLaneHeight = virtualized;

  // Measured card heights by row id, `estimatedRowHeight` standing in until a
  // card reports (same estimate-then-measure contract as `DataView.List`).
  // Kept in a ref — measurements arrive per card per paint, and a version
  // counter batches them into one lane-geometry recompute. Entries survive
  // virtualization unmounts so scrolling back doesn't shift lanes.
  const measuredHeightsRef = useRef<Map<string, number>>(new Map());
  const [measureVersion, setMeasureVersion] = useState(0);
  const handleCardMeasure = useCallback((rowId: string, height: number) => {
    // 0/negative = not laid out (display:none, jsdom) — keep the estimate.
    if (height <= 0) return;
    const map = measuredHeightsRef.current;
    if (map.get(rowId) === height) return;
    map.set(rowId, height);
    setMeasureVersion(version => version + 1);
  }, []);

  // All sections' cards flattened and sorted ascending by x, which is what
  // lets per-frame culling search for its window instead of scanning every
  // item. Lane semantics (packing order, one-per-row row order) are unaffected
  // — lanes are assigned before the sort.
  //
  // DOM order is chronological, except under vertical culling: that path emits
  // lane by lane, so cards come out grouped by lane and chronological within
  // one. Cards are absolutely positioned, so this is invisible on screen; it
  // only reorders how a screen reader walks the `role="list"`, which
  // virtualization already leaves partial.
  const { cards, maxPackWidth } = useMemo(() => {
    const list: LaidOutCard<TData>[] = [];
    // Lanes are written onto the positioned items rather than spread into new
    // objects: those items are built by `positionedSections` for this pipeline
    // alone and never escape it, and at 50k rows the copy was an extra 50k
    // allocations for two integer fields. Assignment is idempotent, so a
    // recompute that reuses the same `positionedSections` writes the same
    // values back.
    for (const section of laidOutSections) {
      for (let index = 0; index < section.items.length; index++) {
        const item = section.items[index];
        // Section-relative (renderCard's `context.laneIndex`) …
        item.laneIndex = section.lanes[index];
        // … and global, for the lane-top lookup at render time.
        item.lane = section.laneOffset + section.lanes[index];
        list.push(item);
      }
    }
    // Counting sort rather than `Array#sort` — see `orderByX`.
    const order = orderByX(list);
    const sorted = new Array<LaidOutCard<TData>>(list.length);
    // Widest card, folded into this pass: culling widens its left bound by it,
    // because x is ordered and width isn't.
    let widest = 0;
    for (let i = 0; i < order.length; i++) {
      const item = list[order[i]];
      sorted[i] = item;
      if (item.packWidth > widest) widest = item.packWidth;
    }
    return { cards: sorted, maxPackWidth: widest };
  }, [laidOutSections]);

  // Drop measurements for rows that left the data set so a shrunk lane
  // doesn't stay sized to a card that no longer exists. Under a fixed pitch
  // nothing reads the map and cards never report into it, so the whole
  // O(rows) sweep — and the row-id Set it builds — is skipped.
  useEffect(() => {
    if (fixedLaneHeight) return;
    const ids = new Set(cards.map(item => item.row.id));
    const map = measuredHeightsRef.current;
    let changed = false;
    for (const key of map.keys()) {
      if (!ids.has(key)) {
        map.delete(key);
        changed = true;
      }
    }
    if (changed) setMeasureVersion(version => version + 1);
  }, [cards, fixedLaneHeight]);

  // Vertical geometry. Each lane is as tall as its tallest card — measured
  // height when known, `estimatedRowHeight` until then — so lane tops are
  // cumulative rather than a fixed pitch. Sections stack: band, then that
  // section's lanes, then the next section's band. `groupBands` carries each
  // band's slot (top + full section height) for the sticky pin below.
  const {
    laneTops,
    laneHeights,
    uniformPitch,
    groupBands,
    groupBandTops,
    groupBandHeights,
    canvasHeight
  } = useMemo(() => {
    // Reads measuredHeightsRef; measureVersion invalidates on new reports.
    void measureVersion;
    const measured = measuredHeightsRef.current;
    const heights = new Array<number>(laneCount).fill(estimatedRowHeight);
    // Measured lanes only outside virtualization: a culled card never reports
    // a height, so lanes would resize as the user scrolls and shift every lane
    // below them. The fixed pitch also drops this pass from O(cards) to
    // O(lanes) — it stops depending on the measurements entirely.
    if (!fixedLaneHeight) {
      heights.fill(0);
      for (const item of cards) {
        const height = measured.get(item.row.id) ?? estimatedRowHeight;
        if (height > heights[item.lane]) heights[item.lane] = height;
      }
    }
    const tops = new Array<number>(laneCount);
    const bands: {
      key: string;
      group: GroupedData<TData>;
      top: number;
      height: number;
    }[] = [];
    let y = 0;
    for (const section of laidOutSections) {
      const sectionTop = y;
      const banded = showGroupHeaders && section.group !== null;
      if (banded) y += GROUP_BAND_HEIGHT;
      y += laneGap;
      for (let i = 0; i < section.laneCount; i++) {
        const lane = section.laneOffset + i;
        // A lane with no cards (empty data) still reserves the estimate.
        if (heights[lane] === 0) heights[lane] = estimatedRowHeight;
        tops[lane] = y;
        y += heights[lane] + laneGap;
      }
      // Slots are contiguous (each spans its whole section, trailing gap
      // included), so a pinned band is pushed out by the next section's band
      // exactly as that one arrives at the pin line.
      if (banded && section.group) {
        bands.push({
          key: section.key,
          group: section.group,
          top: sectionTop,
          height: y - sectionTop
        });
      }
    }
    // Nothing positioned (all rows culled, or loading with no rows yet): keep
    // reserving one lane's worth of canvas so the pane doesn't collapse.
    if (laneCount === 0) y = estimatedRowHeight + laneGap * 2;
    // Lane tops are an arithmetic series only when nothing interrupts the
    // stack — one section (a second one inserts its own leading gap) and no
    // band above it. That's the shape that scales to thousands of lanes, and
    // it lets vertical culling map a scroll offset straight to a lane index;
    // anything else falls back to a binary search over `tops`.
    const uniform =
      fixedLaneHeight && laneCount > 0 && laidOutSections.length === 1
        ? {
            first: bands.length > 0 ? GROUP_BAND_HEIGHT + laneGap : laneGap,
            pitch: estimatedRowHeight + laneGap,
            height: estimatedRowHeight
          }
        : null;
    return {
      laneTops: tops,
      laneHeights: heights,
      uniformPitch: uniform,
      groupBands: bands,
      // Slot boxes as parallel arrays, so culling them reuses the same box
      // search as the lanes instead of rebuilding these every frame.
      groupBandTops: bands.map(band => band.top),
      groupBandHeights: bands.map(band => band.height),
      canvasHeight: y
    };
  }, [
    cards,
    laidOutSections,
    laneCount,
    estimatedRowHeight,
    fixedLaneHeight,
    laneGap,
    showGroupHeaders,
    measureVersion
  ]);

  /**
   * Cards grouped by lane, in CSR form: `items` holds card indices bucketed by
   * lane, `starts[lane]` to `starts[lane + 1]` delimiting each lane's run. Two
   * counting passes, one flat `Int32Array`, no per-lane array allocation.
   *
   * This is what keeps a frame proportional to what's on screen: culling walks
   * only the lanes the viewport covers and binary-searches the x window inside
   * each, instead of scanning a slice of every card in the time window. Built
   * from the x-ascending `cards`, and the scatter is stable, so each lane's run
   * is x-ascending too. Per-lane `maxPackWidths` narrows the left-overhang
   * allowance to that lane's widest card rather than the whole canvas's.
   */
  const laneIndex = useMemo(() => {
    if (!virtualized || laneCount === 0 || cards.length === 0) return null;
    const starts = new Int32Array(laneCount + 1);
    for (const item of cards) starts[item.lane + 1]++;
    for (let lane = 0; lane < laneCount; lane++) {
      starts[lane + 1] += starts[lane];
    }
    const cursor = Int32Array.from(starts.subarray(0, laneCount));
    const items = new Int32Array(cards.length);
    const maxPackWidths = new Float64Array(laneCount);
    for (let i = 0; i < cards.length; i++) {
      const item = cards[i];
      items[cursor[item.lane]++] = i;
      if (item.packWidth > maxPackWidths[item.lane]) {
        maxPackWidths[item.lane] = item.packWidth;
      }
    }
    return { starts, items, maxPackWidths };
  }, [virtualized, cards, laneCount]);

  const resolvedMarkers = useMemo(() => {
    const list: ResolvedMarker[] = [];
    if (
      todayTime !== null &&
      todayTime >= timeScale.t0 &&
      todayTime <= timeScale.t1
    ) {
      list.push({
        key: '__today',
        time: todayTime,
        x: timeScale.x(todayTime),
        label: dayjs(todayTime).format('D MMM'),
        variant: 'accent'
      });
    }
    markers?.forEach((marker, index) => {
      const time = toTimestamp(marker.date);
      if (time === null || time < timeScale.t0 || time > timeScale.t1) return;
      list.push({
        key: `__marker-${index}`,
        time,
        x: timeScale.x(time),
        label: marker.label ?? dayjs(time).format('D MMM'),
        variant: marker.variant ?? 'default'
      });
    });
    return list;
  }, [todayTime, markers, timeScale]);

  // Viewport tracking — drives horizontal culling (`virtualized`) and
  // `onVisibleRangeChange`. rAF-throttled so the state update runs at most
  // once per frame regardless of scroll event rate.
  const needsViewport = virtualized || Boolean(onVisibleRangeChange);
  const [viewport, setViewport] = useState<{
    left: number;
    width: number;
    top: number;
    height: number;
  } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  /**
   * The pane's live client box, unquantized. `viewport` state lags it on
   * purpose (see below); anything needing the true offset — the visible-range
   * callback — reads this instead.
   */
  const viewportRef = useRef<{
    left: number;
    width: number;
    top: number;
    height: number;
  } | null>(null);

  const readViewport = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    viewportRef.current = {
      left: el.scrollLeft,
      width: el.clientWidth,
      top: el.scrollTop,
      height: el.clientHeight
    };
    setViewport(prev => {
      const next = viewportRef.current!;
      if (!prev) return next;
      // A resize invalidates the window outright.
      if (prev.width !== next.width || prev.height !== next.height) return next;
      // Otherwise hold the last window until the pane has travelled half its
      // overscan. Scrolling is compositor work the browser does for free;
      // committing state on every pixel drags React into all 60 frames a
      // second to rebuild a slice that is nearly always identical. Overscan is
      // a full viewport on each side, so half of it is spare coverage: the
      // rendered set still spans the visible window with an overscan/2 margin
      // at the moment of the next commit.
      const slackX = overscanFor(prev.width) / 2;
      const slackY = overscanFor(prev.height) / 2;
      if (
        Math.abs(prev.left - next.left) < slackX &&
        Math.abs(prev.top - next.top) < slackY
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  // Hover cursor — a crosshair line snapped to the sub-interval (tick unit)
  // under the pointer, with a date badge pinned to the axis. Updates are
  // rAF-throttled and recomputed on scroll too (the content moves under a
  // stationary pointer).
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const pointerXRef = useRef<number | null>(null);
  const cursorRafRef = useRef<number | null>(null);

  const updateCursorFromPointer = useCallback(() => {
    if (!showCursorLine) return;
    const el = scrollRef.current;
    const pointerX = pointerXRef.current;
    if (!el || pointerX === null) return;
    const rect = el.getBoundingClientRect();
    const canvasX = pointerX - rect.left + el.scrollLeft;
    const time = Math.max(
      timeScale.t0,
      Math.min(timeScale.timeAt(canvasX), timeScale.t1)
    );
    const snapped = startOfUnit(dayjs(time), scale).valueOf();
    setCursorTime(prev => (prev === snapped ? prev : snapped));
  }, [showCursorLine, timeScale, scale]);

  const handlePointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!showCursorLine) return;
      pointerXRef.current = event.clientX;
      if (cursorRafRef.current !== null) return;
      cursorRafRef.current = requestAnimationFrame(() => {
        cursorRafRef.current = null;
        updateCursorFromPointer();
      });
    },
    [showCursorLine, updateCursorFromPointer]
  );

  const handlePointerLeave = useCallback(() => {
    pointerXRef.current = null;
    if (cursorRafRef.current !== null) {
      cancelAnimationFrame(cursorRafRef.current);
      cursorRafRef.current = null;
    }
    setCursorTime(null);
  }, []);

  // Drag-to-pan — press the background and drag to scroll both axes. Mouse
  // only: touch already pans via native scrolling, and starting only on the
  // background keeps cards (row click) and footer controls interactive.
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    lastX: number;
    lastY: number;
    lastTime: number;
    vx: number;
    vy: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Post-release glide — the pan carries its release velocity and decays
  // exponentially instead of stopping dead. Any new interaction cancels it.
  const momentumRafRef = useRef<number | null>(null);

  const stopMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(
    (initialVx: number, initialVy: number) => {
      stopMomentum();
      let vx = initialVx;
      let vy = initialVy;
      let prevTime = performance.now();
      const step = (now: number) => {
        momentumRafRef.current = null;
        const el = scrollRef.current;
        if (!el) return;
        const dt = Math.max(0, now - prevTime);
        prevTime = now;
        if (dt > 0) {
          const beforeLeft = el.scrollLeft;
          const beforeTop = el.scrollTop;
          el.scrollLeft = beforeLeft + vx * dt;
          el.scrollTop = beforeTop + vy * dt;
          // Hitting a scroll bound kills that axis so the glide ends there
          // instead of burning frames against the edge.
          if (el.scrollLeft === beforeLeft) vx = 0;
          if (el.scrollTop === beforeTop) vy = 0;
          const decay = Math.exp(-dt / MOMENTUM_DECAY_TAU);
          vx *= decay;
          vy *= decay;
        }
        if (Math.hypot(vx, vy) >= MOMENTUM_MIN_SPEED) {
          momentumRafRef.current = requestAnimationFrame(step);
        }
      };
      momentumRafRef.current = requestAnimationFrame(step);
    },
    [stopMomentum]
  );

  const handleDragPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Any press grabs the content — even ones that don't start a pan.
      stopMomentum();
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const el = scrollRef.current;
      if (!el) return;
      const target = event.target as Element;
      if (
        target.closest(
          '[role="listitem"], a, button, input, textarea, select, [contenteditable]'
        )
      ) {
        return;
      }
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
        lastX: event.clientX,
        lastY: event.clientY,
        lastTime: performance.now(),
        vx: 0,
        vy: 0
      };
      // Capture so the pan keeps tracking when the pointer leaves the pane.
      // Throws for pointers the browser isn't tracking (synthetic events).
      try {
        el.setPointerCapture?.(event.pointerId);
      } catch {
        /* noop */
      }
      // Panning, not selecting — suppress native text-selection drag.
      event.preventDefault();
    },
    [stopMomentum]
  );

  const handleDragPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const el = scrollRef.current;
      if (!drag || !el || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      el.scrollLeft = drag.scrollLeft - dx;
      el.scrollTop = drag.scrollTop - dy;
      // Release velocity, EMA-smoothed over a ~50ms window so one noisy
      // inter-event gap doesn't set the fling speed.
      const now = performance.now();
      const dt = now - drag.lastTime;
      if (dt > 0) {
        const mix = Math.min(1, dt / 50);
        drag.vx += ((event.clientX - drag.lastX) / dt - drag.vx) * mix;
        drag.vy += ((event.clientY - drag.lastY) / dt - drag.vy) * mix;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.lastTime = now;
      }
      // Small threshold so a plain background click never flashes the
      // grabbing cursor.
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) setIsDragging(true);
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragRef.current = null;
      setIsDragging(false);
      // Fling: glide only when released mid-motion, not after holding still.
      if (performance.now() - drag.lastTime > MOMENTUM_STALE_MS) return;
      const vx = clampSpeed(drag.vx);
      const vy = clampSpeed(drag.vy);
      if (Math.hypot(vx, vy) < MOMENTUM_MIN_SPEED) return;
      // Content scrolls opposite to the pointer's travel.
      startMomentum(-vx, -vy);
    },
    [startMomentum]
  );

  // Last known scroll offsets — stashed on every scroll (and on programmatic
  // scrolls) so the position survives the DOM being unmounted while hidden
  // (inactive view / no data) and restored on re-activation, instead of the
  // recreated DOM stranding the user at scroll 0 (the domain start).
  const savedScrollRef = useRef<{ left: number; top: number } | null>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      savedScrollRef.current = { left: el.scrollLeft, top: el.scrollTop };
    }
    if (!needsViewport && !showCursorLine) return;
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (needsViewport) {
        readViewport();
        notifyRef.current();
      }
      updateCursorFromPointer();
    });
  }, [needsViewport, showCursorLine, readViewport, updateCursorFromPointer]);

  useEffect(
    () => () => {
      for (const ref of [rafIdRef, cursorRafRef, momentumRafRef]) {
        if (ref.current !== null) {
          cancelAnimationFrame(ref.current);
          ref.current = null;
        }
      }
    },
    []
  );

  // Layout effect, not a passive one: culling with no viewport yet falls back
  // to rendering every card, so reading it after paint would flash the whole
  // canvas into the DOM on mount before the first cull.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `hasData` re-runs the attempt when the renderer (re)mounts its DOM (the ref is null while hidden).
  useLayoutEffect(() => {
    if (!needsViewport || !isActive) return;
    readViewport();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      readViewport();
      // A resize changes the visible window even with the scroll offset fixed.
      notifyRef.current();
    });
    observer.observe(el);
    return () => observer.disconnect();
    // `hasData` re-runs the attempt when the renderer mounts its DOM.
  }, [needsViewport, isActive, hasData, readViewport]);

  // Reads the *measured* offset, not the quantized `viewport` state: culling
  // can coast on a stale window because it overscans, but a consumer fetching
  // by visible range cannot — it would be handed a window the user scrolled
  // past. Running off the ref also keeps this off React's critical path
  // entirely: a timeline with only `onVisibleRangeChange` set now re-renders
  // on nothing at all while scrolling.
  //
  // Deduped within one pixel of time — `timeScale` identity churn (a resize, a
  // domain rebuild from streamed-in rows) must not re-fire consumers with an
  // unchanged window; each fire typically triggers a fetch check. Exact
  // equality is too strict for "unchanged": the px→time→px round-trip of
  // scroll anchoring isn't bit-exact in floats, and browsers quantize an
  // anchored scrollLeft to device pixels — either can drift the recomputed
  // edges without the window visibly moving. Anything under one pixel's worth
  // of time is that noise, not a scroll (the baseline is the last *notified*
  // window, so slow sub-pixel scrolling still accumulates past the threshold
  // and fires).
  const lastNotifiedRangeRef = useRef<{ from: number; to: number } | null>(
    null
  );
  const notifyVisibleRange = useCallback(() => {
    const measured = viewportRef.current;
    if (!onVisibleRangeChange || !measured) return;
    const from = timeScale.timeAt(measured.left);
    const to = timeScale.timeAt(measured.left + measured.width);
    const prev = lastNotifiedRangeRef.current;
    const pxOfTime = 1 / timeScale.pxPerMs;
    if (
      prev &&
      Math.abs(prev.from - from) < pxOfTime &&
      Math.abs(prev.to - to) < pxOfTime
    ) {
      return;
    }
    lastNotifiedRangeRef.current = { from, to };
    onVisibleRangeChange([new Date(from), new Date(to)]);
  }, [onVisibleRangeChange, timeScale]);

  // Scroll handlers close over this rather than the callback itself, so a new
  // `timeScale` or consumer function doesn't have to re-attach them.
  const notifyRef = useRef(notifyVisibleRange);
  useEffect(() => {
    notifyRef.current = notifyVisibleRange;
    // Mount and domain changes notify from here; scrolling calls the ref.
    notifyVisibleRange();
  }, [notifyVisibleRange]);

  // Time-target resolution shared by `defaultScrollTo` and the imperative
  // handle. 'today' resolves to the today-line when shown, else the actual
  // current date — both get clamped into the domain by `scrollToTime`.
  const resolveScrollTarget = useCallback(
    (target: NonNullable<DataViewTimelineProps<TData>['defaultScrollTo']>) => {
      if (target === 'start') return timeScale.t0;
      if (target === 'end') return timeScale.t1;
      if (target === 'today') {
        if (todayTime !== null) return todayTime;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now.getTime();
      }
      return toTimestamp(target);
    },
    [timeScale, todayTime]
  );

  // Programmatic scroll — clamps the target into the domain, aligns it in the
  // viewport, and cancels any in-flight momentum glide. Direct scrollLeft
  // assignment for 'auto' keeps jsdom (no Element.scrollTo) working.
  const scrollToTime = useCallback(
    (
      time: number,
      align: 'start' | 'center' | 'end',
      behavior: 'auto' | 'smooth'
    ) => {
      const el = scrollRef.current;
      if (!el) return;
      stopMomentum();
      const clamped = Math.max(timeScale.t0, Math.min(time, timeScale.t1));
      let targetX = timeScale.x(clamped);
      if (align === 'start') targetX -= SCROLL_EDGE_INSET_PX;
      else if (align === 'center') targetX -= el.clientWidth / 2;
      else if (align === 'end')
        targetX -= el.clientWidth - SCROLL_EDGE_INSET_PX;
      const left = Math.max(
        0,
        Math.min(targetX, timeScale.totalWidth - el.clientWidth)
      );
      // Stash eagerly — programmatic scrolls must survive a view switch even
      // when no scroll event follows (e.g. the target equals the current
      // position, or jsdom).
      savedScrollRef.current = { left, top: el.scrollTop };
      if (behavior === 'smooth' && typeof el.scrollTo === 'function') {
        el.scrollTo({ left, behavior: 'smooth' });
      } else {
        el.scrollLeft = left;
      }
    },
    [timeScale, stopMomentum]
  );

  // Filter/search-driven auto-scroll (`scrollToResults`). Applying a filter
  // while scrolled away from the matches would leave the user parked on empty
  // canvas — when the query changes and no matching card intersects the
  // viewport, bring the earliest match into view. A query change that keeps a
  // card on screen doesn't move the view. Compared by value: `tableQuery`
  // identity churns on unrelated updates (sort, grouping); the ref seeds with
  // the mount-time key so the initial position stays `defaultScrollTo`'s job.
  // Memoized on the two inputs it serializes: this ran on every render, and
  // scrolling now renders whenever the culling window commits.
  const queryKey = useMemo(
    () =>
      JSON.stringify({
        filters: tableQuery?.filters ?? null,
        search: tableQuery?.search ?? null
      }),
    [tableQuery?.filters, tableQuery?.search]
  );
  const lastQueryKeyRef = useRef(queryKey);
  useEffect(() => {
    if (queryKey === lastQueryKeyRef.current) return;
    lastQueryKeyRef.current = queryKey;
    if (!scrollToResults) return;
    const el = scrollRef.current;
    if (!el || cards.length === 0) return;
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    const anyInView = cards.some(
      item => item.x <= right && item.x + item.packWidth >= left
    );
    if (anyInView) return;
    // `cards` is sorted ascending by x, so [0] is the earliest match.
    scrollToTime(cards[0].startTime, 'start', 'smooth');
  }, [queryKey, scrollToResults, cards, scrollToTime]);

  useImperativeHandle(
    actionsRef,
    (): TimelineActions => ({
      scrollTo: (target, options) => {
        if (!scrollRef.current) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[DataView.Timeline] scrollTo() ignored — the timeline is not rendered (inactive view or no data).'
            );
          }
          return;
        }
        const time = resolveScrollTarget(target);
        if (time === null) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `[DataView.Timeline] scrollTo() received an invalid date: ${String(target)}`
            );
          }
          return;
        }
        scrollToTime(
          time,
          options?.align ?? 'center',
          options?.behavior ?? 'smooth'
        );
      },
      getVisibleRange: () => {
        const el = scrollRef.current;
        if (!el) return null;
        return [
          new Date(timeScale.timeAt(el.scrollLeft)),
          new Date(timeScale.timeAt(el.scrollLeft + el.clientWidth))
        ];
      }
    }),
    [resolveScrollTarget, scrollToTime, timeScale]
  );

  // Initial scroll position — runs when the renderer (re)mounts its DOM. The
  // first activation applies `defaultScrollTo`; re-activations restore the
  // stashed position, because the recreated scroll container starts back at
  // (0, 0) — without the restore a returning user would land at the domain
  // start instead of where they left off.
  const didInitScrollRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `isActive`/`hasData` re-run the attempt when the renderer (re)mounts its DOM (the ref is null while hidden).
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      // Hidden (inactive view or no data): the DOM is gone — arm the next
      // activation to restore or re-init.
      didInitScrollRef.current = false;
      return;
    }
    if (didInitScrollRef.current) return;
    didInitScrollRef.current = true;
    const saved = savedScrollRef.current;
    if (saved) {
      el.scrollLeft = saved.left;
      el.scrollTop = saved.top;
    } else {
      const time = resolveScrollTarget(defaultScrollTo) ?? timeScale.t0;
      const align =
        defaultScrollTo === 'start'
          ? 'start'
          : defaultScrollTo === 'end'
            ? 'end'
            : 'center';
      scrollToTime(time, align, 'auto');
    }
    // This effect runs after the viewport-tracking one, so the offset it just
    // set is newer than the tracked viewport. Re-read before paint, otherwise
    // the first frame culls against scroll 0 (the domain start) and renders a
    // window the user is not looking at.
    readViewport();
  }, [
    defaultScrollTo,
    resolveScrollTarget,
    scrollToTime,
    readViewport,
    timeScale,
    isActive,
    hasData
  ]);

  // Scroll anchoring — when the time domain shifts (rows prepended by
  // range-window fetching, `range` extended, zoom change), keep the time under
  // the viewport's left edge stable instead of letting content jump.
  const scrollAnchorRef = useRef<{ t0: number; pxPerMs: number } | null>(null);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const prev = scrollAnchorRef.current;
    if (
      el &&
      prev &&
      (prev.t0 !== timeScale.t0 || prev.pxPerMs !== timeScale.pxPerMs)
    ) {
      const leftEdgeTime = prev.t0 + el.scrollLeft / prev.pxPerMs;
      el.scrollLeft = Math.max(0, timeScale.x(leftEdgeTime));
      // Anchoring moved the content under the culling window — resync it in
      // the same layout pass rather than a frame later.
      readViewport();
    }
    scrollAnchorRef.current = {
      t0: timeScale.t0,
      pxPerMs: timeScale.pxPerMs
    };
  }, [timeScale, readViewport]);

  if (!isActive) return null;
  // Render nothing when there's truly no data and no loading — sibling
  // `<DataView.EmptyState>` / `<DataView.ZeroState>` handle messaging.
  if (!hasData) return null;

  // Horizontal culling window — one extra viewport on each side as overscan.
  const overscan = viewport ? overscanFor(viewport.width) : 0;
  const cullRange =
    virtualized && viewport
      ? {
          min: viewport.left - overscan,
          max: viewport.left + viewport.width + overscan
        }
      : null;
  // Vertical window, same overscan rule. Only when the pane reports a height:
  // an unmeasured container (jsdom, SSR) would otherwise cull to a sliver of
  // lanes, so it keeps the horizontal-only behaviour instead.
  const verticalOverscan = viewport ? overscanFor(viewport.height) : 0;
  const verticalRange =
    cullRange && viewport && viewport.height > 0
      ? {
          min: viewport.top - verticalOverscan,
          max: viewport.top + viewport.height + verticalOverscan
        }
      : null;
  const laneRange =
    verticalRange && laneIndex
      ? resolveLaneRange(
          verticalRange.min,
          verticalRange.max,
          uniformPitch,
          laneTops,
          laneHeights
        )
      : null;

  // Visible cards. Two paths, both O(what's rendered) rather than O(cards):
  //
  // - With a lane range, walk only the lanes the viewport covers and binary
  //   search the x window inside each lane's run of the index. Visible lanes
  //   are bounded by the pane's height over the lane pitch (~10-20), so this
  //   stays flat no matter how many lanes exist below.
  // - Without one (unmeasured height), the old global slice over the
  //   x-ascending `cards`.
  //
  // Both widen the left bound by the widest card — x is ordered, width isn't —
  // so every candidate still gets an exact right-edge check.
  let cardSlice: LaidOutCard<TData>[];
  if (cullRange && laneRange && laneIndex) {
    const { starts, items, maxPackWidths } = laneIndex;
    const visible: LaidOutCard<TData>[] = [];
    for (let lane = laneRange.start; lane < laneRange.end; lane++) {
      const from = starts[lane];
      const to = starts[lane + 1];
      if (from === to) continue;
      const left = cullRange.min - maxPackWidths[lane];
      // A short run (`one-per-row` gives every lane exactly one card) scans
      // faster than it searches.
      let i =
        to - from > LANE_SCAN_MAX
          ? lowerBoundLaneCard(cards, items, from, to, left)
          : from;
      for (; i < to; i++) {
        const item = cards[items[i]];
        if (item.x > cullRange.max) break;
        if (item.x + item.packWidth < cullRange.min) continue;
        visible.push(item);
      }
    }
    cardSlice = visible;
  } else if (cullRange) {
    cardSlice = cards.slice(
      lowerBoundByX(cards, cullRange.min - maxPackWidth),
      upperBoundByX(cards, cullRange.max)
    );
  } else {
    cardSlice = cards;
  }
  // Axis chrome, culled to the same window as the cards. A year at day scale
  // is ~180 tick labels and 12 bands; a decade is ten times that, all of it
  // mounted for a viewport showing a few weeks.
  const visibleTicks = cullRange
    ? ticks.slice(
        lowerBoundByX(ticks, cullRange.min),
        upperBoundByX(ticks, cullRange.max)
      )
    : ticks;
  // Bands tile the domain edge to edge, so the one straddling the left bound
  // starts before it — step back one from the first band past the bound rather
  // than widening by a max width the way the cards do.
  const visibleBands = cullRange
    ? bands.slice(
        Math.max(0, upperBoundByX(bands, cullRange.min) - 1),
        upperBoundByX(bands, cullRange.max)
      )
    : bands;
  // Markers are consumer-supplied and usually few, so a scan beats a search.
  const visibleMarkers = cullRange
    ? resolvedMarkers.filter(
        marker => marker.x >= cullRange.min && marker.x <= cullRange.max
      )
    : resolvedMarkers;
  // Group slots stack the same way lanes do — ascending, contiguous, each
  // spanning its whole section — so the vertical window slices them directly.
  // The section under the pin line always intersects the window, which is what
  // keeps its sticky band pinned.
  const visibleGroupBands = verticalRange
    ? groupBands.slice(
        lowerBoundByBottom(groupBandTops, groupBandHeights, verticalRange.min),
        upperBoundByTop(groupBandTops, verticalRange.max)
      )
    : groupBands;
  const cardClassName = cx(
    styles.timelineCard,
    onRowClick && styles.clickable,
    classNames.card
  );

  return (
    <div
      ref={scrollRef}
      // Keyboard access to the pan surface: focusable so arrow/page keys
      // scroll natively (drag-to-pan is pointer-only), and a labelled region
      // so screen readers announce what the scrollable area is.
      role='region'
      aria-label={ariaLabel ?? 'Timeline'}
      tabIndex={0}
      className={cx(styles.timelineRoot, classNames.root)}
      data-dragging={isDragging || undefined}
      data-slot='data-view-timeline'
      onScroll={handleScroll}
      onMouseMove={showCursorLine ? handlePointerMove : undefined}
      onMouseLeave={showCursorLine ? handlePointerLeave : undefined}
      onPointerDown={handleDragPointerDown}
      onPointerMove={handleDragPointerMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      onLostPointerCapture={handleDragEnd}
      onWheel={stopMomentum}
    >
      <div
        className={cx(styles.timelineAxis, classNames.axis)}
        style={{ width: timeScale.totalWidth }}
        data-slot='data-view-timeline-axis'
      >
        {visibleBands.map(band => (
          <div
            key={band.time}
            className={cx(styles.timelineAxisBand, classNames.band)}
            style={{ left: band.x, width: band.width }}
            data-slot='data-view-timeline-axis-band'
          >
            {/* Sticky-left so the label stays visible while its band spans the viewport. */}
            <span
              className={styles.timelineAxisBandLabel}
              data-slot='data-view-timeline-axis-band-label'
            >
              {band.label}
            </span>
          </div>
        ))}
        {visibleTicks.map(tick =>
          tick.showLabel ? (
            <div
              key={tick.time}
              className={cx(styles.timelineAxisTick, classNames.tick)}
              style={{ left: tick.x }}
              data-slot='data-view-timeline-axis-tick'
            >
              {tick.label}
            </div>
          ) : null
        )}
        {visibleMarkers.map(marker => (
          <div
            key={marker.key}
            className={styles.timelineAxisMarker}
            style={{ left: marker.x }}
            data-slot='data-view-timeline-axis-marker'
          >
            <Badge size='micro' variant={MARKER_BADGE_VARIANT[marker.variant]}>
              {marker.label}
            </Badge>
          </div>
        ))}
        {cursorTime !== null ? (
          <div
            aria-hidden='true'
            className={styles.timelineAxisCursor}
            style={{ left: timeScale.x(cursorTime) }}
            data-slot='data-view-timeline-axis-cursor'
          >
            <Badge size='micro' variant='neutral'>
              {cursorLabel(cursorTime, scale)}
            </Badge>
          </div>
        ) : null}
      </div>

      {/* Group section bands. Kept outside the canvas for two reasons: the
          canvas is `role="list"` (only cards belong in it), and its
          `overflow: hidden` would neutralize the sticky positioning below.
          The layer is absolute inside the scroll container, so it scrolls with
          the content while each band sticks vertically within its own section
          slot — pinned under the axis, pushed out by the next section's band. */}
      {groupBands.length > 0 ? (
        <div
          className={styles.timelineGroupLayer}
          style={{ width: timeScale.totalWidth, height: canvasHeight }}
          data-slot='data-view-timeline-group-layer'
        >
          {visibleGroupBands.map(band => (
            <div
              key={band.key}
              className={styles.timelineGroupSlot}
              style={{ top: band.top, height: band.height }}
              data-slot='data-view-timeline-group-slot'
            >
              <div
                className={cx(
                  styles.timelineGroupHeader,
                  classNames.groupHeader
                )}
                style={{ height: GROUP_BAND_HEIGHT }}
                data-slot='data-view-timeline-group-header'
              >
                {/* Sticky-left so the label stays readable while panning. */}
                <span
                  className={styles.timelineGroupHeaderLabel}
                  data-slot='data-view-timeline-group-header-label'
                >
                  {band.group.label}
                  {band.group.showGroupCount ? (
                    <Badge variant='neutral'>{band.group.count}</Badge>
                  ) : null}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div
        role='list'
        className={cx(styles.timelineCanvas, classNames.canvas)}
        style={{ width: timeScale.totalWidth, height: canvasHeight }}
        data-slot='data-view-timeline-canvas'
      >
        {showGridlines
          ? visibleTicks.map(tick =>
              tick.index % gridlineEvery === 0 ? (
                <div
                  key={tick.time}
                  aria-hidden='true'
                  className={cx(styles.timelineGridline, classNames.gridline)}
                  style={{ left: tick.x }}
                  data-slot='data-view-timeline-gridline'
                />
              ) : null
            )
          : null}
        {visibleMarkers.map(marker => (
          <div
            key={marker.key}
            aria-hidden='true'
            className={cx(styles.timelineMarkerLine, classNames.marker)}
            data-variant={marker.variant}
            style={{ left: marker.x }}
            data-slot='data-view-timeline-marker'
          />
        ))}
        {cursorTime !== null ? (
          <div
            aria-hidden='true'
            className={cx(styles.timelineCursorLine, classNames.cursor)}
            style={{ left: timeScale.x(cursorTime) }}
            data-slot='data-view-timeline-cursor'
          />
        ) : null}
        {cardSlice.map(item => {
          // Right-edge check for the widened left bound of the slice.
          if (cullRange && item.x + item.packWidth < cullRange.min) {
            return null;
          }
          return (
            <TimelineCardView
              key={item.row.id}
              row={item.row}
              x={item.x}
              top={laneTops[item.lane]}
              renderWidth={item.renderWidth}
              spanWidth={item.spanWidth}
              collapsed={item.endTime !== null && item.spanWidth < minCardWidth}
              laneIndex={item.laneIndex}
              startTime={item.startTime}
              endTime={item.endTime}
              renderCard={renderCard}
              measure={!fixedLaneHeight}
              onMeasure={handleCardMeasure}
              onRowClick={onRowClick}
              className={cardClassName}
            />
          );
        })}
      </div>

      {/* Sticky-left so the footer stays viewport-aligned under horizontal scroll. */}
      <div
        className={styles.timelineFooter}
        data-slot='data-view-timeline-footer'
      >
        <FilterSummary />
      </div>
    </div>
  );
}

DataViewTimeline.displayName = 'DataView.Timeline';
