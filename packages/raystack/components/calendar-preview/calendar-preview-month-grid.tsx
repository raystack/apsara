'use client';

import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  useCallback,
  useMemo
} from 'react';
import { Skeleton } from '../skeleton';
import styles from './calendar-preview.module.css';
import type {
  CalendarGranularity,
  CalendarValidity,
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import {
  addMonths,
  dayKey,
  dayOrdinal,
  firstOfMonth,
  getYear,
  periodMonths,
  periodRange
} from './date-adapter';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

/**
 * Shape of each non-day granularity, taken from the design: month, quarter and
 * half-year group under a year heading at 3, 4 and 2 columns; year is a flat
 * full-width list with no heading at all.
 */
const PERIODS = {
  month: {
    perYear: 12,
    columns: 3,
    grouped: true,
    label: (index: number) => MONTH_LABELS[index],
    startMonth: (index: number) => index
  },
  quarter: {
    perYear: 4,
    columns: 4,
    grouped: true,
    label: (index: number) => `Q${index + 1}`,
    startMonth: (index: number) => index * 3
  },
  'half-year': {
    perYear: 2,
    columns: 2,
    grouped: true,
    label: (index: number) => `H${index + 1}`,
    startMonth: (index: number) => index * 6
  },
  year: {
    perYear: 1,
    columns: 1,
    grouped: false,
    label: () => '',
    startMonth: () => 0
  }
} as const satisfies Record<Exclude<CalendarGranularity, 'day'>, unknown>;

/**
 * One period button, fully resolved: no date maths left for render time.
 * `selected` is not here — it is the only value-dependent field, and folding
 * it in made a time-of-day nudge rebuild every date in the list.
 */
interface PeriodCell {
  key: number;
  label: string;
  start: Date;
  /** First instant of the *next* period, so `selected` needs no date maths. */
  end: Date;
  /**
   * The date this cell emits — not always its first day. The overlap rule
   * enables a period a mid-month `minDate` only partly allows, and emitting
   * the 1st there hands the consumer a value before the bound they declared.
   */
  value: Date;
  unavailable: boolean;
}

export interface CalendarPreviewMonthGridProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * How many years either side of the active one to offer.
   *
   * Per edge, and only where that edge is unbounded: `minDate` fixes the first
   * year and `maxDate` the last. With both supplied this is inert and the list
   * spans the bounds in full — 1970–2035 really does render 792 buttons.
   * @defaultValue 5
   */
  yearWindow?: number;
}

/**
 * Month, quarter, half-year and year selection. A scrolling list of years
 * rather than a paged grid, which is why `.Nav` does not render for these
 * granularities — there is nothing to page.
 *
 * **Emits the first day of the chosen period.** Whether quarter and half-year
 * should instead emit a `{ from, to }` range is RFC 005 open item 1; the
 * `Date` form is chosen here because it leaves the value union unchanged and
 * can be widened later without a break.
 */
export function CalendarPreviewMonthGrid({
  className,
  yearWindow = 5,
  ...props
}: CalendarPreviewMonthGridProps) {
  const {
    granularity,
    selection,
    value,
    setValue,
    month,
    activeField,
    lock,
    minDate,
    maxDate,
    isDateUnavailable,
    timeZone,
    disabled,
    readOnly,
    loading,
    reportValidity
  } = useCalendarPreviewContext('MonthGrid');

  /*
   * The selection first, then the month the picker has been driven to.
   * `month` is a documented public prop that every other view honours; this
   * one fell back to `new Date()`, so with nothing selected it opened on the
   * host's current year wherever the consumer had navigated, and the
   * `setMonth` calls `.Preset` and `.Input` make after a commit were
   * invisible here.
   */
  const anchor = firstSelected(value) ?? month;
  const anchorYear = getYear(anchor, timeZone);

  /*
   * A callback ref rather than an effect. The effect form could not see the
   * scroll container on mount — a child's ref attaches before its parent's, so
   * `scrollRef.current` was still null — and a dependency array is the wrong
   * shape for "the element to scroll to has changed". React runs this exactly
   * when that element attaches: when the grid mounts, and again whenever the
   * anchor year moves the ref to a different section.
   *
   * The container is read from the node rather than captured, both to survive
   * that ordering and to keep the scroll scoped: an unqualified
   * `scrollIntoView` inside a portal can move the page behind the popover.
   * Every year element is a direct child of the scroll container.
   */
  const scrollActiveYearIntoView = useCallback(
    (node: HTMLDivElement | null) => {
      const container = node?.parentElement;
      if (!node || !container) return;
      container.scrollTop =
        node.offsetTop - container.clientHeight / 2 + node.clientHeight / 2;
    },
    []
  );

  /*
   * Each cell costs about five dayjs constructions, and a picker bounded to a
   * couple of decades has hundreds of them. `disabled` is deliberately absent
   * from the deps: it gates the button at render time, not the dates.
   *
   * Bounds enter as numbers, never as the `Date`s. `minDate={new Date(...)}`
   * is how a bounded picker is ordinarily written, so a `Date` in the deps is
   * a fresh identity every parent render and the memo never held at all.
   */
  const minTime = minDate ? minDate.getTime() : null;
  const maxTime = maxDate ? maxDate.getTime() : null;

  /*
   * Resolved out here so the memo depends on the two year numbers, not on
   * `anchorYear` — which follows the selection, and which a bounded list never
   * reads, so leaving it in the deps rebuilt every cell for an unmoved span.
   */
  /*
   * The window is measured from the anchor *after* it is clamped into the
   * bounds. Measured from the raw anchor, the far edge could only clamp the
   * span and never extend it, which broke it in both directions:
   * `minDate={2035}` with no `maxDate` gave firstYear 2035 against lastYear
   * 2031 and the loop below never ran at all, and `minDate={2040}` with
   * `yearWindow={5}` collapsed to the single year 2040 instead of 2040–2045.
   * Clamping first makes each edge yield to the other by construction.
   */
  const boundedFirst = minDate ? getYear(minDate, timeZone) : null;
  const boundedLast = maxDate ? getYear(maxDate, timeZone) : null;
  const scrollYear = Math.min(
    Math.max(anchorYear, boundedFirst ?? Number.NEGATIVE_INFINITY),
    boundedLast ?? Number.POSITIVE_INFINITY
  );
  const firstYear = boundedFirst ?? scrollYear - yearWindow;
  const lastYear = boundedLast ?? scrollYear + yearWindow;

  const sections = useMemo(() => {
    if (granularity === 'day') return [];

    const period = PERIODS[granularity];
    const monthsPerPeriod = periodMonths(granularity);

    const built: { year: number; cells: PeriodCell[] }[] = [];
    for (let year = firstYear; year <= lastYear; year += 1) {
      const cells = Array.from({ length: period.perYear }, (_, index) => {
        /*
         * The start is known from the year and the index, so it is built once
         * rather than rediscovered: `periodRange` would re-read the wall clock
         * and re-parse to arrive back at this same instant. `addMonths` carries
         * the year rollover, which is the part worth not writing twice.
         */
        const start = firstOfMonth(year, period.startMonth(index), timeZone);
        const end = addMonths(start, monthsPerPeriod, timeZone);
        /*
         * Overlap, not first-day: a `minDate` falling mid-month used to
         * disable the whole month and make every valid day in it unreachable.
         * `.Nav` answers the same question this way.
         */
        const outOfBounds =
          (minTime !== null && end.getTime() - 1 < minTime) ||
          (maxTime !== null && start.getTime() > maxTime);
        /*
         * Clamped to the lower bound only. A period starting past `maxDate` is
         * already out of bounds above, so nothing can exceed the upper one.
         */
        const value =
          minTime !== null && start.getTime() < minTime
            ? new Date(minTime)
            : start;

        return {
          // Integer identity, not `dayKey`: React stringifies keys anyway.
          key: dayOrdinal(start, timeZone),
          label: granularity === 'year' ? String(year) : period.label(index),
          start,
          end,
          value,
          /*
           * Availability is asked about `value`, not `start`: testing a day the
           * cell would never emit both disabled reachable periods and let
           * unavailable ones through.
           */
          unavailable: outOfBounds || !!isDateUnavailable?.(value)
        } satisfies PeriodCell;
      });
      built.push({ year, cells });
    }
    return built;
  }, [
    granularity,
    firstYear,
    lastYear,
    minTime,
    maxTime,
    isDateUnavailable,
    timeZone
  ]);

  if (granularity === 'day') return null;

  if (loading) {
    return (
      <div
        className={cx(styles.gridSkeleton, className)}
        aria-busy='true'
        data-slot='calendar-preview-skeleton'
      >
        <Skeleton
          count={5}
          height='var(--rs-space-7)'
          containerClassName={styles.gridSkeletonRows}
        />
      </div>
    );
  }

  const period = PERIODS[granularity];
  const writable = !disabled && !readOnly;
  const selectedTimes = selectedDatesIn(value).map(date => date.getTime());

  const commit = (cell: PeriodCell) => {
    if (!writable) return;
    const start = cell.value;
    /*
     * Bounds and availability are valid by construction — such a cell is
     * disabled, so reaching here means `start` passes both. Reported at all
     * because `.Grid` leaves this to RDP's own disabling, which left
     * `onValidityChange` silent for every non-day pick.
     */
    const valid: CalendarValidity = { valid: true };

    if (selection === 'range') {
      const range = (value as DateRangeValue | null) ?? {
        from: null,
        to: null
      };
      const field = lock ? (lock === 'from' ? 'to' : 'from') : activeField;
      const opposite = field === 'from' ? 'to' : 'from';
      const next: DateRangeValue = { ...range, [field]: start };
      /*
       * `.RangeInput` guards ordering, `.Grid` delegates it to RDP and
       * `.TimeField` refuses inversion outright; this writer had none of it, so
       * picking Dec 2026 against an existing March committed a backwards range
       * that any `from <= x <= to` reader sees as empty.
       *
       * Compared by period, not by instant: two picks inside one period are the
       * same choice, and clearing the opposite end there would discard a
       * selection the user did not contradict.
       */
      if (next.from && next.to) {
        const fromStart = periodRange(next.from, granularity, timeZone).start;
        const toStart = periodRange(next.to, granularity, timeZone).start;
        if (fromStart.getTime() > toStart.getTime()) {
          /*
           * `lock` holds the opposite endpoint read-only, and the opposite
           * endpoint is exactly the one an inversion would clear — so under a
           * lock there is nothing this writer may repair. Refused instead, the
           * way `.TimeField` refuses an inversion it cannot fix, rather than
           * deleting the endpoint the consumer pinned.
           */
          if (lock === opposite) {
            reportValidity({ valid: false, reason: 'range-order' });
            return;
          }
          next[opposite] = null;
        }
      }
      reportValidity(valid);
      setValue(next);
      return;
    }

    reportValidity(valid);
    if (selection === 'multiple') {
      const current = (value as Date[]) ?? [];
      const key = dayKey(start, timeZone);
      const without = current.filter(item => dayKey(item, timeZone) !== key);
      setValue(
        without.length === current.length ? [...current, start] : without
      );
      return;
    }
    setValue(start);
  };

  const renderCell = (cell: PeriodCell, year: number) => {
    const selected = selectedTimes.some(
      time => time >= cell.start.getTime() && time < cell.end.getTime()
    );
    return (
      <button
        key={cell.key}
        type='button'
        className={styles.monthCell}
        disabled={disabled || cell.unavailable}
        /*
         * `readOnly` used to reach only the commit guard, so every cell was
         * announced as an operable unpressed toggle that silently did
         * nothing. `aria-disabled` rather than `disabled`, as `.Grid` marks
         * an unavailable day: the cell stays focusable and legible, which is
         * what separates read-only from disabled.
         */
        aria-disabled={readOnly || undefined}
        aria-pressed={selected}
        /*
         * The year lives in a sibling element, so a screen reader heard the
         * same bare "Q1" from four buttons across an 11-year list with
         * nothing to tell them apart. The year granularity labels itself.
         */
        aria-label={period.grouped ? `${cell.label} ${year}` : undefined}
        data-selected={selected || undefined}
        data-slot='calendar-preview-month-cell'
        onClick={() => commit(cell)}
      >
        {cell.label}
      </button>
    );
  };

  return (
    <div
      className={cx(styles.monthGrid, className)}
      data-granularity={granularity}
      data-slot='calendar-preview-month-grid'
      {...props}
    >
      {sections.map(({ year, cells }) =>
        period.grouped ? (
          <div
            key={year}
            ref={year === scrollYear ? scrollActiveYearIntoView : undefined}
            className={styles.monthGridSection}
            data-scroll-anchor={year === scrollYear || undefined}
          >
            <div
              className={styles.monthGridYear}
              data-slot='calendar-preview-month-grid-year'
            >
              {year}
            </div>
            <div
              className={styles.monthGridCells}
              style={{ '--columns': period.columns } as CSSProperties}
            >
              {cells.map(cell => renderCell(cell, year))}
            </div>
          </div>
        ) : (
          <div
            key={year}
            ref={year === scrollYear ? scrollActiveYearIntoView : undefined}
            className={styles.monthGridCells}
            data-scroll-anchor={year === scrollYear || undefined}
            style={{ '--columns': 1 } as CSSProperties}
          >
            {cells.map(cell => renderCell(cell, year))}
          </div>
        )
      )}
    </div>
  );
}

CalendarPreviewMonthGrid.displayName = 'CalendarPreview.MonthGrid';

function firstSelected(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  const range = value as DateRangeValue;
  return range.from ?? range.to ?? undefined;
}

/**
 * A cell lights when a selected date falls anywhere inside its period, not
 * only when it starts it. Picking 17 April in the day grid and switching to
 * Month must not show an empty grid — that reads as lost state. Clicking the
 * cell still rewrites the value to the period start.
 */
function selectedDatesIn(value: unknown): Date[] {
  if (value instanceof Date) return [value];
  if (Array.isArray(value)) return value as Date[];
  if (!value) return [];
  const range = value as DateRangeValue;
  return [range.from, range.to].filter(Boolean) as Date[];
}
