'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import { useCallback, useMemo } from 'react';
import styles from './calendar-preview.module.css';
import {
  type CalendarPreviewChangeDetails,
  type CalendarPreviewChangeReason,
  type CalendarPreviewContextValue,
  CalendarPreviewProvider
} from './calendar-preview-context';
import {
  dayKey,
  formatDayLabel,
  formatMonthLabel,
  monthOf,
  parseKey,
  yearOf
} from './date-adapter';
import {
  type CalendarPreviewScale,
  type CalendarPreviewScaleValue,
  periodOf
} from './lib/scale';

const DEFAULT_YEAR_SPAN = 10;

/* `defaultValue` is omitted because `HTMLAttributes` already declares it as a
   form value, which is not what it means here. */
export interface CalendarPreviewProps
  extends Omit<useRender.ComponentProps<'div'>, 'defaultValue'> {
  /** The selected day (controlled). */
  value?: Date | null;
  /** The initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  /** Called when a day is committed or cleared. */
  onValueChange?: (
    value: Date | null,
    details: CalendarPreviewChangeDetails
  ) => void;

  /** The first month the grid displays (controlled). */
  month?: Date;
  /**
   * The month the grid opens on.
   * @defaultValue the month of `value`, else `today`
   */
  defaultMonth?: Date;
  /** Called when the view moves. */
  onMonthChange?: (month: Date) => void;
  /**
   * The years the caption's year column offers.
   * @defaultValue ten years either side of `today`, widened to cover any bound
   */
  yearRange?: { from: number; to: number };

  /** Earliest selectable day, inclusive. Never clamps navigation. */
  minDate?: Date;
  /** Latest selectable day, inclusive. Never clamps navigation. */
  maxDate?: Date;
  /** Reject individual days. Applied on top of `minDate` / `maxDate`. */
  isDateUnavailable?: (date: Date) => boolean;

  /**
   * The day `.Reset` restores. Read even when `value` is controlled, which
   * `defaultValue` is not — otherwise a controlled consumer never sees
   * `.Reset`.
   *
   * `null` is a default of *nothing selected*, so `.Reset` clears. Omitting
   * the prop is different: the part then has no job and does not render.
   */
  defaultDate?: Date | null;

  /**
   * The zone the grid reads days in. Forwarded to the grid; this family does
   * no conversion of its own (RFC 005).
   *
   * Every `Date` prop and every `Date` handed back is therefore an **instant**,
   * not a calendar day, and the calendar shows the day that instant falls on
   * in this zone. At a far offset that is not the day the local fields spell:
   * with `timeZone="Pacific/Niue"`, a `defaultMonth` of `new Date(2026, 7, 1)`
   * is 31 July there, and the grid opens on July. Build `Date`s for a zoned
   * calendar from a known instant — `new Date(Date.UTC(…))` — rather than from
   * local calendar fields.
   *
   * `onValueChange` receives whatever the grid produced, which is a `TZDate`
   * when this is set. It is a `Date` subclass carrying the same instant, so
   * `getTime()` and comparisons are unaffected; only its field getters read in
   * this zone.
   */
  timeZone?: string;
  /**
   * Today, injectable so a calendar renders deterministically in tests.
   * @defaultValue `new Date()`
   */
  today?: Date;
  /**
   * Whether clicking the selected day deselects it.
   * @defaultValue true
   */
  clearable?: boolean;
  /**
   * Whether the whole calendar is inert and every day is disabled.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the value can be read and navigated but not changed.
   * @defaultValue false
   */
  readOnly?: boolean;
}

/* The formatter phase 5's value-rendering parts will use. Not yet reachable
   from a prop: a `formatValue` override ships with the part that calls it, so
   the two arrive together rather than the prop shipping inert. */
export function defaultFormatValue(
  value: Date | CalendarPreviewScaleValue,
  scale: CalendarPreviewScale
): string {
  const date = value instanceof Date ? value : parseKey(value.date);
  if (scale === 'day') return formatDayLabel(date);
  if (scale === 'month') return formatMonthLabel(date);

  const key = dayKey(date);
  const year = yearOf(key);
  if (scale === 'year') return String(year);
  const month = monthOf(key);
  if (scale === 'quarter') return `Q${Math.floor((month - 1) / 3) + 1} ${year}`;
  return `H${month <= 6 ? 1 : 2} ${year}`;
}

export function CalendarPreviewRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  yearRange: yearRangeProp,
  minDate,
  maxDate,
  isDateUnavailable: isDateUnavailableProp,
  defaultDate,
  timeZone,
  today: todayProp,
  clearable = true,
  disabled = false,
  readOnly = false,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewProps) {
  const today = useMemo(() => todayProp ?? new Date(), [todayProp]);

  const [value, setValueUnwrapped] = useControlled<Date | null>({
    controlled: valueProp,
    default: defaultValue,
    name: 'CalendarPreview',
    state: 'value'
  });

  const [month, setMonthUnwrapped] = useControlled<Date>({
    controlled: monthProp,
    /* `valueProp` before `defaultValue`: `defaultValue` is forced to null the
       moment `value` is controlled, so reading it alone opened a controlled
       calendar on today's month with the selection off-screen — against this
       prop's own documented default. */
    default: defaultMonth ?? valueProp ?? defaultValue ?? today,
    name: 'CalendarPreview',
    state: 'month'
  });

  /* Uncontrolled until the scale switcher lands in PR 5. The state lives here
     now so the parts and `useCalendar()` read it from one place either way. */
  const [scale, setScaleUnwrapped] = useControlled<CalendarPreviewScale>({
    controlled: undefined,
    default: 'day',
    name: 'CalendarPreview',
    state: 'scale'
  });

  const setMonth = useCallback(
    (next: Date) => {
      setMonthUnwrapped(next);
      onMonthChange?.(next);
    },
    [setMonthUnwrapped, onMonthChange]
  );

  /* The inertness guard lives here rather than in the grid's click handler:
     `useCalendar().setValue` and `reset()` reach this same function, and a
     guard further out would leave both of them able to write to a calendar
     the consumer asked to be read-only. */
  const setValue = useCallback(
    (
      next: Date | null,
      reason: CalendarPreviewChangeReason,
      occasion: Date
    ) => {
      if (readOnly || disabled) return;
      setValueUnwrapped(next);
      onValueChange?.(next, {
        reason,
        period: periodOf(occasion, scale, timeZone),
        toDate: () => occasion
      });
    },
    [setValueUnwrapped, onValueChange, scale, timeZone, readOnly, disabled]
  );

  const setScale = useCallback(
    (next: CalendarPreviewScale) => setScaleUnwrapped(next),
    [setScaleUnwrapped]
  );

  /* `'reset'`, not `'select'`: restoring the default is not a pick, and a
     consumer that logs or validates on selection needs to tell them apart. */
  const reset = useCallback(() => {
    if (defaultDate === undefined) return;
    /* A `null` default clears, and reports the day it cleared: `'reset'` would
       claim a day was restored when none was. */
    if (defaultDate === null) {
      if (value == null) return;
      setValue(null, 'clear', value);
      return;
    }
    setValue(defaultDate, 'reset', defaultDate);
  }, [defaultDate, value, setValue]);

  /* Day-keys, not instants: a `minDate` carrying a time of day still leaves
     its own day selectable, which the current family gets wrong. */
  const isDateUnavailable = useCallback(
    (date: Date) => {
      const key = dayKey(date, timeZone);
      if (minDate && key < dayKey(minDate, timeZone)) return true;
      if (maxDate && key > dayKey(maxDate, timeZone)) return true;
      return isDateUnavailableProp?.(date) ?? false;
    },
    [minDate, maxDate, isDateUnavailableProp, timeZone]
  );

  /* A year the user can never scroll to is a trap, so the span stretches to
     cover the bounds even though bounds never clamp navigation. */
  const yearRange = useMemo(() => {
    if (yearRangeProp) return yearRangeProp;
    const base = today.getFullYear();
    const years = [base - DEFAULT_YEAR_SPAN, base + DEFAULT_YEAR_SPAN];
    if (minDate) years.push(minDate.getFullYear());
    if (maxDate) years.push(maxDate.getFullYear());
    return { from: Math.min(...years), to: Math.max(...years) };
  }, [yearRangeProp, today, minDate, maxDate]);

  const context = useMemo<CalendarPreviewContextValue<Date | null>>(
    () => ({
      value,
      setValue,
      defaultDate,
      reset,
      month,
      setMonth,
      yearRange,
      scale,
      setScale,
      isDateUnavailable,
      today,
      timeZone,
      clearable,
      disabled,
      readOnly
    }),
    [
      value,
      setValue,
      defaultDate,
      reset,
      month,
      setMonth,
      yearRange,
      scale,
      setScale,
      isDateUnavailable,
      today,
      timeZone,
      clearable,
      disabled,
      readOnly
    ]
  );

  /* A real element, not a bare provider: `.Days` and `.Footer` are in-flow
     siblings, and without a box of their own they inherit whatever the
     surrounding layout does — sitting side by side inside a flex row. */
  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.root, className),
        'data-slot': 'calendar-preview',
        'data-scale': scale,
        'data-disabled': disabled || undefined,
        'data-readonly': readOnly || undefined,
        children
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  return (
    <CalendarPreviewProvider
      value={context as CalendarPreviewContextValue<unknown>}
    >
      {element}
    </CalendarPreviewProvider>
  );
}

CalendarPreviewRoot.displayName = 'CalendarPreview';
