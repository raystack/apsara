'use client';

import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useRef
} from 'react';
import styles from './calendar-preview.module.css';
import type {
  CalendarGranularity,
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, firstOfMonth, getYear, isWithinBounds } from './date-adapter';

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

export interface CalendarPreviewMonthGridProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * How many years either side of the active one to offer when no `minDate`
   * or `maxDate` bounds the list.
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
    readOnly
  } = useCalendarPreviewContext('MonthGrid');

  const activeYearRef = useRef<HTMLDivElement>(null);

  /*
   * Bring the active year into view once. The list can span decades, so
   * opening it scrolled to the top would usually show the wrong era.
   */
  useEffect(() => {
    activeYearRef.current?.scrollIntoView?.({ block: 'center' });
  }, []);

  if (granularity === 'day') return null;

  const period = PERIODS[granularity];
  const writable = !disabled && !readOnly;

  const anchor = firstSelected(value) ?? new Date();
  const anchorYear = getYear(anchor, timeZone);

  const firstYear = minDate
    ? getYear(minDate, timeZone)
    : anchorYear - yearWindow;
  const lastYear = maxDate
    ? getYear(maxDate, timeZone)
    : anchorYear + yearWindow;
  const years: number[] = [];
  for (let year = firstYear; year <= lastYear; year += 1) years.push(year);

  const selectedKeys = selectedPeriodKeys(value, timeZone);

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

  const renderCell = (year: number, index: number) => {
    const start = firstOfMonth(year, period.startMonth(index), timeZone);
    const key = dayKey(start, timeZone);
    const unavailable =
      !isWithinBounds(start, minDate, maxDate) || isDateUnavailable?.(start);

    return (
      <button
        key={key}
        type='button'
        className={styles.monthCell}
        disabled={disabled || unavailable}
        aria-pressed={selectedKeys.has(key)}
        data-selected={selectedKeys.has(key) || undefined}
        data-slot='calendar-preview-month-cell'
        onClick={() => commit(start)}
      >
        {granularity === 'year' ? String(year) : period.label(index)}
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
      {period.grouped
        ? years.map(year => (
            <div
              key={year}
              ref={year === anchorYear ? activeYearRef : undefined}
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
                {Array.from({ length: period.perYear }, (_, index) =>
                  renderCell(year, index)
                )}
              </div>
            </div>
          ))
        : years.map(year => (
            <div
              key={year}
              ref={year === anchorYear ? activeYearRef : undefined}
              className={styles.monthGridCells}
              style={{ '--columns': 1 } as CSSProperties}
            >
              {renderCell(year, 0)}
            </div>
          ))}
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
 * Cells are marked selected when a selected date *starts* the period, so a
 * value emitted by this grid round-trips. A date mid-period does not light a
 * cell — that would claim a precision the value does not carry.
 */
function selectedPeriodKeys(value: unknown, timeZone?: string): Set<string> {
  const dates: Date[] = [];
  if (value instanceof Date) dates.push(value);
  else if (Array.isArray(value)) dates.push(...(value as Date[]));
  else if (value) {
    const range = value as DateRangeValue;
    if (range.from) dates.push(range.from);
    if (range.to) dates.push(range.to);
  }
  return new Set(dates.map(date => dayKey(date, timeZone)));
}
