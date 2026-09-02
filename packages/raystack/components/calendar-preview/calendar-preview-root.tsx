'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  type CalendarGranularity,
  type CalendarPreviewContextValue,
  CalendarPreviewProvider,
  type CalendarRangeField,
  type CalendarSelection,
  type CalendarValidity,
  type CalendarValue,
  type DateRangeValue,
  isSameValue
} from './calendar-preview-context';
import { DEFAULT_FORMAT, dayKey, startOfMonth } from './date-adapter';

/**
 * Accompanies every value change with the granularity that produced it. A
 * month pick emits the first day of that month, so without this a consumer
 * cannot tell `1 June` chosen as a day from June chosen as a month — the same
 * pairing the reference app sends as `startDate` plus `startDateResolution`.
 */
export interface CalendarValueChangeDetails {
  granularity: CalendarGranularity;
}

export interface CalendarPreviewBaseProps {
  /** The active granularity (controlled). */
  granularity?: CalendarGranularity;
  /** Clamped into `granularities` when the two disagree. @defaultValue 'day' */
  defaultGranularity?: CalendarGranularity;
  onGranularityChange?: (granularity: CalendarGranularity) => void;
  /**
   * Granularities the user may switch between. `.GranularityTabs` renders
   * only when there is more than one.
   *
   * The active granularity is always one of these: a `granularity` or
   * `defaultGranularity` outside the set is clamped to the first entry.
   * @defaultValue the active granularity
   */
  granularities?: CalendarGranularity[];

  /** Whether the popover is open (controlled). */
  open?: boolean;
  /** @defaultValue false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details?: { reason?: string }) => void;

  /** The visible month (controlled). Independent of the selected value. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  minDate?: Date;
  maxDate?: Date;
  /**
   * Covers the common predicate without learning RDP's matcher DSL.
   *
   * Wrap it in `useCallback`: `.MonthGrid` keys its period memo on this, so an
   * inline predicate rebuilds every cell on every render.
   */
  isDateUnavailable?: (date: Date) => boolean;

  /** @defaultValue 'DD MMM YYYY' */
  format?: string;
  timeZone?: string;
  /** @defaultValue 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Reports whether the typed input currently parses and lands in range.
   * Renders no error UI itself — compose in `Field` for that.
   */
  onValidityChange?: (validity: CalendarValidity) => void;

  /**
   * `'immediate'` fires `onValueChange` on every interaction. `'explicit'`
   * buffers edits until `.Apply` commits them, which is what makes a footer
   * with actions expressible.
   * @defaultValue 'immediate'
   */
  commit?: 'immediate' | 'explicit';

  /**
   * Replaces the caption and the grid with a shimmer and disables every
   * control, rather than leaving the chrome live while the grid loads.
   * @defaultValue false
   */
  loading?: boolean;

  /** @defaultValue false */
  disabled?: boolean;
  /** @defaultValue false */
  readOnly?: boolean;
  children?: ReactNode;
}

export interface CalendarPreviewSingleProps extends CalendarPreviewBaseProps {
  selection?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (
    value: Date | null,
    details: CalendarValueChangeDetails
  ) => void;
}

export interface CalendarPreviewRangeProps extends CalendarPreviewBaseProps {
  selection: 'range';
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onValueChange?: (
    value: DateRangeValue | null,
    details: CalendarValueChangeDetails
  ) => void;
  /**
   * Holds one endpoint read-only in both the input and the grid, so "fix the
   * start, pick the end" no longer means disabling the whole picker.
   */
  lock?: CalendarRangeField;
}

export interface CalendarPreviewMultipleProps extends CalendarPreviewBaseProps {
  selection: 'multiple';
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (value: Date[], details: CalendarValueChangeDetails) => void;
}

export type CalendarPreviewRootProps =
  | CalendarPreviewSingleProps
  | CalendarPreviewRangeProps
  | CalendarPreviewMultipleProps;

/**
 * The union collapsed into one shape, for internal use only. Reading `props`
 * as the union directly would narrow `selection` to `'single'`, making the
 * other arms unreachable inside the body.
 */
interface NormalizedRootProps extends CalendarPreviewBaseProps {
  selection?: CalendarSelection;
  lock?: CalendarRangeField;
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (
    value: CalendarValue,
    details: CalendarValueChangeDetails
  ) => void;
}

/** The earliest date a value of any selection mode carries, if any. */
function firstDateIn(value: CalendarValue | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  return value.from ?? value.to ?? undefined;
}

export function CalendarPreviewRoot(props: CalendarPreviewRootProps) {
  const {
    selection = 'single',
    granularity: granularityProp,
    defaultGranularity = 'day',
    onGranularityChange,
    granularities,
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    lock,
    commit: commitMode = 'immediate',
    onValidityChange,
    minDate,
    maxDate,
    isDateUnavailable,
    format = DEFAULT_FORMAT,
    timeZone,
    weekStartsOn = 0,
    loading = false,
    disabled: disabledProp = false,
    readOnly = false,
    children
  } = props as NormalizedRootProps;

  /*
   * Loading disables everything by folding into `disabled` here, once. Asking
   * each part to check both flags would mean one of them eventually forgetting.
   */
  const disabled = disabledProp || loading;

  const [value, setValueUnwrapped] = useControlled<CalendarValue>({
    controlled: valueProp,
    default: defaultValue ?? (selection === 'multiple' ? [] : null),
    name: 'CalendarPreview',
    state: 'value'
  });

  const [open, setOpenUnwrapped] = useControlled<boolean>({
    controlled: openProp,
    default: defaultOpen,
    name: 'CalendarPreview',
    state: 'open'
  });

  /*
   * The visible month is independent state, but it has to *start* somewhere
   * sensible: a picker holding a date in another year must not open on today.
   * Both `DatePicker` and `RangePicker` sync this today; only the mechanism
   * changes here.
   */
  /*
   * Computed once. `useControlled` reads `default` as the initial value and
   * warns if it changes, so deriving it from a live `value` on every render
   * both trips that warning and risks re-initialising the visible month
   * underneath the user.
   */
  const initialMonth = useRef<Date>(null);
  if (initialMonth.current === null) {
    initialMonth.current = startOfMonth(
      defaultMonth ?? firstDateIn(valueProp ?? defaultValue) ?? new Date(),
      timeZone
    );
  }

  const [month, setMonthUnwrapped] = useControlled<Date>({
    controlled: monthProp,
    default: initialMonth.current,
    name: 'CalendarPreview',
    state: 'month'
  });

  const [granularity, setGranularityUnwrapped] =
    useControlled<CalendarGranularity>({
      controlled: granularityProp,
      default: defaultGranularity,
      name: 'CalendarPreview',
      state: 'granularity'
    });

  /*
   * The offered set is the authority on what the picker can show, so the
   * granularity is clamped into it. Nothing reconciled the two before, and
   * their defaults disagree: `granularities={['month','quarter']}` left the
   * granularity at its `'day'` default — no tab selected, the day grid
   * rendered for a set excluding it, and clicks committing
   * `{granularity: 'day'}` from a picker with no day view.
   *
   * The context and `granularityRef` both read this, not the raw state.
   */
  const activeGranularity =
    granularities &&
    granularities.length > 0 &&
    !granularities.includes(granularity)
      ? granularities[0]
      : granularity;

  /*
   * Defaults to just the active granularity, so a single-granularity picker
   * shows no tabs and the active one is always present in the list.
   */
  const offeredGranularities = useMemo(
    () =>
      granularities && granularities.length > 0
        ? granularities
        : [activeGranularity],
    [granularities, activeGranularity]
  );

  const setGranularity = useCallback(
    (next: CalendarGranularity) => {
      setGranularityUnwrapped(next);
      onGranularityChange?.(next);
    },
    [setGranularityUnwrapped, onGranularityChange]
  );

  /*
   * Under `commit='explicit'` every part writes here instead of to the real
   * value, so the popover can be abandoned without the parent ever seeing the
   * intermediate states. `undefined` means "nothing buffered".
   */
  const [buffer, setBuffer] = useState<CalendarValue | undefined>(undefined);
  // The granularity the buffered value was picked at, so `.Apply` reports it.
  const [bufferGranularity, setBufferGranularity] = useState<
    CalendarGranularity | undefined
  >(undefined);

  const effectiveValue = buffer === undefined ? value : buffer;

  /*
   * Read through a ref, not closed over. The active granularity is only ever
   * the fallback for a value change that does not name one, so depending on it
   * turned `setValue`'s identity over — and with it the whole context object —
   * every time the tab changed. Reading it at call time is also the more
   * correct of the two: it cannot be a stale closure.
   */
  const granularityRef = useRef(activeGranularity);
  granularityRef.current = activeGranularity;

  /*
   * A committed value clears any standing complaint.
   *
   * `reportValidity` was only ever called by the three typed fields, so an
   * `{valid: false}` latched forever: type rubbish, then pick 5 April in the
   * grid, and a consumer's last and only validity still read
   * `reason: 'unparseable'` beside a perfectly good value — with
   * `aria-invalid` stuck on the input and no user action short of retyping into
   * that same field able to clear it. Every writer that reaches here has
   * produced a value the component accepted, which is exactly what "valid"
   * means; the fields still report their own failures before they get here.
   */
  const setValue = useCallback(
    (next: CalendarValue, details?: { granularity?: string }) => {
      const resolved = (details?.granularity ??
        granularityRef.current) as CalendarGranularity;
      onValidityChange?.({ valid: true });
      if (commitMode === 'explicit') {
        setBuffer(next);
        setBufferGranularity(resolved);
        return;
      }
      setValueUnwrapped(next);
      onValueChange?.(next, { granularity: resolved });
    },
    [commitMode, setValueUnwrapped, onValueChange, onValidityChange]
  );

  const applyValue = useCallback(() => {
    if (commitMode !== 'explicit' || buffer === undefined) return;
    setValueUnwrapped(buffer);
    onValueChange?.(buffer, {
      granularity: bufferGranularity ?? granularityRef.current
    });
    setBuffer(undefined);
    setBufferGranularity(undefined);
  }, [commitMode, buffer, bufferGranularity, setValueUnwrapped, onValueChange]);

  const cancelValue = useCallback(() => {
    setBuffer(undefined);
    setBufferGranularity(undefined);
  }, []);

  /*
   * Revert-to-default. `defaultValue` is read live rather than captured at
   * mount, so it works for a controlled picker too: there it means "the value
   * to revert to" rather than "the initial value".
   */
  const canReset =
    defaultValue != null && !isSameValue(effectiveValue, defaultValue);

  const resetValue = useCallback(() => {
    if (defaultValue == null) return;
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  const setOpen = useCallback(
    (next: boolean, details?: { reason?: string }) => {
      setOpenUnwrapped(next);
      onOpenChange?.(next, details);
    },
    [setOpenUnwrapped, onOpenChange]
  );

  const setMonth = useCallback(
    (next: Date) => {
      setMonthUnwrapped(next);
      onMonthChange?.(next);
    },
    [setMonthUnwrapped, onMonthChange]
  );

  /*
   * The initial month above is computed once, which is right for a mount and
   * wrong forever after: a value that arrived asynchronously was never shown,
   * and reopening the popover left the user wherever they had last navigated
   * rather than back on the selection.
   *
   * So the visible month follows the value at exactly two moments, and only
   * while the consumer is not driving `month` themselves — on the closed → open
   * transition, and when the value's anchor day changes. Never while the
   * popover sits open with that anchor unchanged, because then it is the user
   * navigating and their navigation has to win.
   *
   * Every comparison goes through `dayKey`, never `Date` identity: a fresh
   * `Date` for the same day must not count as a change, or this becomes the
   * render loop the RFC diagnosed in `DatePicker`.
   */
  const anchorDate = firstDateIn(effectiveValue);
  const anchorKey = anchorDate ? dayKey(anchorDate, timeZone) : null;
  const previousOpen = useRef(open);
  const previousAnchorKey = useRef(anchorKey);

  useEffect(() => {
    const justOpened = open && !previousOpen.current;
    const anchorChanged = anchorKey !== previousAnchorKey.current;
    previousOpen.current = open;
    previousAnchorKey.current = anchorKey;

    if (monthProp !== undefined) return;
    // Clearing a value must not yank an open calendar back to today.
    if (!justOpened && !(anchorChanged && anchorDate)) return;

    const target = startOfMonth(
      anchorDate ?? defaultMonth ?? new Date(),
      timeZone
    );
    /*
     * Compared as months, not as days. `.Input` and `.Preset` move the month
     * by handing over the date the user named, mid-month and all; normalising
     * that here would fire a second `onMonthChange` for one action and report
     * a month change that nobody can see.
     */
    if (
      dayKey(target, timeZone) ===
      dayKey(startOfMonth(month, timeZone), timeZone)
    )
      return;
    setMonth(target);
  }, [
    open,
    anchorKey,
    anchorDate,
    month,
    monthProp,
    defaultMonth,
    timeZone,
    setMonth
  ]);

  const handleOpenChange = useCallback(
    (next: boolean, eventDetails: PopoverPrimitive.Root.ChangeEventDetails) => {
      // A disabled picker cannot be opened, only closed.
      if (next && disabled) return;
      // Abandoning the surface discards buffered edits; only `.Apply` keeps
      // them. Closing via `.Apply` clears the buffer before this runs.
      if (!next) {
        setBuffer(undefined);
        setBufferGranularity(undefined);
      }
      setOpen(next, { reason: eventDetails?.reason });
    },
    [setOpen, disabled]
  );

  /*
   * Internal, per State Ownership in the RFC: `.RangeInput` reads it to know
   * which field is being edited, and `.Grid` to know which endpoint a click
   * writes. A locked endpoint can never become active.
   */
  const [activeFieldState, setActiveFieldState] = useState<CalendarRangeField>(
    lock === 'from' ? 'to' : 'from'
  );

  const activeField = lock
    ? lock === 'from'
      ? 'to'
      : 'from'
    : activeFieldState;

  const setActiveField = useCallback(
    (field: CalendarRangeField) => {
      if (lock === field) return;
      setActiveFieldState(field);
    },
    [lock]
  );

  /*
   * Counted rather than flagged: `.RangeInput` mounts two fields, and a
   * composition may hold more than one input. Registration happens in a child
   * effect, so the flag is false for the first commit — irrelevant for the
   * click-to-open path, which is every real use, and `initialFocus` stays
   * overridable for a picker that opens already mounted.
   */
  const [triggerFieldCount, setTriggerFieldCount] = useState(0);

  const registerTriggerField = useCallback(() => {
    setTriggerFieldCount(count => count + 1);
    return () => setTriggerFieldCount(count => count - 1);
  }, []);

  const reportValidity = useCallback(
    (validity: CalendarValidity) => onValidityChange?.(validity),
    [onValidityChange]
  );

  /*
   * One context object, so any state change re-renders every part — a month
   * step re-renders `.Presets`, `.GranularityTabs`, `.TimeField` and
   * `.Footer` too.
   *
   * Splitting stable actions from volatile state was considered and does not
   * pay here: those parts all read state as well as actions, so they would
   * still subscribe to the volatile half. The shape that would actually fix it
   * is a store read through selectors, which is an architecture change rather
   * than a tuning one, and no part of this component is expensive enough to
   * render to justify it — `.MonthGrid`, the one that was, now resolves its
   * cells in a memo. The action identities above are stable, which is the
   * prerequisite if that day comes.
   */
  const contextValue = useMemo<CalendarPreviewContextValue>(
    () => ({
      selection,
      granularity: activeGranularity,
      setGranularity,
      granularities: offeredGranularities,
      value: effectiveValue,
      setValue,
      month,
      setMonth,
      open,
      setOpen,
      commitMode,
      hasPendingChanges: buffer !== undefined,
      canReset,
      resetValue,
      applyValue,
      cancelValue,
      activeField,
      setActiveField,
      lock,
      reportValidity,
      minDate,
      maxDate,
      isDateUnavailable,
      format,
      timeZone,
      weekStartsOn,
      loading,
      disabled,
      readOnly,
      triggerOwnsFocus: triggerFieldCount > 0,
      registerTriggerField
    }),
    [
      selection,
      activeGranularity,
      setGranularity,
      offeredGranularities,
      effectiveValue,
      setValue,
      month,
      setMonth,
      open,
      setOpen,
      commitMode,
      buffer,
      canReset,
      resetValue,
      applyValue,
      cancelValue,
      activeField,
      setActiveField,
      lock,
      reportValidity,
      minDate,
      maxDate,
      isDateUnavailable,
      format,
      timeZone,
      weekStartsOn,
      loading,
      disabled,
      readOnly,
      triggerFieldCount,
      registerTriggerField
    ]
  );

  /*
   * `Popover.Root` renders no element, so wrapping unconditionally costs
   * nothing and keeps dismissal with Base UI even when the composition has no
   * popover at all (parts rendered outside `.Content` are simply inline).
   * This is the whole reason `use-picker-popover.ts` has no successor.
   */
  return (
    <CalendarPreviewProvider
      value={contextValue as CalendarPreviewContextValue<unknown>}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        {children}
      </PopoverPrimitive.Root>
    </CalendarPreviewProvider>
  );
}

CalendarPreviewRoot.displayName = 'CalendarPreview';
