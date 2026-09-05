'use client';

import { mergeProps, Popover, useRender } from '@base-ui/react';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import { useCallback, useMemo, useRef } from 'react';
import styles from './calendar-preview.module.css';
import {
  type CalendarPreviewChangeDetails,
  type CalendarPreviewChangeReason,
  type CalendarPreviewContextValue,
  type CalendarPreviewOpenChangeDetails,
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
import { periodOf, type Scale, type ScaleValue } from './lib/scale';

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

  /** Whether the popover is open (controlled). Ignored by an inline calendar. */
  open?: boolean;
  /** @defaultValue false */
  defaultOpen?: boolean;
  /** Base UI's typed details, forwarded unchanged. */
  onOpenChange?: (
    open: boolean,
    details: CalendarPreviewOpenChangeDetails
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
   */
  defaultDate?: Date;

  /**
   * Renders a value for display.
   * @defaultValue `DD/MM/YYYY` at day scale
   */
  formatValue?: (value: Date | ScaleValue, scale: Scale) => string;
  /** Forwarded to the grid. No conversion is done here. */
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

/* Exported for its tests; `formatValue` replaces it wholesale. */
export function defaultFormatValue(
  value: Date | ScaleValue,
  scale: Scale
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
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  yearRange: yearRangeProp,
  minDate,
  maxDate,
  isDateUnavailable: isDateUnavailableProp,
  defaultDate,
  formatValue = defaultFormatValue,
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
    default: defaultMonth ?? defaultValue ?? today,
    name: 'CalendarPreview',
    state: 'month'
  });

  /* Uncontrolled until the scale switcher lands in PR 5. The state lives here
     now so the parts and `useCalendar()` read it from one place either way. */
  const [scale, setScaleUnwrapped] = useControlled<Scale>({
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

  const setValue = useCallback(
    (
      next: Date | null,
      reason: CalendarPreviewChangeReason,
      occasion: Date
    ) => {
      setValueUnwrapped(next);
      onValueChange?.(next, {
        reason,
        period: periodOf(occasion, scale),
        toDate: () => occasion
      });
    },
    [setValueUnwrapped, onValueChange, scale]
  );

  const [open, setOpenUnwrapped] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen,
    name: 'CalendarPreview',
    state: 'open'
  });

  /* Escape and a press on the trigger both leave focus on the trigger, so the
     focus event that follows would immediately undo the close. Recording the
     reason lets `.Trigger` swallow exactly that one focus — the same rule
     floating-ui's own `useFocus` applies. */
  const focusOpenBlocked = useRef(false);

  const setOpen = useCallback(
    (next: boolean, details: CalendarPreviewOpenChangeDetails) => {
      if (
        !next &&
        (details.reason === REASONS.escapeKey ||
          details.reason === REASONS.triggerPress)
      ) {
        focusOpenBlocked.current = true;
      }
      setOpenUnwrapped(next);
      onOpenChange?.(next, details);
    },
    [setOpenUnwrapped, onOpenChange]
  );

  const shouldIgnoreFocusOpen = useCallback(() => {
    if (!focusOpenBlocked.current) return false;
    focusOpenBlocked.current = false;
    return true;
  }, []);

  const setScale = useCallback(
    (next: Scale) => setScaleUnwrapped(next),
    [setScaleUnwrapped]
  );

  const reset = useCallback(() => {
    if (!defaultDate) return;
    setValue(defaultDate, 'select', defaultDate);
  }, [defaultDate, setValue]);

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
      open,
      setOpen,
      shouldIgnoreFocusOpen,
      defaultDate,
      reset,
      month,
      setMonth,
      yearRange,
      scale,
      setScale,
      isDateUnavailable,
      minDate,
      maxDate,
      today,
      timeZone,
      clearable,
      disabled,
      readOnly,
      formatValue
    }),
    [
      value,
      setValue,
      open,
      setOpen,
      shouldIgnoreFocusOpen,
      defaultDate,
      reset,
      month,
      setMonth,
      yearRange,
      scale,
      setScale,
      isDateUnavailable,
      minDate,
      maxDate,
      today,
      timeZone,
      clearable,
      disabled,
      readOnly,
      formatValue
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

  /* Base UI owns dismissal — outside press, escape and focus-out all come from
     `Popover.Root`, which is why no file here has an outside-click listener. */
  return (
    <CalendarPreviewProvider
      value={context as CalendarPreviewContextValue<unknown>}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        {element}
      </Popover.Root>
    </CalendarPreviewProvider>
  );
}

CalendarPreviewRoot.displayName = 'CalendarPreview';
