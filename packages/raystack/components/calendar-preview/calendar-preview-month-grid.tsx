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
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, dayOrdinal, firstOfMonth, getYear } from './date-adapter';

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
    activeField,
    lock,
    minDate,
    maxDate,
    isDateUnavailable,
    timeZone,
    disabled,
    readOnly,
    loading
  } = useCalendarPreviewContext('MonthGrid');

  const anchor = firstSelected(value) ?? new Date();
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
  const firstYear = minDate
    ? getYear(minDate, timeZone)
    : anchorYear - yearWindow;
  const lastYear = maxDate
    ? getYear(maxDate, timeZone)
    : anchorYear + yearWindow;

  const sections = useMemo(() => {
    if (granularity === 'day') return [];

    const period = PERIODS[granularity];
    const monthSpan = 12 / period.perYear;

    const built: { year: number; cells: PeriodCell[] }[] = [];
    for (let year = firstYear; year <= lastYear; year += 1) {
      const cells = Array.from({ length: period.perYear }, (_, index) => {
        const startMonth = period.startMonth(index);
        const start = firstOfMonth(year, startMonth, timeZone);
        const end = firstOfMonth(
          year + (startMonth + monthSpan >= 12 ? 1 : 0),
          (startMonth + monthSpan) % 12,
          timeZone
        );
        /*
         * Overlap, not first-day: a `minDate` falling mid-month used to
         * disable the whole month and make every valid day in it unreachable.
         * `.Nav` answers the same question this way.
         */
        const outOfBounds =
          (minTime !== null && end.getTime() - 1 < minTime) ||
          (maxTime !== null && start.getTime() > maxTime);

        return {
          // Integer identity, not `dayKey`: React stringifies keys anyway.
          key: dayOrdinal(start, timeZone),
          label: granularity === 'year' ? String(year) : period.label(index),
          start,
          end,
          unavailable: outOfBounds || !!isDateUnavailable?.(start)
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

  const commit = (start: Date) => {
    if (!writable) return;
    if (selection === 'range') {
      const range = (value as DateRangeValue | null) ?? {
        from: null,
        to: null
      };
      const field = lock ? (lock === 'from' ? 'to' : 'from') : activeField;
      setValue({ ...range, [field]: start });
      return;
    }
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

  const renderCell = (cell: PeriodCell) => {
    const selected = selectedTimes.some(
      time => time >= cell.start.getTime() && time < cell.end.getTime()
    );
    return (
      <button
        key={cell.key}
        type='button'
        className={styles.monthCell}
        disabled={disabled || cell.unavailable}
        aria-pressed={selected}
        data-selected={selected || undefined}
        data-slot='calendar-preview-month-cell'
        onClick={() => commit(cell.start)}
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
            ref={year === anchorYear ? scrollActiveYearIntoView : undefined}
            className={styles.monthGridSection}
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
              {cells.map(renderCell)}
            </div>
          </div>
        ) : (
          <div
            key={year}
            ref={year === anchorYear ? scrollActiveYearIntoView : undefined}
            className={styles.monthGridCells}
            style={{ '--columns': 1 } as CSSProperties}
          >
            {cells.map(renderCell)}
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
