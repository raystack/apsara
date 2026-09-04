'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { DayKey } from './date-adapter';
import type { Scale, ScaleValue } from './lib/scale';

/** What caused a value to change. */
export type CalendarPreviewChangeReason =
  | 'select'
  | 'input'
  | 'clear'
  | 'scale';

export interface CalendarPreviewChangeDetails {
  /** What caused the change. */
  reason: CalendarPreviewChangeReason;
  /**
   * Both edges of the period the change occasioned, as `'YYYY-MM-DD'`.
   *
   * Month-end correct — February 2028 ends `2028-02-29`. At day scale the two
   * edges are the same day.
   */
  period: { start: DayKey; end: DayKey };
  /**
   * The day this change was made from, as a `Date`.
   *
   * On a select it is the new value. On a clear it is the day that was clicked
   * to deselect, so a consumer can always tell which cell the user acted on —
   * it is never null, even when `value` is.
   */
  toDate: () => Date;
}

/**
 * Everything the parts read. One object, owned by the root.
 *
 * `Value` is generic so the scale-aware arms in a later phase can carry a
 * `ScaleValue` without a second context; it is stored as `unknown` on the
 * context and cast once, at the hook boundary — the shape `Combobox` uses.
 */
export interface CalendarPreviewContextValue<Value = Date | null> {
  /** The committed value. */
  value: Value;
  /** Commit a value and emit `onValueChange`. `occasion` is the day acted on. */
  setValue: (
    value: Value,
    reason: CalendarPreviewChangeReason,
    occasion: Date
  ) => void;
  /** The reset target. Read even when `value` is controlled. */
  defaultDate: Date | undefined;
  /** Restore `defaultDate`. A value reset — it never moves the view. */
  reset: () => void;
  /** The first month the grid displays. */
  month: Date;
  /** Move the view. Never clamped by `minDate` / `maxDate`. */
  setMonth: (month: Date) => void;
  /** The years the caption's year column offers. */
  yearRange: { from: number; to: number };
  /** The granularity the value is committed at. */
  scale: Scale;
  setScale: (scale: Scale) => void;
  /** `true` when the date is out of bounds or the consumer rejected it. */
  isDateUnavailable: (date: Date) => boolean;
  /** Today, injectable so tests are not clock-dependent. */
  today: Date;
  /** Forwarded to the grid. No conversion is done here. */
  timeZone: string | undefined;
  /** Whether a committed value can be deselected back to `null`. */
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
  /** Renders a value for display. Used by the trigger and input parts. */
  formatValue: (value: Date | ScaleValue, scale: Scale) => string;
}

const CalendarPreviewContext =
  createContext<CalendarPreviewContextValue<unknown> | null>(null);

export function CalendarPreviewProvider({
  value,
  children
}: {
  value: CalendarPreviewContextValue<unknown>;
  children: ReactNode;
}) {
  return (
    <CalendarPreviewContext value={value}>{children}</CalendarPreviewContext>
  );
}

/**
 * The root's state, or a throw naming the part that asked for it.
 *
 * `part` is the display name of the caller, so the error points at the element
 * the author actually wrote rather than at this file.
 */
export function useCalendarPreviewContext<Value = Date | null>(
  part: string
): CalendarPreviewContextValue<Value> {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview>`);
  }
  return context as CalendarPreviewContextValue<Value>;
}

/**
 * State shared between `.Header` and `.Grid`, provided by their common parent.
 *
 * `.Days` owns it rather than the root so two day views in one tree cannot
 * disable each other's navigation. Absent when a part is used outside `.Days`.
 */
export interface CalendarPreviewDaysContextValue {
  numberOfMonths: number;
  /** Whether the grid inside this `.Days` is loading. */
  busy: boolean;
  setBusy: (busy: boolean) => void;
}

const CalendarPreviewDaysContext =
  createContext<CalendarPreviewDaysContextValue | null>(null);

export function CalendarPreviewDaysProvider({
  value,
  children
}: {
  value: CalendarPreviewDaysContextValue;
  children: ReactNode;
}) {
  return (
    <CalendarPreviewDaysContext value={value}>
      {children}
    </CalendarPreviewDaysContext>
  );
}

/** The enclosing `.Days` state, or `null` when there is no `.Days` above. */
export function useCalendarPreviewDaysContext(): CalendarPreviewDaysContextValue | null {
  return useContext(CalendarPreviewDaysContext);
}
