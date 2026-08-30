'use client';

import { cx } from 'class-variance-authority';
import { useMemo } from 'react';
import {
  type DateRange,
  DayPicker,
  type DayPickerProps,
  type Matcher
} from 'react-day-picker';
import { Skeleton } from '../skeleton';
import styles from './calendar-preview.module.css';
import type { DateRangeValue } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey } from './date-adapter';

/**
 * Everything react-day-picker owns is derived from root context and is
 * deliberately absent from this interface: `mode`, `selected`, `onSelect`,
 * `required`, `month`, `onMonthChange`, and `timeZone` cannot be passed here
 * at all. That is what makes spreading `...props` last honest — nothing is
 * force-overridden after the consumer's spread.
 */
/*
 * Module scope, not inside the render. React compares component *types* by
 * identity: a fresh function per render is a new type, so RDP's whole grid
 * unmounts and remounts and the focused day node does not survive — which
 * defeats the roving tabindex the RFC keeps react-day-picker for.
 */
const GRID_COMPONENTS: DayPickerProps['components'] = {
  DayButton: ({ day: _day, modifiers: _modifiers, ...buttonProps }) => (
    <button
      type='button'
      {...buttonProps}
      className={cx(buttonProps.className, styles.dayButton)}
      data-slot='calendar-preview-day'
    >
      <span
        className={styles.dayNumber}
        data-slot='calendar-preview-day-number'
      >
        {buttonProps.children}
      </span>
    </button>
  ),
  // `.Nav` owns the caption; RDP's would render the month twice.
  MonthCaption: () => <></>,
  MonthGrid: gridProps => (
    <div className={styles.weeks} data-slot='calendar-preview-weeks'>
      <table {...gridProps} data-slot='calendar-preview-table' />
    </div>
  )
};

const GRID_CLASS_NAMES: DayPickerProps['classNames'] = {
  months: styles.months,
  week: styles.week,
  weekdays: styles.week,
  weekday: styles.weekday,
  day: styles.day,
  today: styles.today,
  outside: styles.outside,
  disabled: styles.disabled,
  selected: styles.selected,
  day_button: styles.dayButton,
  range_start: styles.rangeStart,
  range_middle: styles.rangeMiddle,
  range_end: styles.rangeEnd,
  hidden: styles.hidden
};

export interface CalendarPreviewGridProps
  extends Pick<
    DayPickerProps,
    'showWeekNumber' | 'modifiers' | 'modifiersClassNames' | 'classNames'
  > {
  /** @defaultValue 1 */
  months?: 1 | 2;
  /** @defaultValue false */
  showOutsideDays?: boolean;
  className?: string;
}

export function CalendarPreviewGrid({
  months = 1,
  showOutsideDays = false,
  className,
  classNames,
  ...props
}: CalendarPreviewGridProps) {
  const {
    selection,
    value,
    setValue,
    month,
    setMonth,
    minDate,
    maxDate,
    isDateUnavailable,
    timeZone,
    weekStartsOn,
    disabled,
    readOnly,
    lock,
    granularity,
    loading
  } = useCalendarPreviewContext('Grid');

  const disabledMatchers = useMemo(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    if (isDateUnavailable) matchers.push(isDateUnavailable);
    return matchers;
  }, [minDate, maxDate, isDateUnavailable]);

  const mergedClassNames = useMemo(
    () => ({ ...GRID_CLASS_NAMES, ...classNames }),
    [classNames]
  );

  /*
   * The day grid renders for the day granularity only; `.MonthGrid` covers
   * month, quarter, half-year and year. Both sit in the same composition and
   * each shows itself for its own granularities.
   */
  if (granularity !== 'day') return null;

  /*
   * The grid is replaced outright rather than overlaid: the old family shimmered
   * five rows over a live grid, which left the days underneath focusable.
   */
  if (loading) {
    return (
      <div
        className={cx(styles.gridSkeleton, className)}
        aria-busy='true'
        data-slot='calendar-preview-skeleton'
      >
        <Skeleton
          count={7}
          height='var(--rs-space-10)'
          containerClassName={styles.gridSkeletonRows}
        />
      </div>
    );
  }

  /*
   * `readOnly` shows the value but refuses writes, so days stay legible and
   * focusable rather than dimmed — that is what separates it from `disabled`.
   */
  const writable = !disabled && !readOnly;

  /*
   * Everything except the mode discriminator. `...props` sits last inside it,
   * so it stays last at every call site below — and because `mode`,
   * `selected`, and `onSelect` are not in `CalendarPreviewGridProps`, putting
   * them ahead of the spread overrides nothing a consumer could have passed.
   */
  const shared = {
    month,
    onMonthChange: setMonth,
    timeZone,
    weekStartsOn,
    numberOfMonths: months,
    showOutsideDays,
    disabled: (disabled ? true : disabledMatchers) satisfies
      | Matcher
      | Matcher[],
    // `.Nav` is ours: RDP renders no navigation and never mounts a `Select`.
    hideNavigation: true,
    captionLayout: 'label' as const,
    components: GRID_COMPONENTS,
    classNames: mergedClassNames,
    className: cx(styles.grid, className),
    ...props
  };

  /*
   * Three call sites rather than one assembled object: `mode` discriminates
   * react-day-picker's prop union, so a single spread would need a cast. This
   * keeps the boundary fully type-checked — and the union still never reaches
   * a consumer, because it stops here.
   */
  if (selection === 'range') {
    const range = value as DateRangeValue | null;
    return (
      <DayPicker
        mode='range'
        selected={
          range
            ? { from: range.from ?? undefined, to: range.to ?? undefined }
            : undefined
        }
        onSelect={(next: DateRange | undefined, triggerDate: Date) => {
          if (!writable) return;
          const held = range ?? { from: null, to: null };
          /*
           * With an endpoint locked, RDP's range machine still rewrites both
           * ends, so ignore its result and drive the unlocked end from the
           * clicked day alone. This is what closes the whole-picker-disable
           * gate — "fix the start, pick the end" no longer means disabling
           * the picker. Re-clicking the unlocked end clears it, which is the
           * only deselect available while a lock is held.
           */
          if (lock) {
            const unlocked = lock === 'from' ? held.to : held.from;
            const nextUnlocked =
              unlocked &&
              dayKey(unlocked, timeZone) === dayKey(triggerDate, timeZone)
                ? null
                : triggerDate;
            setValue(
              lock === 'from'
                ? { from: held.from, to: nextUnlocked }
                : { from: nextUnlocked, to: held.to }
            );
            return;
          }
          setValue(
            next ? { from: next.from ?? null, to: next.to ?? null } : null
          );
        }}
        data-slot='calendar-preview-grid'
        {...shared}
      />
    );
  }

  if (selection === 'multiple') {
    return (
      <DayPicker
        mode='multiple'
        selected={(value as Date[]) ?? []}
        onSelect={(next: Date[] | undefined) => {
          if (!writable) return;
          setValue(next ?? []);
        }}
        data-slot='calendar-preview-grid'
        {...shared}
      />
    );
  }

  return (
    <DayPicker
      mode='single'
      selected={(value as Date | null) ?? undefined}
      onSelect={(next: Date | undefined) => {
        if (!writable) return;
        setValue(next ?? null);
      }}
      data-slot='calendar-preview-grid'
      {...shared}
    />
  );
}

CalendarPreviewGrid.displayName = 'CalendarPreview.Grid';
