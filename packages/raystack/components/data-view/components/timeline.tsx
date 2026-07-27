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

/** First index in `list` (ascending by `x`) with `x >= value`. */
function lowerBoundByX(list: readonly { x: number }[], value: number): number {
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
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
    const mid = (lo + hi) >> 1;
    if (list[mid].x <= value) lo = mid + 1;
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
    if (!el) return;
    const report = () => onMeasure(rowId, el.offsetHeight);
    report();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onMeasure, rowId]);

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

  // Flattened for the domain extent — grouping never changes the time domain.
  const timedItems = useMemo(
    () => timedSections.flatMap(section => section.items),
    [timedSections]
  );

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
    let min = Infinity;
    let max = -Infinity;
    for (const item of timedItems) {
      min = Math.min(min, item.startTime);
      max = Math.max(max, item.endTime ?? item.startTime);
    }
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
  }, [range, timedItems, todayTime, markerTimes, scale]);

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
    const list: TimelineSection<TData, PositionedItem<TData>>[] = [];
    for (const section of timedSections) {
      const items: PositionedItem<TData>[] = [];
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
        items.push({ ...item, x, spanWidth, renderWidth, packWidth });
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

  // All sections' cards flattened and sorted ascending by x so per-frame
  // culling can binary-search the visible slice instead of scanning every item.
  // Lane semantics (packing order, one-per-row row order) are unaffected —
  // lanes are assigned before the sort. DOM order becomes chronological.
  const cards = useMemo(() => {
    const list = laidOutSections.flatMap(section =>
      section.items.map((item, index) => ({
        ...item,
        // Section-relative (renderCard's `context.laneIndex`) …
        laneIndex: section.lanes[index],
        // … and global, for the lane-top lookup at render time.
        lane: section.laneOffset + section.lanes[index]
      }))
    );
    list.sort((a, b) => a.x - b.x);
    return list;
  }, [laidOutSections]);

  // Drop measurements for rows that left the data set so a shrunk lane
  // doesn't stay sized to a card that no longer exists.
  useEffect(() => {
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
  }, [cards]);

  // Vertical geometry. Each lane is as tall as its tallest card — measured
  // height when known, `estimatedRowHeight` until then — so lane tops are
  // cumulative rather than a fixed pitch. Sections stack: band, then that
  // section's lanes, then the next section's band. `groupBands` carries each
  // band's slot (top + full section height) for the sticky pin below.
  const { laneTops, groupBands, canvasHeight } = useMemo(() => {
    // Reads measuredHeightsRef; measureVersion invalidates on new reports.
    void measureVersion;
    const measured = measuredHeightsRef.current;
    const heights = new Array<number>(laneCount).fill(0);
    for (const item of cards) {
      const height = measured.get(item.row.id) ?? estimatedRowHeight;
      if (height > heights[item.lane]) heights[item.lane] = height;
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
    return { laneTops: tops, groupBands: bands, canvasHeight: y };
  }, [
    cards,
    laidOutSections,
    laneCount,
    estimatedRowHeight,
    laneGap,
    showGroupHeaders,
    measureVersion
  ]);

  // Widens the culling window's left bound: a card is visible when
  // `x + width >= min`, and width isn't sorted — only x is.
  const maxPackWidth = useMemo(
    () => cards.reduce((max, item) => Math.max(max, item.packWidth), 0),
    [cards]
  );

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
  } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const readViewport = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setViewport(prev => {
      const next = { left: el.scrollLeft, width: el.clientWidth };
      if (prev && prev.left === next.left && prev.width === next.width) {
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
      if (needsViewport) readViewport();
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

  useEffect(() => {
    if (!needsViewport || !isActive) return;
    readViewport();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(readViewport);
    observer.observe(el);
    return () => observer.disconnect();
  }, [needsViewport, isActive, readViewport]);

  // Deduped within one pixel of time — `timeScale`/`viewport` identity churn
  // (a resize, a domain rebuild from streamed-in rows) must not re-fire
  // consumers with an unchanged window; each fire typically triggers a fetch
  // check. Exact equality is too strict for "unchanged": the px→time→px
  // round-trip of scroll anchoring isn't bit-exact in floats, and browsers
  // quantize an anchored scrollLeft to device pixels — either can drift the
  // recomputed edges without the window visibly moving. Anything under one
  // pixel's worth of time is that noise, not a scroll (the baseline is the
  // last *notified* window, so slow sub-pixel scrolling still accumulates
  // past the threshold and fires).
  const lastNotifiedRangeRef = useRef<{ from: number; to: number } | null>(
    null
  );
  useEffect(() => {
    if (!onVisibleRangeChange || !viewport) return;
    const from = timeScale.timeAt(viewport.left);
    const to = timeScale.timeAt(viewport.left + viewport.width);
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
  }, [onVisibleRangeChange, viewport, timeScale]);

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
  const queryKey = JSON.stringify({
    filters: tableQuery?.filters ?? null,
    search: tableQuery?.search ?? null
  });
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
      return;
    }
    const time = resolveScrollTarget(defaultScrollTo) ?? timeScale.t0;
    const align =
      defaultScrollTo === 'start'
        ? 'start'
        : defaultScrollTo === 'end'
          ? 'end'
          : 'center';
    scrollToTime(time, align, 'auto');
  }, [
    defaultScrollTo,
    resolveScrollTarget,
    scrollToTime,
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
    }
    scrollAnchorRef.current = {
      t0: timeScale.t0,
      pxPerMs: timeScale.pxPerMs
    };
  }, [timeScale]);

  if (!isActive) return null;
  // Render nothing when there's truly no data and no loading — sibling
  // `<DataView.EmptyState>` / `<DataView.ZeroState>` handle messaging.
  if (!hasData) return null;

  // Horizontal culling window — one extra viewport on each side as overscan.
  const overscan = viewport ? Math.max(viewport.width, 400) : 0;
  const cullRange =
    virtualized && viewport
      ? {
          min: viewport.left - overscan,
          max: viewport.left + viewport.width + overscan
        }
      : null;
  // Visible slices via binary search — both lists are sorted ascending by x,
  // so per-frame culling costs O(log n + visible) instead of scanning every
  // item. The card slice widens its left bound by the widest card (x is
  // sorted, width isn't), so each sliced card still gets a right-edge check.
  const cardSlice = cullRange
    ? cards.slice(
        lowerBoundByX(cards, cullRange.min - maxPackWidth),
        upperBoundByX(cards, cullRange.max)
      )
    : cards;
  const gridTicks = cullRange
    ? ticks.slice(
        lowerBoundByX(ticks, cullRange.min),
        upperBoundByX(ticks, cullRange.max)
      )
    : ticks;
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
      >
        {bands.map(band => (
          <div
            key={band.time}
            className={cx(styles.timelineAxisBand, classNames.band)}
            style={{ left: band.x, width: band.width }}
          >
            {/* Sticky-left so the label stays visible while its band spans the viewport. */}
            <span className={styles.timelineAxisBandLabel}>{band.label}</span>
          </div>
        ))}
        {ticks.map(tick =>
          tick.showLabel ? (
            <div
              key={tick.time}
              className={cx(styles.timelineAxisTick, classNames.tick)}
              style={{ left: tick.x }}
            >
              {tick.label}
            </div>
          ) : null
        )}
        {resolvedMarkers.map(marker => (
          <div
            key={marker.key}
            className={styles.timelineAxisMarker}
            style={{ left: marker.x }}
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
        >
          {groupBands.map(band => (
            <div
              key={band.key}
              className={styles.timelineGroupSlot}
              style={{ top: band.top, height: band.height }}
            >
              <div
                className={cx(
                  styles.timelineGroupHeader,
                  classNames.groupHeader
                )}
                style={{ height: GROUP_BAND_HEIGHT }}
              >
                {/* Sticky-left so the label stays readable while panning. */}
                <span className={styles.timelineGroupHeaderLabel}>
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
      >
        {showGridlines
          ? gridTicks.map(tick =>
              tick.index % gridlineEvery === 0 ? (
                <div
                  key={tick.time}
                  aria-hidden='true'
                  className={cx(styles.timelineGridline, classNames.gridline)}
                  style={{ left: tick.x }}
                />
              ) : null
            )
          : null}
        {resolvedMarkers.map(marker => (
          <div
            key={marker.key}
            aria-hidden='true'
            className={cx(styles.timelineMarkerLine, classNames.marker)}
            data-variant={marker.variant}
            style={{ left: marker.x }}
          />
        ))}
        {cursorTime !== null ? (
          <div
            aria-hidden='true'
            className={cx(styles.timelineCursorLine, classNames.cursor)}
            style={{ left: timeScale.x(cursorTime) }}
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
              onMeasure={handleCardMeasure}
              onRowClick={onRowClick}
              className={cardClassName}
            />
          );
        })}
      </div>

      {/* Sticky-left so the footer stays viewport-aligned under horizontal scroll. */}
      <div className={styles.timelineFooter}>
        <FilterSummary />
      </div>
    </div>
  );
}

DataViewTimeline.displayName = 'DataView.Timeline';
