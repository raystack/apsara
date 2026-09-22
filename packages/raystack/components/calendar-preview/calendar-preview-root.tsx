'use client';

import { mergeProps, Popover, useRender } from '@base-ui/react';
import { REASONS } from '@base-ui/react/internals/reasons';
import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

/* Selection arms are discriminated on `selection`, so a single-day consumer
   keeps a `Date | null` callback and a range consumer gets a range that has
   both edges. One shared `value` type would widen both. */
interface CalendarPreviewSingleProps {
  selection?: 'single';
  scales?: 'day';
  /** The selected day (controlled). */
  value?: Date | null;
  /** The initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  onValueChange?: (
    value: Date | null,
    details: CalendarPreviewChangeDetails
  ) => void;
  /**
   * The day `.Reset` restores, read even when `value` is controlled — which
   * `defaultValue` is not. `null` is a default of *nothing selected*, so
   * `.Reset` clears; omitting it renders no button at all.
   */
  defaultDate?: Date | null;
}

interface CalendarPreviewRangeProps {
  selection: 'range';
  scales?: 'day';
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
  /**
   * The range `.Reset` restores, read even when `value` is controlled — which
   * `defaultValue` is not. `null` is a default of *nothing selected*, so
   * `.Reset` clears; omitting it renders no button at all.
   */
  defaultDate?: CalendarPreviewDateRange | null;
}

/* TypeScript cannot test an array's contents, so the arms discriminate on the
   SHAPE of `scales`: omitted or the literal `'day'` keeps `Date`, anything else
   moves to `ScaleValue`. The wart is that `scales={['day']}` takes this arm
   where `scales='day'` does not (RFC 005, Open Item 1). */
interface CalendarPreviewScaleAwareProps {
  /* A start/end pair is two roots, each with its own `scales`, so no range
     arm belongs here. */
  selection?: 'single';
  scales: Exclude<Scale, 'day'> | Scale[];
  /** The selected period (controlled). `date` is timeless `'YYYY-MM-DD'`. */
  value?: ScaleValue | null;
  /** The initially selected period (uncontrolled). */
  defaultValue?: ScaleValue | null;
  /** Called when a period is committed or cleared. */
  onValueChange?: (
    value: ScaleValue | null,
    details: CalendarPreviewChangeDetails
  ) => void;
  /** The period `.Reset` restores, read even when `value` is controlled. */
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
  /** @defaultValue the first of `scales` */
  defaultScale?: Scale;
  /** The active scale (controlled). */
  scale?: Scale;
  /** Called when the switcher moves. */
  onScaleChange?: (scale: Scale) => void;
  /**
   * Whether a period emits its last day rather than its first — an end field
   * wants 31 July from "July 2026", a start field the 1st.
   * @defaultValue false
   */
  trailingValue?: boolean;
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

  /**
   * Earliest selectable day, inclusive. Never clamps navigation. A period is
   * tested against the day it would emit, so `trailingValue` moves the answer.
   */
  minDate?: Date;
  /** Latest selectable day, inclusive. Tested as `minDate` is. */
  maxDate?: Date;
  /* Day scale only: a day predicate has no one lift to a period. Period cells
     are bounded by `minDate` / `maxDate` instead. */
  isDateUnavailable?: (date: Date) => boolean;

  /** @defaultValue `DD MMM YYYY` at day scale, the period's shorthand above it */
  formatValue?: (
    value: Date | ScaleValue,
    scale: Scale,
    timeZone?: string
  ) => string;

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
   * Whether the selection can be emptied — by clicking the selected day, or by
   * emptying an `.Input`. Day scale only for the click; clicking a selected
   * period re-commits it. Emptying one field of a range clears that endpoint
   * and leaves the other drafted.
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

/* RFC 005 line 144 keeps the switch itself silent, so the commit that lands on
   a new granularity is the only place `'scale'` can be reported. A first
   selection is a `'select'`: there is no granularity it moved away from. */
function scaleChanged(value: CalendarPreviewValue, next: Scale): boolean {
  return isScaleValue(value) && value.scale !== next;
}

/* Exported for its tests; `formatValue` replaces it wholesale. */
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
    /* `valueProp` before `defaultValue`: `defaultValue` is forced to null the
       moment `value` is controlled, so reading it alone opened a controlled
       calendar on today's month with the selection off-screen — against this
       prop's own documented default. */
    default:
      defaultMonth ??
      monthAnchor(valueProp) ??
      monthAnchor(defaultValue) ??
      today,
    name: 'CalendarPreview',
    state: 'month'
  });

  const scales = useMemo<readonly Scale[]>(() => {
    const list = (Array.isArray(scalesProp) ? scalesProp : [scalesProp]).filter(
      isScale
    );
    /* The order given is the order shown, and `scales[0]` is the default. */
    return list.length > 0 ? Array.from(new Set(list)) : ['day'];
  }, [scalesProp]);

  const [scale, setScaleUnwrapped] = useControlled<Scale>({
    controlled: scaleProp,
    /* The committed value's own scale, the way dropping a draft settles on it:
       opening a quarter on the day grid showed the selection as a day and left
       no cell marked. `valueProp` before `defaultValue`, as `month` does. */
    default:
      defaultScale ??
      (isScaleValue(valueProp)
        ? valueProp.scale
        : isScaleValue(defaultValue)
          ? defaultValue.scale
          : scales[0]),
    name: 'CalendarPreview',
    state: 'scale'
  });

  const [scaleDraft, setScaleDraftState] = useState<ScaleValue | null>(null);

  /* Escape drops the draft twice in one event — `.Body`, then the close it
     bubbles into — and state is a render behind on the second. */
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

  /* An array carries the scale even when that scale is `'day'`. */
  const carriesScale = Array.isArray(scalesProp) || scalesProp !== 'day';

  const setMonth = useCallback(
    (next: Date) => {
      setMonthUnwrapped(next);
      onMonthChange?.(next);
    },
    [setMonthUnwrapped, onMonthChange]
  );

  /* The last value this root wrote. A `value` that does not match it came
     from the consumer, which is the only kind of change a half-built draft
     has to give way to. */
  const emitted = useRef<CalendarPreviewValue>(value);

  /* The inertness guard lives here rather than in the grid's click handler:
     `useCalendar().setValue` and `reset()` reach this same function, and a
     guard further out would leave both of them able to write to a calendar
     the consumer asked to be read-only. */
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
        /* The committed scale, not the view's: typing "Q4 2026" commits a
           quarter while the view is still on days. */
        period: periodOf(
          dayKey(occasion, timeZone),
          isScaleValue(next) ? next.scale : scale
        ),
        toDate: () => occasion
      });
    },
    [setValueUnwrapped, emit, scale, timeZone, readOnly, disabled]
  );

  /* The one place a day becomes a value: a scale-aware root carries
     `{ date, scale }` at day scale too, and a click and a typed date must not
     disagree about that — writing the rule twice is how they last did. */
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
    },
    [carriesScale, timeZone, value, setValue, clearScaleDraft]
  );

  const [open, setOpenUnwrapped] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen,
    name: 'CalendarPreview',
    state: 'open'
  });

  /* A dismissal restores focus to the trigger, which would reopen it. */
  const focusOpenBlocked = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* The restore trails the close by the exit transition, so nothing timed is
     safe; what the user does next releases the guard instead. Capture phase,
     so the dismissing press runs this before the close arms it again. */
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
    /* An outside press is read on pointerdown, before focus has moved, so the
       trigger still holds it here and only the reason says it is leaving. An
       Escape that never moves focus must not arm: no focus follows it. */
    focusOpenBlocked.current =
      leaving || !triggerRef.current?.contains(document.activeElement);
  }, []);

  /* `dropDraft` closes over state declared further down. */
  const dropDraftRef = useRef<(() => void) | null>(null);

  const dismissedByOutsidePress = useRef(false);

  const setOpen = useCallback(
    (next: boolean, details: CalendarPreviewOpenChangeDetails) => {
      if (!next) {
        const outside = details.reason === REASONS.outsidePress;
        dismissedByOutsidePress.current = outside;
        armFocusGuard(outside);
        /* A draft belongs to the open popover; a commit has already cleared
           it, so this finds nothing left to drop. */
        dropDraftRef.current?.();
      }
      setOpenUnwrapped(next);
      onOpenChange?.(next, details);
    },
    [setOpenUnwrapped, onOpenChange, armFocusGuard]
  );

  /* Base UI hands the return focus to the trigger's first tabbable child when
     the trigger itself is not tabbable, which is the `.Input`. Escape still
     restores, or a keyboard user is left on `body`. */
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

  /* A draft is a range half-built against the value it started from, so a
     value the consumer set behind it leaves the grid and both inputs showing
     endpoints that are no longer anyone's. Our own writes are excluded by
     `emitted`: emptying one field sets a draft and clears the value in the
     same pass, and that draft is the whole point of it. */
  useEffect(() => {
    if (value === emitted.current) return;
    emitted.current = value;
    setDraft(null);
    setActiveField('start');
  }, [value]);

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

  const spans = useCallback(
    (from: Date, to: Date) =>
      anyDayBetween(
        dayKey(from, timeZone),
        dayKey(to, timeZone),
        isDateUnavailable
      ),
    [timeZone, isDateUnavailable]
  );

  /*
   * The from/to machine:
   *   nothing drafted    -> set from, advance to the end input
   *   to only            -> fills the from, completing unless the click
   *                         crosses it or the span is unavailable
   *   from, day earlier  -> that day becomes the new from
   *   from, day later    -> completes and emits
   *   from and to        -> restart from the new day
   *
   * It lives on the root because `.Grid` and a typed `.Input` both drive it.
   */
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
          /* The input reads the draft first, so a stale one would show. */
          clearScaleDraft();
          setValue(null, 'clear', date);
          return;
        }
        commitDay(date, 'select');
        return;
      }

      /* Falling through would restart the range from this day, which is the
         one write a read-only start refuses — so every click did nothing. */
      const fixed = fieldReadOnly.start
        ? (draft?.from ?? (isRange(value) ? value.from : undefined))
        : undefined;
      if (fixed) {
        if (fieldReadOnly.end) return;
        if (dayKey(date, timeZone) < dayKey(fixed, timeZone)) return;
        /* The start cannot move, so there is nothing to restart from. */
        if (spans(fixed, date)) return;
        setDraft(null);
        setActiveField('start');
        setValue({ from: fixed, to: date }, 'select', date);
        return;
      }

      /* An emptied field leaves its partner drafted alone; a click fills the
         hole rather than throwing the endpoint the user kept away. */
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
      /* A day the consumer marked unavailable cannot be handed back inside a
         range, so the click restarts rather than completing over it. */
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

  /* Never emits: a cell click or Enter commits the draft. */
  const switchScale = useCallback(
    (next: Scale) => {
      /* First switch of a run only: a second is still the same draft. */
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

      /* The month on screen, not today, or 2030 snaps back. */
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

  /* Routed through `setScale`, not the raw setter: a controlled `scale` only
     moves when the consumer is told to move it, so dropping a draft has to
     report the scale it settles on the way switching to one does. */
  const settleScale = useCallback(
    (next: Scale) => {
      clearScaleDraft();
      if (next !== scale) setScale(next);
    },
    [scale, setScale, clearScaleDraft]
  );

  /* The scale the run started from, not `scales[0]`: that is the default the
     root opened at, which a committed switch has already moved away from. */
  const dropDraft = useCallback(() => {
    if (scaleDraftRef.current === null) return;
    const origin = draftOrigin.current;
    /* The month moved with the draft, so leaving it where the run ended showed
       a different month than the one the run started on. */
    if (origin) setMonth(origin.month);
    settleScale(
      origin?.scale ?? (isScaleValue(value) ? value.scale : scales[0])
    );
  }, [value, scales, settleScale, setMonth]);

  dropDraftRef.current = dropDraft;

  /* Bounds only, never `isDateUnavailable` — the prop documents why. */
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

  /* A click means "the next endpoint"; typing into a field means that field,
     so a typed date cannot go through `selectDay`. */
  const setEndpoint = useCallback(
    (field: CalendarPreviewField, date: Date) => {
      if (readOnly || disabled || fieldReadOnly[field]) return;

      const base = draft ?? (isRange(value) ? value : null);
      const from = field === 'start' ? date : base?.from;
      const to = field === 'end' ? date : base?.to;

      /* An ordered pair completes. Anything else — one edge still missing, or
         a typed day that crossed its partner — keeps the day in the field it
         was typed into and waits for the other. Routing it to `from`
         regardless put a date typed into an empty end field in the start. */
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
      /* One endpoint short of a range, so nothing valid is left to emit. */
      if (isRange(value)) setValue(null, 'clear', monthAnchor(value) ?? today);
    },
    [value, draft, fieldReadOnly, readOnly, disabled, setValue, today]
  );

  /* `'reset'`, not `'select'`: restoring the default is not a pick, and a
     consumer that logs or validates on selection needs to tell them apart. */
  const reset = useCallback(() => {
    if (defaultDate === undefined) return;
    settleScale(isScaleValue(defaultDate) ? defaultDate.scale : scales[0]);
    /* A `null` default clears, and reports the day it cleared: `'reset'` would
       claim a day was restored when none was. */
    if (defaultDate === null) {
      if (value == null) return;
      setValue(null, 'clear', monthAnchor(value) ?? today);
      return;
    }
    setValue(defaultDate, 'reset', monthAnchor(defaultDate) ?? today);
  }, [defaultDate, value, scales, settleScale, setValue, today]);

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

  /* Bound here rather than at each call site: every part formats through the
     context, and a `formatValue` that never saw `timeZone` rendered the
     neighbouring day in any zone far enough from UTC. */
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
    <CalendarPreviewContext value={context}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {element}
      </Popover.Root>
    </CalendarPreviewContext>
  );
}

CalendarPreviewRoot.displayName = 'CalendarPreview';
