'use client';

import { mergeProps, Popover, useRender } from '@base-ui/react';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './calendar-preview.module.css';
import {
  type CalendarPreviewChangeDetails,
  type CalendarPreviewChangeReason,
  CalendarPreviewContext,
  type CalendarPreviewContextValue,
  type CalendarPreviewDateRange,
  type CalendarPreviewDraftRange,
  type CalendarPreviewField,
  type CalendarPreviewOpenChangeDetails,
  type CalendarPreviewValue
} from './calendar-preview-context';
import {
  anyDayBetween,
  dayKey,
  formatDayLabel,
  formatMonthLabel,
  monthOf,
  parseKey,
  yearOf
} from './date-adapter';
import {
  anchorOf,
  convertScale,
  isAvailable,
  isScale,
  periodOf,
  type Scale,
  type ScaleValue
} from './lib/scale';

const DEFAULT_YEAR_SPAN = 10;

export function isRange(value: unknown): value is CalendarPreviewDateRange {
  return value != null && typeof value === 'object' && 'from' in value;
}

export function monthAnchor(
  value: CalendarPreviewValue | undefined
): Date | undefined {
  if (!value) return undefined;
  if (isRange(value)) return value.from;
  return value instanceof Date ? value : parseKey(value.date);
}

export type { CalendarPreviewValue };

export function isScaleValue(
  value: CalendarPreviewValue | undefined
): value is ScaleValue {
  return value != null && !(value instanceof Date) && 'date' in value;
}

/* Each arm repeats the same JSDoc, so the docs table shows one description per prop. */
interface CalendarPreviewSingleProps {
  /**
   * Whether the grid picks one day or a range of days.
   * @default "single"
   */
  selection?: 'single';
  /**
   * The scales the root offers. One scale hides the switcher. An array, or a scale other than `"day"`, makes the value `{ date, scale }`.
   * @default "day"
   */
  scales?: 'day';
  /**
   * The value (controlled): a `Date`, a `{ from, to }` range at `selection="range"`, or a `{ date, scale }` period with a `YYYY-MM-DD` date.
   */
  value?: Date | null;
  /**
   * The initial value (uncontrolled). Same shape as `value`.
   * @default null
   */
  defaultValue?: Date | null;
  /**
   * Called when the value is committed or cleared. A range is reported only when complete. `details.toDate()` returns the day acted on.
   */
  onValueChange?: (
    value: Date | null,
    details: CalendarPreviewChangeDetails
  ) => void;
  /**
   * The value `.Reset` restores, read even when `value` is controlled. `null` makes `.Reset` clear the value. Without it, `.Reset` renders nothing.
   */
  defaultDate?: Date | null;
}

interface CalendarPreviewRangeProps {
  /**
   * Whether the grid picks one day or a range of days.
   * @default "single"
   */
  selection: 'range';
  /**
   * The scales the root offers. One scale hides the switcher. An array, or a scale other than `"day"`, makes the value `{ date, scale }`.
   * @default "day"
   */
  scales?: 'day';
  /**
   * The value (controlled): a `Date`, a `{ from, to }` range at `selection="range"`, or a `{ date, scale }` period with a `YYYY-MM-DD` date.
   */
  value?: CalendarPreviewDateRange | null;
  /**
   * The initial value (uncontrolled). Same shape as `value`.
   * @default null
   */
  defaultValue?: CalendarPreviewDateRange | null;
  /**
   * Called when the value is committed or cleared. A range is reported only when complete. `details.toDate()` returns the day acted on.
   */
  onValueChange?: (
    value: CalendarPreviewDateRange | null,
    details: CalendarPreviewChangeDetails
  ) => void;
  /**
   * The value `.Reset` restores, read even when `value` is controlled. `null` makes `.Reset` clear the value. Without it, `.Reset` renders nothing.
   */
  defaultDate?: CalendarPreviewDateRange | null;
}

/* On the SHAPE of `scales`, so `scales={['day']}` takes this arm and `scales='day'` does not. */
interface CalendarPreviewScaleAwareProps {
  /**
   * Whether the grid picks one day or a range of days.
   * @default "single"
   */
  selection?: 'single';
  /**
   * The scales the root offers. One scale hides the switcher. An array, or a scale other than `"day"`, makes the value `{ date, scale }`.
   * @default "day"
   */
  scales: Exclude<Scale, 'day'> | Scale[];
  /**
   * The value (controlled): a `Date`, a `{ from, to }` range at `selection="range"`, or a `{ date, scale }` period with a `YYYY-MM-DD` date.
   */
  value?: ScaleValue | null;
  /**
   * The initial value (uncontrolled). Same shape as `value`.
   * @default null
   */
  defaultValue?: ScaleValue | null;
  /**
   * Called when the value is committed or cleared. A range is reported only when complete. `details.toDate()` returns the day acted on.
   */
  onValueChange?: (
    value: ScaleValue | null,
    details: CalendarPreviewChangeDetails
  ) => void;
  /**
   * The value `.Reset` restores, read even when `value` is controlled. `null` makes `.Reset` clear the value. Without it, `.Reset` renders nothing.
   */
  defaultDate?: ScaleValue | null;
}

export type CalendarPreviewProps = (
  | CalendarPreviewSingleProps
  | CalendarPreviewRangeProps
  | CalendarPreviewScaleAwareProps
) &
  CalendarPreviewSharedProps;

interface CalendarPreviewSharedProps
  extends Omit<useRender.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /**
   * The scale the root opens on (uncontrolled). Defaults to the scale of the value, else the first of `scales`.
   */
  defaultScale?: Scale;
  /** The active scale (controlled). */
  scale?: Scale;
  /** Called when the active scale changes. */
  onScaleChange?: (scale: Scale) => void;
  /**
   * Whether a period's value is its last day instead of its first.
   * @default false
   */
  trailingValue?: boolean;
  /** Whether the popover is open (controlled). An inline calendar ignores it. */
  open?: boolean;
  /**
   * Whether the popover is open at first (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes, with Base UI's event details. */
  onOpenChange?: (
    open: boolean,
    details: CalendarPreviewOpenChangeDetails
  ) => void;

  /** The first month the grid shows (controlled). */
  month?: Date;
  /**
   * The month the grid opens on (uncontrolled). Defaults to the month of the value, else `today`.
   */
  defaultMonth?: Date;
  /** Called when the visible month changes. */
  onMonthChange?: (month: Date) => void;
  /**
   * The years the period views and the caption's year column offer. Defaults to ten years either side of `today`, widened to cover `minDate` and `maxDate`. A passed range is not widened.
   */
  yearRange?: { from: number; to: number };

  /**
   * The earliest selectable day, inclusive. It does not limit navigation. A period is tested against the day it emits.
   */
  minDate?: Date;
  /**
   * The latest selectable day, inclusive. It does not limit navigation. A period is tested against the day it emits.
   */
  maxDate?: Date;
  /**
   * Returns `true` for a day that cannot be selected, in addition to `minDate` and `maxDate`. Period views do not call it.
   */
  isDateUnavailable?: (date: Date) => boolean;

  /**
   * Formats a value for the trigger, the input and the annotations. It gets `timeZone` as the third argument. Defaults to `DD MMM YYYY` at day scale, and to the period's short form above it.
   */
  formatValue?: (
    value: Date | ScaleValue,
    scale: Scale,
    timeZone?: string
  ) => string;

  /**
   * The time zone the calendar reads days in. Every `Date` is an instant, so build the dates of a zoned calendar with `Date.UTC`.
   */
  timeZone?: string;
  /** The date the calendar treats as today. Defaults to `new Date()`. */
  today?: Date;
  /**
   * Whether clicking the selected day or emptying the input clears the value. Clicking a selected period commits it again.
   * @default true
   */
  clearable?: boolean;
  /**
   * Whether the calendar is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the value can be read and navigated but not changed.
   * @default false
   */
  readOnly?: boolean;
}

function scaleChanged(value: CalendarPreviewValue, next: Scale): boolean {
  return isScaleValue(value) && value.scale !== next;
}

export function defaultFormatValue(
  value: Date | ScaleValue,
  scale: Scale,
  timeZone?: string
): string {
  const date = value instanceof Date ? value : parseKey(value.date);
  if (scale === 'day') return formatDayLabel(date, timeZone);
  if (scale === 'month') return formatMonthLabel(date, timeZone);

  const key = dayKey(date, timeZone);
  const year = yearOf(key);
  if (scale === 'year') return String(year);
  const month = monthOf(key);
  if (scale === 'quarter') return `Q${Math.floor((month - 1) / 3) + 1} ${year}`;
  return `H${month <= 6 ? 1 : 2} ${year}`;
}

export function CalendarPreviewRoot({
  selection = 'single',
  scales: scalesProp = 'day',
  scale: scaleProp,
  defaultScale,
  onScaleChange,
  trailingValue = false,
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
  formatValue: formatValueProp = defaultFormatValue,
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

  /* Read once: a controlled `value` that starts empty would otherwise move the default. */
  const [initialMonth] = useState(
    () =>
      /* `valueProp` first: `defaultValue` is nulled once `value` is controlled. */
      defaultMonth ??
      monthAnchor(valueProp) ??
      monthAnchor(defaultValue) ??
      today
  );

  const [month, setMonthUnwrapped] = useControlled<Date>({
    controlled: monthProp,
    default: initialMonth,
    name: 'CalendarPreview',
    state: 'month'
  });

  const scales = useMemo<readonly Scale[]>(() => {
    const list = (Array.isArray(scalesProp) ? scalesProp : [scalesProp]).filter(
      isScale
    );
    return list.length > 0 ? Array.from(new Set(list)) : ['day'];
  }, [scalesProp]);

  const [initialScale] = useState<Scale>(
    () =>
      /* The value's own scale, or a quarter opens on the day grid unmarked. */
      defaultScale ??
      (isScaleValue(valueProp)
        ? valueProp.scale
        : isScaleValue(defaultValue)
          ? defaultValue.scale
          : scales[0])
  );

  const [scale, setScaleUnwrapped] = useControlled<Scale>({
    controlled: scaleProp,
    default: initialScale,
    name: 'CalendarPreview',
    state: 'scale'
  });

  const [scaleDraft, setScaleDraftState] = useState<ScaleValue | null>(null);

  /* Escape drops the draft twice in one event; state is a render behind. */
  const scaleDraftRef = useRef<ScaleValue | null>(null);

  const setScaleDraft = useCallback((next: ScaleValue | null) => {
    scaleDraftRef.current = next;
    setScaleDraftState(next);
  }, []);

  const draftOrigin = useRef<{
    value: ScaleValue | null;
    month: Date;
    scale: Scale;
  } | null>(null);

  const clearScaleDraft = useCallback(() => {
    setScaleDraft(null);
    draftOrigin.current = null;
  }, [setScaleDraft]);

  const carriesScale = Array.isArray(scalesProp) || scalesProp !== 'day';

  /* A typed date can land outside the visible month; a click cannot. */
  const revealMonthRef = useRef<((date: Date) => void) | null>(null);

  const setMonth = useCallback(
    (next: Date) => {
      setMonthUnwrapped(next);
      onMonthChange?.(next);
    },
    [setMonthUnwrapped, onMonthChange]
  );

  const emitted = useRef<CalendarPreviewValue>(value);

  const setValue = useCallback(
    (
      next: CalendarPreviewValue,
      reason: CalendarPreviewChangeReason,
      occasion: Date
    ) => {
      if (readOnly || disabled) return;
      emitted.current = next;
      setValueUnwrapped(next);
      emit?.(next, {
        reason,
        period: periodOf(
          dayKey(occasion, timeZone),
          isScaleValue(next) ? next.scale : scale
        ),
        toDate: () => occasion
      });
    },
    [setValueUnwrapped, emit, scale, timeZone, readOnly, disabled]
  );

  const commitDay = useCallback(
    (date: Date, reason: CalendarPreviewChangeReason) => {
      const key = dayKey(date, timeZone);
      clearScaleDraft();
      if (!carriesScale) {
        setValue(date, reason, date);
        return;
      }
      setValue(
        { date: key, scale: 'day' },
        scaleChanged(value, 'day') ? 'scale' : reason,
        date
      );
      /* The view follows what was committed, or it has no cell to mark. */
      settleScaleRef.current?.('day');
      revealMonthRef.current?.(date);
    },
    [carriesScale, timeZone, value, setValue, clearScaleDraft]
  );

  const [open, setOpenUnwrapped] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen,
    name: 'CalendarPreview',
    state: 'open'
  });

  const focusOpenBlocked = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* The restore trails the close by the exit transition, so nothing timed is safe. */
  useEffect(() => {
    const release = () => {
      focusOpenBlocked.current = false;
    };
    document.addEventListener('pointerdown', release, true);
    document.addEventListener('keydown', release, true);
    return () => {
      document.removeEventListener('pointerdown', release, true);
      document.removeEventListener('keydown', release, true);
    };
  }, []);

  const armFocusGuard = useCallback((leaving: boolean) => {
    /* Read on pointerdown, before focus has moved, so only the reason says it is leaving. */
    focusOpenBlocked.current =
      leaving || !triggerRef.current?.contains(document.activeElement);
  }, []);

  /* `dropDraft` and `settleScale` close over state declared further down. */
  const dropDraftRef = useRef<(() => void) | null>(null);
  const settleScaleRef = useRef<((scale: Scale) => void) | null>(null);

  const dismissedByOutsidePress = useRef(false);
  const closingThroughSetOpen = useRef(false);

  const setOpen = useCallback(
    (next: boolean, details: CalendarPreviewOpenChangeDetails) => {
      closingThroughSetOpen.current = !next;
      if (!next) {
        const outside = details.reason === REASONS.outsidePress;
        dismissedByOutsidePress.current = outside;
        armFocusGuard(outside);
        dropDraftRef.current?.();
        /* A controlled parent can keep `open`, so the mark must not outlive this close. */
        setTimeout(() => {
          closingThroughSetOpen.current = false;
        });
      }
      setOpenUnwrapped(next);
      onOpenChange?.(next, details);
    },
    [setOpenUnwrapped, onOpenChange, armFocusGuard]
  );

  /* A controlled `open` can close without `setOpen`, and the focus Base UI gives back would reopen it. */
  const wasOpen = useRef(open);
  useLayoutEffect(() => {
    if (wasOpen.current && !open && !closingThroughSetOpen.current) {
      dismissedByOutsidePress.current = false;
      armFocusGuard(false);
      dropDraftRef.current?.();
    }
    closingThroughSetOpen.current = false;
    wasOpen.current = open;
  }, [open, armFocusGuard]);

  /* Base UI returns focus to the trigger's first tabbable child — the `.Input`. */
  const shouldRestoreFinalFocus = useCallback(
    () => !dismissedByOutsidePress.current,
    []
  );

  const shouldIgnoreFocusOpen = useCallback(() => {
    if (!focusOpenBlocked.current) return false;
    focusOpenBlocked.current = false;
    return true;
  }, []);

  const setScale = useCallback(
    (next: Scale) => {
      setScaleUnwrapped(next);
      onScaleChange?.(next);
    },
    [setScaleUnwrapped, onScaleChange]
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

  const [triggerHasInput, setTriggerHasInputState] = useState(false);

  const setTriggerHasInput = useCallback((next: boolean) => {
    setTriggerHasInputState(current => (current === next ? current : next));
  }, []);

  useEffect(() => {
    if (value === emitted.current) return;
    emitted.current = value;
    setDraft(null);
    setActiveField('start');
  }, [value]);

  /* Day-keys, so a `minDate` carrying a time of day leaves its own day selectable. */
  const isDateUnavailable = useCallback(
    (date: Date) => {
      /* The December 9999 grid runs into 10000, which has no day key. */
      let key: string;
      try {
        key = dayKey(date, timeZone);
      } catch {
        return true;
      }
      if (minDate && key < dayKey(minDate, timeZone)) return true;
      if (maxDate && key > dayKey(maxDate, timeZone)) return true;
      return isDateUnavailableProp?.(date) ?? false;
    },
    [minDate, maxDate, isDateUnavailableProp, timeZone]
  );

  const spans = useCallback(
    (from: Date, to: Date) =>
      anyDayBetween(
        dayKey(from, timeZone),
        dayKey(to, timeZone),
        isDateUnavailable
      ),
    [timeZone, isDateUnavailable]
  );

  const selectDay = useCallback(
    (date: Date) => {
      if (readOnly || disabled) return;

      if (selection === 'single') {
        const key = dayKey(date, timeZone);
        const current = isScaleValue(value)
          ? value.date
          : value instanceof Date
            ? dayKey(value, timeZone)
            : null;
        if (current === key && clearable) {
          clearScaleDraft();
          setValue(null, 'clear', date);
          return;
        }
        commitDay(date, 'select');
        return;
      }

      const fixed = fieldReadOnly.start
        ? (draft?.from ?? (isRange(value) ? value.from : undefined))
        : undefined;
      if (fixed) {
        if (fieldReadOnly.end) return;
        if (dayKey(date, timeZone) < dayKey(fixed, timeZone)) return;
        if (spans(fixed, date)) return;
        setDraft(null);
        setActiveField('start');
        setValue({ from: fixed, to: date }, 'select', date);
        return;
      }

      const lone = draft && !draft.from ? draft.to : undefined;
      if (lone) {
        if (fieldReadOnly.start) return;
        const ordered = dayKey(date, timeZone) <= dayKey(lone, timeZone);
        if (!ordered || spans(date, lone)) {
          setDraft({ from: date });
          setActiveField('end');
          return;
        }
        setDraft(null);
        setActiveField('start');
        setValue({ from: date, to: lone }, 'select', date);
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
      if (spans(from, date)) {
        setDraft({ from: date });
        return;
      }
      setDraft(null);
      setActiveField('start');
      setValue({ from, to: date }, 'select', date);
    },
    [
      selection,
      value,
      draft,
      fieldReadOnly,
      clearable,
      commitDay,
      clearScaleDraft,
      timeZone,
      readOnly,
      disabled,
      spans,
      setValue
    ]
  );

  const scaleValue = useMemo<ScaleValue | null>(() => {
    if (scaleDraft) return scaleDraft;
    if (value instanceof Date) return { date: dayKey(value, timeZone), scale };
    if (isScaleValue(value)) return value;
    return null;
  }, [scaleDraft, value, scale, timeZone]);

  const switchScale = useCallback(
    (next: Scale) => {
      if (scaleDraft === null) {
        draftOrigin.current = { value: scaleValue, month, scale };
      }
      const origin = draftOrigin.current ?? { value: scaleValue, month, scale };

      if (next === origin.scale) {
        clearScaleDraft();
        setMonth(origin.month);
        setScale(next);
        return;
      }

      const anchor = origin.value ?? {
        date: dayKey(origin.month, timeZone),
        scale: origin.scale
      };
      setScaleDraft(convertScale(anchor, next, trailingValue));
      setMonth(parseKey(convertScale(anchor, next, false).date));
      setScale(next);
    },
    [
      scaleValue,
      scaleDraft,
      month,
      timeZone,
      scale,
      trailingValue,
      clearScaleDraft,
      setMonth,
      setScale,
      setScaleDraft
    ]
  );

  const selectPeriod = useCallback(
    (date: Date | string, next: Scale) => {
      if (readOnly || disabled) return;
      const key = anchorOf(
        periodOf(
          typeof date === 'string' ? date : dayKey(date, timeZone),
          next
        ),
        trailingValue
      );
      clearScaleDraft();
      setValue(
        { date: key, scale: next },
        scaleChanged(value, next) ? 'scale' : 'select',
        parseKey(key)
      );
      settleScaleRef.current?.(next);
      revealMonthRef.current?.(parseKey(key));
    },
    [
      trailingValue,
      timeZone,
      readOnly,
      disabled,
      value,
      setValue,
      clearScaleDraft
    ]
  );

  /* Through `setScale`: a controlled `scale` moves only when told. */
  const settleScale = useCallback(
    (next: Scale) => {
      clearScaleDraft();
      if (next !== scale) setScale(next);
    },
    [scale, setScale, clearScaleDraft]
  );

  const dropDraft = useCallback(() => {
    if (scaleDraftRef.current === null) return;
    const origin = draftOrigin.current;
    if (origin) setMonth(origin.month);
    settleScale(
      origin?.scale ?? (isScaleValue(value) ? value.scale : scales[0])
    );
  }, [value, scales, settleScale, setMonth]);

  dropDraftRef.current = dropDraft;
  settleScaleRef.current = settleScale;
  revealMonthRef.current = (date: Date) => {
    if (
      dayKey(date, timeZone).slice(0, 7) === dayKey(month, timeZone).slice(0, 7)
    )
      return;
    setMonth(date);
  };

  const isPeriodAvailable = useCallback(
    (date: Date | string, next: Scale) =>
      isAvailable(
        typeof date === 'string' ? date : dayKey(date, timeZone),
        next,
        {
          trailing: trailingValue,
          min: minDate && dayKey(minDate, timeZone),
          max: maxDate && dayKey(maxDate, timeZone)
        }
      ),
    [trailingValue, minDate, maxDate, timeZone]
  );

  const setEndpoint = useCallback(
    (field: CalendarPreviewField, date: Date) => {
      if (readOnly || disabled || fieldReadOnly[field]) return;

      const base = draft ?? (isRange(value) ? value : null);
      const from = field === 'start' ? date : base?.from;
      const to = field === 'end' ? date : base?.to;

      if (from && to && dayKey(from, timeZone) <= dayKey(to, timeZone)) {
        setDraft(null);
        setActiveField('start');
        setValue({ from, to }, 'input', date);
        return;
      }
      setDraft(field === 'start' ? { from: date } : { to: date });
      setActiveField(field === 'start' ? 'end' : 'start');
    },
    [value, draft, fieldReadOnly, timeZone, readOnly, disabled, setValue]
  );

  const clearEndpoint = useCallback(
    (field: CalendarPreviewField) => {
      if (readOnly || disabled || fieldReadOnly[field]) return;
      const base = draft ?? (isRange(value) ? value : null);
      const kept = field === 'start' ? { to: base?.to } : { from: base?.from };
      setDraft(kept.from || kept.to ? kept : null);
      setActiveField(field);
      if (isRange(value)) setValue(null, 'clear', monthAnchor(value) ?? today);
    },
    [value, draft, fieldReadOnly, readOnly, disabled, setValue, today]
  );

  const reset = useCallback(() => {
    if (defaultDate === undefined) return;
    settleScale(isScaleValue(defaultDate) ? defaultDate.scale : scales[0]);
    if (defaultDate === null) {
      if (value == null) return;
      setValue(null, 'clear', monthAnchor(value) ?? today);
      return;
    }
    setValue(defaultDate, 'reset', monthAnchor(defaultDate) ?? today);
  }, [defaultDate, value, scales, settleScale, setValue, today]);

  /* Stretches to cover the bounds; a year you cannot scroll to is a trap. */
  const yearRange = useMemo(() => {
    if (yearRangeProp) return yearRangeProp;
    const base = today.getFullYear();
    const years = [base - DEFAULT_YEAR_SPAN, base + DEFAULT_YEAR_SPAN];
    if (minDate) years.push(minDate.getFullYear());
    if (maxDate) years.push(maxDate.getFullYear());
    return { from: Math.min(...years), to: Math.max(...years) };
  }, [yearRangeProp, today, minDate, maxDate]);

  /* Bound here, or a `formatValue` without `timeZone` renders the neighbouring day. */
  const formatValue = useCallback(
    (value: Date | ScaleValue, scale: Scale) =>
      formatValueProp(value, scale, timeZone),
    [formatValueProp, timeZone]
  );

  const context = useMemo<CalendarPreviewContextValue>(
    () => ({
      value,
      setValue,
      scales,
      trailingValue,
      scaleDraft,
      switchScale,
      selectPeriod,
      dropDraft,
      isPeriodAvailable,
      selection,
      selectDay,
      commitDay,
      setEndpoint,
      clearEndpoint,
      draft: draft ?? (isRange(value) ? value : null),
      activeField,
      setActiveField,
      fieldReadOnly,
      setFieldReadOnly,
      open,
      setOpen,
      shouldIgnoreFocusOpen,
      shouldRestoreFinalFocus,
      triggerRef,
      triggerHasInput,
      setTriggerHasInput,
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
      scales,
      trailingValue,
      scaleDraft,
      switchScale,
      selectPeriod,
      dropDraft,
      isPeriodAvailable,
      selection,
      selectDay,
      commitDay,
      setEndpoint,
      clearEndpoint,
      draft,
      activeField,
      fieldReadOnly,
      setFieldReadOnly,
      open,
      setOpen,
      shouldIgnoreFocusOpen,
      shouldRestoreFinalFocus,
      triggerHasInput,
      setTriggerHasInput,
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

  /* Base UI owns dismissal, which is why no file here listens for outside clicks. */
  return (
    <CalendarPreviewContext value={context}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {element}
      </Popover.Root>
    </CalendarPreviewContext>
  );
}

CalendarPreviewRoot.displayName = 'CalendarPreview';
