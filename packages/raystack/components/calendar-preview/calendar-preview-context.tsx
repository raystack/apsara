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
  /**
   * `range-order` is reported by `.TimeField` only: it is the one writer that
   * can invert a range without changing either day, by moving a time past the
   * opposite endpoint inside the shared day.
   */
  reason?: 'unparseable' | 'out-of-bounds' | 'unavailable' | 'range-order';
}

export interface CalendarPreviewContextValue<Value = CalendarValue> {
  selection: CalendarSelection;
  granularity: CalendarGranularity;
  setGranularity: (granularity: CalendarGranularity) => void;
  /** Switchable granularities. `.GranularityTabs` renders when >1. */
  granularities: CalendarGranularity[];
  value: Value;
  /**
   * `granularity` names the one that produced the value, for when it differs
   * from the active one — typing `Q4` into a day field switches the tab and
   * commits in the same breath, and the reported detail must be the new one,
   * not the stale closure's.
   */
  setValue: (value: Value, details?: { granularity?: string }) => void;
  /** The visible month. Independent of selection, and owned by the root. */
  month: Date;
  setMonth: (month: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** `'explicit'` buffers edits until `.Apply` commits them. */
  commitMode: 'immediate' | 'explicit';
  /** True when `commit='explicit'` and there are buffered edits. */
  hasPendingChanges: boolean;
  /**
   * True when a `defaultValue` was given and the current value differs from
   * it — the condition under which `.Nav` offers its revert button.
   */
  canReset: boolean;
  /** Restore `defaultValue`. A no-op when nothing was given to revert to. */
  resetValue: () => void;
  /** Commit buffered edits. A no-op under `commit='immediate'`. */
  applyValue: () => void;
  /** Discard buffered edits. A no-op under `commit='immediate'`. */
  cancelValue: () => void;
  /**
   * Range only. Which endpoint the next `.MonthGrid` or `.TimeField` write
   * lands on, tracked from focus in `.RangeInput`. `.Grid` does not read it:
   * react-day-picker's own range machine decides which end a day click moves,
   * and it agrees with the focused field in the cases that matter.
   */
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
  /**
   * Already folded into `disabled`, so no part needs to check both. Read it
   * only to decide whether to render a skeleton in place of content.
   */
  loading: boolean;
  disabled: boolean;
  readOnly: boolean;
  /**
   * True while a typed field is mounted inside `.Trigger`. Three things turn
   * on it: the trigger stops claiming button semantics it must not have around
   * a textbox, a click inside that field stops toggling an open popover, and
   * `.Content` declines the initial focus it would otherwise steal from the
   * field the user is typing into.
   */
  triggerOwnsFocus: boolean;
  /**
   * Called by a typed field that finds itself inside `.Trigger`. Returns its
   * own unregister, so it is used straight as an effect cleanup.
   */
  registerTriggerField: () => () => void;
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

/*
 * A second, deliberately tiny context, provided by `.Trigger` over its own
 * subtree only. It answers one question the root cannot — *where* a typed
 * field is composed, not merely that one exists — because `.Input` is equally
 * valid inside `.Content`, where none of the trigger's adjustments apply.
 */
const CalendarPreviewTriggerScopeContext = createContext(false);

export const CalendarPreviewTriggerScope =
  CalendarPreviewTriggerScopeContext.Provider;

/** True when the calling part is composed inside `.Trigger`. */
export function useInsideTrigger(): boolean {
  return useContext(CalendarPreviewTriggerScopeContext);
}

/**
 * Value equality across all three selection modes, compared on the exact
 * instant so a time-of-day edit counts as a change.
 */
export function isSameValue(a: CalendarValue, b: CalendarValue): boolean {
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
