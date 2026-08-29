'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { useControlled } from '@base-ui/utils/useControlled';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
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
  /** @defaultValue 'day' */
  granularity?: CalendarGranularity;

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

export function CalendarPreviewRoot(props: CalendarPreviewRootProps) {
  const {
    selection = 'single',
    granularity = 'day',
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

  const [month, setMonthUnwrapped] = useControlled<Date>({
    controlled: monthProp,
    default: startOfMonth(defaultMonth ?? new Date(), timeZone),
    name: 'CalendarPreview',
    state: 'month'
  });

  const setValue = useCallback(
    (next: CalendarValue) => {
      setValueUnwrapped(next);
      onValueChange?.(next);
    },
    [setValueUnwrapped, onValueChange]
  );

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
      setOpen(next, { reason: eventDetails?.reason });
    },
    [setOpen]
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
      value,
      setValue,
      month,
      setMonth,
      open,
      setOpen,
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
      value,
      setValue,
      month,
      setMonth,
      open,
      setOpen,
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
