'use client';

import { cx } from 'class-variance-authority';
import { type CSSProperties, useEffect, useMemo, useRef } from 'react';
import {
  type DateRange,
  type DayButtonProps,
  DayPicker,
  type DayPickerProps,
  type Matcher
} from 'react-day-picker';
import { Skeleton } from '../skeleton';
import styles from './calendar-preview.module.css';
import type {
  CalendarRangeField,
  DateRangeValue
} from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, isAfterDay, withTimeOf } from './date-adapter';

/**
 * Everything react-day-picker owns is derived from root context and is
 * deliberately absent from this interface: `mode`, `selected`, `onSelect`,
 * `required`, `month`, `onMonthChange`, and `timeZone` cannot be passed here
 * at all. That is what makes spreading `...props` last honest — nothing is
 * force-overridden after the consumer's spread.
 */
/**
 * The day button, carrying RDP's roving tabindex.
 *
 * Arrow keys do not move focus themselves: RDP moves a `focused` modifier
 * between days and never touches the DOM, so the button has to focus itself
 * when it becomes the focused one. Overriding `DayButton` without this ref and
 * effect left the grid's arrow keys dead in every composition, and crossing a
 * month boundary dropped focus to `<body>` — inside a popover, that strands
 * the user outside the surface with nothing focused.
 *
 * `modifiers` is therefore read, not discarded. Keyboard navigation is the
 * stated reason the RFC takes a dependency on react-day-picker at all.
 */
function DayButton({ day: _day, modifiers, ...buttonProps }: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
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
  );
}

/*
 * Module scope, not inside the render. React compares component *types* by
 * identity: a fresh function per render is a new type, so RDP's whole grid
 * unmounts and remounts and the focused day node does not survive. Necessary
 * but not sufficient — node identity is not the focus mechanism, the ref and
 * effect above are.
 */
const GRID_COMPONENTS: DayPickerProps['components'] = {
  DayButton,
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
    loading,
    reportValidity
  } = useCalendarPreviewContext('Grid');

  /*
   * Keyed on the instants, not the `Date`s: this array is handed to RDP as
   * `disabled`, so a fresh identity every render propagates into its own memos.
   */
  const minTime = minDate ? minDate.getTime() : null;
  const maxTime = maxDate ? maxDate.getTime() : null;

  const disabledMatchers = useMemo(() => {
    const matchers: Matcher[] = [];
    if (minTime !== null) matchers.push({ before: new Date(minTime) });
    if (maxTime !== null) matchers.push({ after: new Date(maxTime) });
    if (isDateUnavailable) matchers.push(isDateUnavailable);
    return matchers;
  }, [minTime, maxTime, isDateUnavailable]);

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
        /*
         * `months` widens the grid rather than lengthening it — `.months` is a
         * flex row — so the row count below holds and only the width follows.
         */
        style={{ '--calendar-preview-grid-months': months } as CSSProperties}
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
           * Valid by construction, and said so rather than assumed: RDP
           * disables every day outside the bounds or refused by
           * `isDateUnavailable`, and `commitRange` below refuses an
           * inversion. The root used to announce this on our behalf, which
           * is how this writer committed a backwards range under a lock and
           * reported it good.
           */
          const accept = (next: DateRangeValue | null) => {
            reportValidity({ valid: true });
            setValue(next);
          };

          /*
           * A click is midnight, so each endpoint keeps the time it already
           * had — the same inheritance `.Input` and `.RangeInput` do, and for
           * the same reason: otherwise moving one end of a range reset it to
           * 00:00 and `.TimeField`, which reads the committed value, showed a
           * time nobody chose. Per field, so the two ends never trade clocks.
           * Identity is short-circuited because RDP hands back the untouched
           * endpoint's own `Date`, which already has its time.
           */
          const keepClock = (
            next: Date | null,
            previous: Date | null
          ): Date | null =>
            !next || next === previous
              ? next
              : withTimeOf(next, previous, timeZone);
          const inherit = (candidate: DateRangeValue): DateRangeValue => ({
            from: keepClock(candidate.from, held.from),
            to: keepClock(candidate.to, held.to)
          });

          /*
           * The ordering policy, shared with `.MonthGrid`. Both grids answer
           * the same question and had answered it differently: this one wrote
           * the clicked day through with no guard at all, so picking before a
           * locked start emitted `from > to` and — because the root announces
           * validity on every commit — reported it as good.
           *
           * Compared by day, as `.RangeInput` does: a click carries no time of
           * day, so an instant comparison would read a 09:00 endpoint as
           * "after" the midnight the click produces.
           */
          const commitRange = (
            candidate: DateRangeValue,
            field: CalendarRangeField
          ) => {
            const opposite = field === 'from' ? 'to' : 'from';
            if (
              candidate.from &&
              candidate.to &&
              isAfterDay(candidate.from, candidate.to, timeZone)
            ) {
              /*
               * `lock` holds the opposite endpoint read-only, and the opposite
               * endpoint is the only one an inversion could clear — so under a
               * lock there is nothing to repair. Refused, as `.TimeField`
               * refuses what it cannot fix, rather than deleting a pinned end.
               */
              if (lock === opposite) {
                reportValidity({ valid: false, reason: 'range-order' });
                return;
              }
              accept({ ...candidate, [opposite]: null });
              return;
            }
            accept(candidate);
          };

          /*
           * With an endpoint locked, RDP's range machine still rewrites both
           * ends, so ignore its result and drive the unlocked end from the
           * clicked day alone. This is what closes the whole-picker-disable
           * gate — "fix the start, pick the end" no longer means disabling
           * the picker. Re-clicking the unlocked end clears it, which is the
           * only deselect available while a lock is held.
           */
          if (lock) {
            const field: CalendarRangeField = lock === 'from' ? 'to' : 'from';
            const unlocked = held[field];
            if (
              unlocked &&
              dayKey(unlocked, timeZone) === dayKey(triggerDate, timeZone)
            ) {
              accept({ ...held, [field]: null });
              return;
            }
            commitRange(inherit({ ...held, [field]: triggerDate }), field);
            return;
          }

          /*
           * RDP has no answer for a range holding only an end.
           * `addToRange` branches on `!from && !to`, `from && !to` and
           * `from && to`; `{ from: undefined, to: D }` — which is what
           * `{ from: null, to: D }` becomes on the way in — falls through all
           * three, so `range` is never assigned and it returns `undefined`.
           * Mapping that to `setValue(null)` discarded both the surviving
           * endpoint and the click. Clearing one end is a documented move
           * (`.RangeInput` empties a field; a typed end before the start nulls
           * `from`), so this shape is ordinary, not exotic.
           */
          /*
           * The first click sets the start and leaves the end open.
           * `addToRange`'s empty branch fills `to` with the clicked day
           * whenever `min` is 0, so one click emitted a finished same-day
           * range — a complete value the user had not expressed, and under
           * `commit="immediate"` one the consumer saw straight away. Clicking
           * that day again then emitted `null`, losing the start too. A
           * same-day range is still reachable: click the day twice.
           *
           * Done here rather than through RDP's `resetOnSelect`, whose
           * condition is `hasFullRange || !selected?.from` — the second half
           * catches a range holding only an end and discards the end, which
           * is the shape the branch below exists to protect.
           *
           * `!held.to` is belt-and-braces: RDP returns `undefined` for that
           * shape today, so it would skip this branch anyway, but the
           * condition should not depend on which branch of `addToRange` ran.
           */
          if (!held.from && !held.to && next?.from) {
            accept({ from: next.from, to: null });
            return;
          }

          if (!next && held.to && !held.from) {
            commitRange(inherit({ from: triggerDate, to: held.to }), 'from');
            return;
          }

          accept(
            next
              ? inherit({ from: next.from ?? null, to: next.to ?? null })
              : null
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
          reportValidity({ valid: true });
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
        reportValidity({ valid: true });
        setValue(
          next ? withTimeOf(next, value as Date | null, timeZone) : null
        );
      }}
      data-slot='calendar-preview-grid'
      {...shared}
    />
  );
}

CalendarPreviewGrid.displayName = 'CalendarPreview.Grid';
