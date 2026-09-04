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
  /** Both edges, month-end correct. At day scale they are the same day. */
  period: { start: DayKey; end: DayKey };
  /**
   * The day acted on — never null, even when `value` is, so a clear still says
   * which cell the user clicked.
   */
  toDate: () => Date;
}

/* Generic so a later phase's scale-aware arms carry a `ScaleValue` without a
   second context: stored as `unknown`, cast once at the hook boundary. */
export interface CalendarPreviewContextValue<Value = Date | null> {
  value: Value;
  /** `occasion` is the day acted on, which a cleared `value` cannot carry. */
  setValue: (
    value: Value,
    reason: CalendarPreviewChangeReason,
    occasion: Date
  ) => void;
  /** Read even when `value` is controlled. */
  defaultDate: Date | undefined;
  /** A value reset — it never moves the view. */
  reset: () => void;
  month: Date;
  /** Never clamped by `minDate` / `maxDate`. */
  setMonth: (month: Date) => void;
  yearRange: { from: number; to: number };
  scale: Scale;
  setScale: (scale: Scale) => void;
  isDateUnavailable: (date: Date) => boolean;
  today: Date;
  timeZone: string | undefined;
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
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

/* `part` is the caller's display name, so the throw points at the element the
   author wrote rather than at this file. */
export function useCalendarPreviewContext<Value = Date | null>(
  part: string
): CalendarPreviewContextValue<Value> {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview>`);
  }
  return context as CalendarPreviewContextValue<Value>;
}

/* `.Days` owns this rather than the root, so two day views in one tree cannot
   disable each other's navigation. */
export interface CalendarPreviewDaysContextValue {
  numberOfMonths: number;
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

export function useCalendarPreviewDaysContext(): CalendarPreviewDaysContextValue | null {
  return useContext(CalendarPreviewDaysContext);
}
