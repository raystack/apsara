'use client';

import { createContext, useContext } from 'react';

export type CalendarSelection = 'single' | 'range' | 'multiple';

export type CalendarGranularity =
  | 'day'
  | 'month'
  | 'quarter'
  | 'half-year'
  | 'year';

/** Ours, not react-day-picker's `DateRange` — that type never leaves the grid. */
export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

export type CalendarValue = Date | DateRangeValue | Date[] | null;

/** Which endpoint of a range the next grid click writes to. */
export type CalendarRangeField = 'from' | 'to';

export interface CalendarValidity {
  valid: boolean;
  reason?: 'unparseable' | 'out-of-bounds' | 'unavailable';
}

export interface CalendarPreviewContextValue<Value = CalendarValue> {
  selection: CalendarSelection;
  granularity: CalendarGranularity;
  setGranularity: (granularity: CalendarGranularity) => void;
  /** Switchable granularities. `.GranularityTabs` renders when >1. */
  granularities: CalendarGranularity[];
  value: Value;
  setValue: (value: Value) => void;
  /** The visible month. Independent of selection, and owned by the root. */
  month: Date;
  setMonth: (month: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** `'explicit'` buffers edits until `.Apply` commits them. */
  commitMode: 'immediate' | 'explicit';
  /** True when `commit='explicit'` and there are buffered edits. */
  hasPendingChanges: boolean;
  /** Commit buffered edits. A no-op under `commit='immediate'`. */
  applyValue: () => void;
  /** Discard buffered edits. A no-op under `commit='immediate'`. */
  cancelValue: () => void;
  /** Range only. Which endpoint the next grid click writes to. */
  activeField: CalendarRangeField;
  setActiveField: (field: CalendarRangeField) => void;
  /** Range only. The endpoint held read-only in both the input and the grid. */
  lock?: CalendarRangeField;
  reportValidity: (validity: CalendarValidity) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateUnavailable?: (date: Date) => boolean;
  format: string;
  timeZone?: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  disabled: boolean;
  readOnly: boolean;
}

/*
 * Stored as `unknown` and cast at the hook so the root stays generic over the
 * selection mode without a generic `createContext` — the technique
 * `combobox-root.tsx` uses.
 */
const CalendarPreviewContext =
  createContext<CalendarPreviewContextValue<unknown> | null>(null);

export const CalendarPreviewProvider = CalendarPreviewContext;

/**
 * @param part The part name, for the error message — e.g. `'Grid'`.
 */
export function useCalendarPreviewContext<Value = CalendarValue>(
  part: string
): CalendarPreviewContextValue<Value> {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(
      `CalendarPreview.${part} must be used within <CalendarPreview>`
    );
  }
  return context as CalendarPreviewContextValue<Value>;
}
