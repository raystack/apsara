import dayjs, { type Dayjs } from 'dayjs';

import type { TimelineScale } from '../data-view.types';

/**
 * Average unit durations in ms. Used only to derive px density (px/ms) from
 * `unitWidth`; card and tick positions always use real timestamps, so
 * variable-length months don't distort placement.
 */
export const TIMELINE_UNIT_MS: Record<TimelineScale, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30.44 * 86_400_000,
  quarter: 3 * 30.44 * 86_400_000
};

/** Default px width of one `scale` unit when `unitWidth` is not provided. */
export const TIMELINE_DEFAULT_UNIT_WIDTH: Record<TimelineScale, number> = {
  day: 20,
  week: 56,
  month: 96,
  quarter: 140
};

/** Minimum px between rendered tick labels — denser ticks skip labels. */
const TICK_LABEL_MIN_SPACE = 28;

/** Coerce a consumer-provided date (Date | epoch ms | parseable string) to ms. */
export function toTimestamp(value: unknown): number | null {
  if (value == null) return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.valueOf() : null;
  }
  return null;
}

/** `startOf` that also understands quarters without a dayjs plugin. */
export function startOfUnit(date: Dayjs, scale: TimelineScale): Dayjs {
  if (scale === 'quarter') {
    return date.startOf('month').subtract(date.month() % 3, 'month');
  }
  return date.startOf(scale);
}

export function addUnits(date: Dayjs, scale: TimelineScale, n: number): Dayjs {
  if (scale === 'quarter') return date.add(3 * n, 'month');
  return date.add(n, scale);
}

export interface TimelineTimeScale {
  /** Domain start (ms), snapped to a unit boundary. */
  t0: number;
  /** Domain end (ms), snapped to a unit boundary. */
  t1: number;
  pxPerMs: number;
  totalWidth: number;
  /** Time (ms) → x offset (px) from the canvas left edge. */
  x: (time: number) => number;
  /** Inverse of `x` — px offset → time (ms). */
  timeAt: (px: number) => number;
}

export function createTimeScale(params: {
  minTime: number;
  maxTime: number;
  scale: TimelineScale;
  unitWidth: number;
  /** Whole units of padding added on each side of the extent. */
  padUnits?: number;
  /**
   * Minimum rendered width (px). The domain end extends by whole units until
   * `totalWidth` reaches it; a domain already wider is left untouched. Lets
   * the timeline fill its container when the data span is narrower.
   */
  minWidth?: number;
}): TimelineTimeScale {
  const { minTime, maxTime, scale, padUnits = 0, minWidth = 0 } = params;
  // Guard: `unitWidth` is consumer-controlled. Zero would make `pxPerMs` 0
  // (NaN geometry via the Infinity bulk-add below) and a negative value
  // inverts the scale so the viewport-fill loop never terminates. Clamp to a
  // 1px floor instead of hanging the render on a bad prop.
  const unitWidth = Math.max(1, params.unitWidth);
  const pxPerMs = unitWidth / TIMELINE_UNIT_MS[scale];
  const t0 = addUnits(
    startOfUnit(dayjs(Math.min(minTime, maxTime)), scale),
    scale,
    -padUnits
  ).valueOf();
  // +1 so the max instant's unit is fully inside the domain.
  let end = addUnits(
    startOfUnit(dayjs(Math.max(minTime, maxTime)), scale),
    scale,
    padUnits + 1
  );
  // Viewport fill: bulk-add the estimated deficit in one step, then correct
  // for calendar drift (short months, DST days) — at most a few iterations.
  const deficitPx = minWidth - (end.valueOf() - t0) * pxPerMs;
  if (deficitPx > 0) {
    end = addUnits(end, scale, Math.ceil(deficitPx / unitWidth));
    while ((end.valueOf() - t0) * pxPerMs < minWidth) {
      end = addUnits(end, scale, 1);
    }
  }
  const t1 = end.valueOf();
  return {
    t0,
    t1,
    pxPerMs,
    totalWidth: (t1 - t0) * pxPerMs,
    x: time => (time - t0) * pxPerMs,
    timeAt: px => t0 + px / pxPerMs
  };
}

export interface TimelineTick {
  time: number;
  x: number;
  label: string;
  /** False when labels are thinned out at dense zoom levels. */
  showLabel: boolean;
  /** Sequential unit index from the domain start — drives interval thinning. */
  index: number;
}

export interface TimelineBand {
  time: number;
  x: number;
  width: number;
  label: string;
}

function tickLabel(date: Dayjs, scale: TimelineScale): string {
  switch (scale) {
    case 'day':
    case 'week':
      return date.format('D');
    case 'month':
      return date.format('MMM');
    case 'quarter':
      return `Q${Math.floor(date.month() / 3) + 1}`;
  }
}

/**
 * Generates the two-tier axis: minor ticks at `scale` granularity and major
 * bands one level up (months over day/week ticks, years over month/quarter
 * ticks). The first band — and any band starting a new year — carries the
 * year in its label ("Jan 2025", then "Feb").
 *
 * `labelEvery` labels every Nth unit, counted from the domain start. The
 * collision floor (labels never closer than `TICK_LABEL_MIN_SPACE`) still
 * applies, so a too-dense request degrades instead of overlapping.
 *
 * Cost note: this materializes one tick per `scale` unit across the whole
 * domain on every rebuild — `virtualized` culls what renders, not what gets
 * built here. Fine at the intended densities (weeks/months, a few years of
 * days); a `day` scale over a decade-wide `range` allocates ~3.6k ticks per
 * rebuild and would need windowed generation instead.
 */
export function buildAxis(
  timeScale: TimelineTimeScale,
  scale: TimelineScale,
  unitWidth: number,
  labelEvery?: number
): { ticks: TimelineTick[]; bands: TimelineBand[] } {
  const autoLabelEvery = Math.max(
    1,
    Math.ceil(TICK_LABEL_MIN_SPACE / Math.max(1, unitWidth))
  );
  const effectiveLabelEvery = Math.max(
    autoLabelEvery,
    Math.floor(labelEvery ?? 1)
  );

  const ticks: TimelineTick[] = [];
  let cursor = startOfUnit(dayjs(timeScale.t0), scale);
  if (cursor.valueOf() < timeScale.t0) cursor = addUnits(cursor, scale, 1);
  let index = 0;
  while (cursor.valueOf() <= timeScale.t1) {
    ticks.push({
      time: cursor.valueOf(),
      x: timeScale.x(cursor.valueOf()),
      label: tickLabel(cursor, scale),
      showLabel: index % effectiveLabelEvery === 0,
      index
    });
    cursor = addUnits(cursor, scale, 1);
    index++;
  }

  const bands: TimelineBand[] = [];
  const bandUnit = scale === 'day' || scale === 'week' ? 'month' : 'year';
  let band = dayjs(timeScale.t0).startOf(bandUnit);
  let isFirst = true;
  while (band.valueOf() < timeScale.t1) {
    const next = band.add(1, bandUnit);
    const from = Math.max(band.valueOf(), timeScale.t0);
    const to = Math.min(next.valueOf(), timeScale.t1);
    const label =
      bandUnit === 'month'
        ? isFirst || band.month() === 0
          ? band.format('MMM YYYY')
          : band.format('MMM')
        : band.format('YYYY');
    bands.push({
      time: band.valueOf(),
      x: timeScale.x(from),
      width: (to - from) * timeScale.pxPerMs,
      label
    });
    isFirst = false;
    band = next;
  }

  return { ticks, bands };
}
