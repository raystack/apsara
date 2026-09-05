'use client';

import { mergeProps, Popover, useRender } from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './calendar-preview.module.css';
import {
  type CalendarPreviewChangeDetails,
  type CalendarPreviewChangeReason,
  type CalendarPreviewContextValue,
  type CalendarPreviewDateRange,
  type CalendarPreviewDraftRange,
  type CalendarPreviewField,
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

function isRange(value: unknown): value is CalendarPreviewDateRange {
  return value != null && typeof value === 'object' && 'from' in value;
}

/* The day the view should open on, whichever selection shape the value is. */
function monthAnchor(value: CalendarPreviewValue): Date | undefined {
  if (!value) return undefined;
  return isRange(value) ? value.from : value;
}

/* `defaultValue` is omitted because `HTMLAttributes` already declares it as a
   form value, which is not what it means here. */
type CalendarPreviewValue = Date | CalendarPreviewDateRange | null;

/* Selection arms are discriminated on `selection`, so a single-day consumer
   keeps a `Date | null` callback and a range consumer gets a range that has
   both edges. One shared `value` type would widen both. */
interface CalendarPreviewSingleProps {
  selection?: 'single';
  /** The selected day (controlled). */
  value?: Date | null;
  /** The initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  onValueChange?: (
    value: Date | null,
    details: CalendarPreviewChangeDetails
  ) => void;
}

interface CalendarPreviewRangeProps {
  selection: 'range';
  /** The selected range (controlled). Both edges, or nothing. */
  value?: CalendarPreviewDateRange | null;
  /** The initial range (uncontrolled). */
  defaultValue?: CalendarPreviewDateRange | null;
  /**
   * Fires on a **complete** range or not at all. The half-built state stays
   * internal, so there is no partial `{ from?, to? }` to gate on.
   */
  onValueChange?: (
    value: CalendarPreviewDateRange | null,
    details: CalendarPreviewChangeDetails
  ) => void;
}

export type CalendarPreviewProps = (
  | CalendarPreviewSingleProps
  | CalendarPreviewRangeProps
) &
  CalendarPreviewSharedProps;

interface CalendarPreviewSharedProps
  extends Omit<useRender.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
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
  selection = 'single',
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

  /* The public props are discriminated on `selection`; the implementation is
     shared and works in the widened value. This is the one seam between them. */
  const emit = onValueChange as
    | ((
        value: CalendarPreviewValue,
        details: CalendarPreviewChangeDetails
      ) => void)
    | undefined;

  const [value, setValueUnwrapped] = useControlled<CalendarPreviewValue>({
    controlled: valueProp,
    default: defaultValue,
    name: 'CalendarPreview',
    state: 'value'
  });

  const [month, setMonthUnwrapped] = useControlled<Date>({
    controlled: monthProp,
    default: defaultMonth ?? monthAnchor(defaultValue) ?? today,
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
      next: CalendarPreviewValue,
      reason: CalendarPreviewChangeReason,
      occasion: Date
    ) => {
      setValueUnwrapped(next);
      emit?.(next, {
        reason,
        period: periodOf(occasion, scale),
        toDate: () => occasion
      });
    },
    [setValueUnwrapped, emit, scale]
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

  const [draft, setDraft] = useState<CalendarPreviewDraftRange | null>(null);
  const [activeField, setActiveField] = useState<CalendarPreviewField>('start');
  const [fieldReadOnly, setFieldReadOnlyState] = useState<
    Record<CalendarPreviewField, boolean>
  >({ start: false, end: false });

  const setFieldReadOnly = useCallback(
    (field: CalendarPreviewField, next: boolean) => {
      setFieldReadOnlyState(current =>
        current[field] === next ? current : { ...current, [field]: next }
      );
    },
    []
  );

  /*
   * The from/to machine, unchanged from the shipped picker:
   *   no from            -> set from, advance to the end input
   *   from, day earlier  -> that day becomes the new from
   *   from, day later    -> completes, emits, closes
   *   from and to        -> restart from the new day
   *
   * It lives on the root because completing a range both writes the value and
   * closes the popover, and closing has to go through `setOpen` so a consumer
   * controlling `open` is not fought.
   */
  const selectDay = useCallback(
    (date: Date) => {
      if (readOnly || disabled) return;

      if (selection === 'single') {
        const isSame =
          value instanceof Date &&
          dayKey(value, timeZone) === dayKey(date, timeZone);
        if (isSame && clearable) setValue(null, 'clear', date);
        else setValue(date, 'select', date);
        return;
      }

      const from = draft?.from;
      if (!from || draft?.to) {
        if (fieldReadOnly.start) return;
        setDraft({ from: date });
        setActiveField('end');
        return;
      }

      if (dayKey(date, timeZone) < dayKey(from, timeZone)) {
        if (fieldReadOnly.start) return;
        setDraft({ from: date });
        return;
      }

      if (fieldReadOnly.end) return;
      setDraft(null);
      setActiveField('start');
      setValue({ from, to: date }, 'select', date);
      setOpen(
        false,
        createChangeEventDetails(REASONS.itemPress, undefined, undefined)
      );
    },
    [
      selection,
      value,
      draft,
      fieldReadOnly,
      clearable,
      timeZone,
      readOnly,
      disabled,
      setValue,
      setOpen
    ]
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

  const context = useMemo<CalendarPreviewContextValue<CalendarPreviewValue>>(
    () => ({
      value,
      setValue,
      selection,
      selectDay,
      draft: draft ?? (isRange(value) ? value : null),
      activeField,
      setActiveField,
      fieldReadOnly,
      setFieldReadOnly,
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
      selection,
      selectDay,
      draft,
      activeField,
      fieldReadOnly,
      setFieldReadOnly,
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
