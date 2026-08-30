'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  type CalendarGranularity,
  type CalendarPreviewContextValue,
  CalendarPreviewProvider,
  type CalendarRangeField,
  type CalendarSelection,
  type CalendarValidity,
  type CalendarValue,
  type DateRangeValue
} from './calendar-preview-context';
import { DEFAULT_FORMAT, startOfMonth } from './date-adapter';

export interface CalendarPreviewBaseProps {
  /** The active granularity (controlled). */
  granularity?: CalendarGranularity;
  /** @defaultValue 'day' */
  defaultGranularity?: CalendarGranularity;
  onGranularityChange?: (granularity: CalendarGranularity) => void;
  /**
   * Granularities the user may switch between. `.GranularityTabs` renders
   * only when there is more than one.
   * @defaultValue ['day']
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
  /** Covers the common predicate without learning RDP's matcher DSL. */
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
  onValueChange?: (value: Date | null) => void;
}

export interface CalendarPreviewRangeProps extends CalendarPreviewBaseProps {
  selection: 'range';
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
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
  onValueChange?: (value: Date[]) => void;
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
  onValueChange?: (value: CalendarValue) => void;
}

/**
 * Value equality across all three selection modes, compared on the exact
 * instant so a time-of-day edit counts as a change.
 */
function isSameValue(a: CalendarValue, b: CalendarValue): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((item, index) => item.getTime() === b[index]?.getTime())
    );
  }
  if (a instanceof Date || b instanceof Date || Array.isArray(a)) return false;
  const left = a as DateRangeValue;
  const right = b as DateRangeValue;
  const same = (x: Date | null, y: Date | null) =>
    x === y || (!!x && !!y && x.getTime() === y.getTime());
  return same(left.from, right.from) && same(left.to, right.to);
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
    disabled = false,
    readOnly = false,
    children
  } = props as NormalizedRootProps;

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
   * Defaults to just the active granularity, so a single-granularity picker
   * shows no tabs and the active one is always present in the list.
   */
  const offeredGranularities = useMemo(
    () =>
      granularities && granularities.length > 0 ? granularities : [granularity],
    [granularities, granularity]
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

  const effectiveValue = buffer === undefined ? value : buffer;

  const setValue = useCallback(
    (next: CalendarValue) => {
      if (commitMode === 'explicit') {
        setBuffer(next);
        return;
      }
      setValueUnwrapped(next);
      onValueChange?.(next);
    },
    [commitMode, setValueUnwrapped, onValueChange]
  );

  const applyValue = useCallback(() => {
    if (commitMode !== 'explicit' || buffer === undefined) return;
    setValueUnwrapped(buffer);
    onValueChange?.(buffer);
    setBuffer(undefined);
  }, [commitMode, buffer, setValueUnwrapped, onValueChange]);

  const cancelValue = useCallback(() => setBuffer(undefined), []);

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

  const handleOpenChange = useCallback(
    (next: boolean, eventDetails: PopoverPrimitive.Root.ChangeEventDetails) => {
      // A disabled picker cannot be opened, only closed.
      if (next && disabled) return;
      // Abandoning the surface discards buffered edits; only `.Apply` keeps
      // them. Closing via `.Apply` clears the buffer before this runs.
      if (!next) setBuffer(undefined);
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

  const reportValidity = useCallback(
    (validity: CalendarValidity) => onValidityChange?.(validity),
    [onValidityChange]
  );

  const contextValue = useMemo<CalendarPreviewContextValue>(
    () => ({
      selection,
      granularity,
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
      disabled,
      readOnly
    }),
    [
      selection,
      granularity,
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
      disabled,
      readOnly
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
