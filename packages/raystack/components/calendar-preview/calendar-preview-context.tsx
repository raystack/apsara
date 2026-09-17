'use client';

import type { Popover } from '@base-ui/react';
import { createContext, type RefObject, useContext } from 'react';
import type { DayKey } from './date-adapter';
import type { Scale, ScaleValue } from './lib/scale';

/** What caused a value to change. */
export type CalendarPreviewChangeReason =
  | 'select'
  | 'input'
  | 'clear'
  | 'reset'
  /** A commit that lands on a different granularity than the value carried. */
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

/** A range mid-build. Either edge may be absent: `to` until the second click
    lands, `from` once a field has been emptied. */
export interface CalendarPreviewDraftRange {
  from?: Date;
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

/* The widened value every arm shares. The public props discriminate on
   `selection` and `scales`; the implementation works in the union. */
export type CalendarPreviewValue =
  | Date
  | CalendarPreviewDateRange
  | ScaleValue
  | null;

export interface CalendarPreviewContextValue {
  value: CalendarPreviewValue;
  /** `occasion` is the day acted on, which a cleared `value` cannot carry. */
  setValue: (
    value: CalendarPreviewValue,
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
  triggerRef: RefObject<HTMLElement | null>;
  /** Read even when `value` is controlled. */
  defaultDate: Date | CalendarPreviewDateRange | ScaleValue | null | undefined;
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

  /** One entry hides `.Scales`. */
  scales: readonly Scale[];
  trailingValue: boolean;
  /** Never emitted: a cell click or Enter commits it, Escape drops it. */
  scaleDraft: ScaleValue | null;
  switchScale: (scale: Scale) => void;
  selectPeriod: (date: Date | string, scale: Scale) => void;
  dropDraft: () => void;
  isPeriodAvailable: (date: Date | string, scale: Scale) => boolean;

  selection: 'single' | 'range';
  /**
   * Commits a clicked day. Single scale commits it directly; range runs the
   * from/to machine.
   */
  selectDay: (date: Date) => void;
  /** Writes a day at the root's value shape, for a path that is not a click. */
  commitDay: (date: Date, reason: CalendarPreviewChangeReason) => void;
  /** Writes one named endpoint, for a typed `.Input`. */
  setEndpoint: (field: CalendarPreviewField, date: Date) => void;
  /** Empties one endpoint, leaving the other drafted. */
  clearEndpoint: (field: CalendarPreviewField) => void;
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

export const CalendarPreviewContext =
  createContext<CalendarPreviewContextValue | null>(null);

/* `part` is the caller's display name, so the throw points at the element the
   author wrote rather than at this file. */
export function useCalendarPreviewContext(
  part: string
): CalendarPreviewContextValue {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview>`);
  }
  return context;
}

/* `.Days` owns this rather than the root, so two day views in one tree cannot
   disable each other's navigation. */
export interface CalendarPreviewDaysContextValue {
  numberOfMonths: number;
  busy: boolean;
  setBusy: (busy: boolean) => void;
}

export const CalendarPreviewDaysContext =
  createContext<CalendarPreviewDaysContextValue | null>(null);

export function useCalendarPreviewDaysContext(): CalendarPreviewDaysContextValue | null {
  return useContext(CalendarPreviewDaysContext);
}
