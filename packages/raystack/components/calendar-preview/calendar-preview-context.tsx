'use client';

import type { Popover } from '@base-ui/react';
import { createContext, type ReactNode, useContext } from 'react';
import type { DayKey } from './date-adapter';
import type { Scale, ScaleValue } from './lib/scale';

/** What caused a value to change. */
export type CalendarPreviewChangeReason =
  | 'select'
  | 'input'
  | 'clear'
  | 'scale';

export type CalendarPreviewOpenChangeDetails = Popover.Root.ChangeEventDetails;

/** Which endpoint a range `.Input` addresses. */
export type CalendarPreviewField = 'start' | 'end';

/**
 * A completed range. Neither edge is nullable: a range that is still being
 * built is a draft, and drafts are never emitted.
 */
export interface CalendarPreviewDateRange {
  from: Date;
  to: Date;
}

/** A range mid-build. `to` is absent until the second click lands. */
export interface CalendarPreviewDraftRange {
  from: Date;
  to?: Date;
}

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
  /** Whether the popover is open. Always `false` for an inline calendar. */
  open: boolean;
  /**
   * Base UI's own details, forwarded rather than re-declared, so `reason` stays
   * the typed union Base UI narrows on.
   */
  setOpen: (open: boolean, details: CalendarPreviewOpenChangeDetails) => void;
  /**
   * Whether `.Trigger` must swallow the next focus-open, because the close it
   * would undo was an Escape or a press on the trigger itself. Reads and
   * clears. Tracks the last close reason, never the open state.
   */
  shouldIgnoreFocusOpen: () => boolean;
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
  /* Separate from `isDateUnavailable`, which folds them together: `.Input`
     reports which of the two rejected a typed date. */
  minDate: Date | undefined;
  maxDate: Date | undefined;
  today: Date;
  timeZone: string | undefined;
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
  formatValue: (value: Date | ScaleValue, scale: Scale) => string;

  selection: 'single' | 'range';
  /**
   * Commits a clicked day. Single scale commits it directly; range runs the
   * from/to machine, which lives here because completing a range both writes
   * the value and closes the popover.
   */
  selectDay: (date: Date) => void;
  /**
   * The range as the grid should draw it — the draft while one is being built,
   * the committed value otherwise. Never emitted; the track between endpoints
   * is styled from it.
   */
  draft: CalendarPreviewDraftRange | null;
  /** The endpoint the next click fills. `.Input` reads it to show focus. */
  activeField: CalendarPreviewField;
  setActiveField: (field: CalendarPreviewField) => void;
  /**
   * Which endpoints a `.Input` has declared read-only, so a grid click cannot
   * rewrite one. Registered by the inputs, because `readOnly` is their prop.
   */
  fieldReadOnly: Record<CalendarPreviewField, boolean>;
  setFieldReadOnly: (field: CalendarPreviewField, readOnly: boolean) => void;
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
