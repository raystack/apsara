'use client';

import { useCalendarPreviewContext } from './calendar-preview-context';
import type { Scale } from './lib/scale';

export interface UseCalendarReturn {
  /** The committed day, or `null`. */
  value: Date | null;
  /** Commit a day, or clear with `null`. Emits `onValueChange`. */
  setValue: (value: Date | null) => void;
  /** The granularity the value is committed at. */
  scale: Scale;
  setScale: (scale: Scale) => void;
  /** The first month the grid displays. */
  month: Date;
  /** Move the view. Bounds never clamp it. */
  setMonth: (month: Date) => void;
  /** Whether a day is out of bounds or rejected by `isDateUnavailable`. */
  isDateUnavailable: (date: Date) => boolean;
}

/**
 * The enclosing `CalendarPreview`'s state, for building parts the library does
 * not ship.
 *
 * Deliberately narrow: everything returned here is public API covered by
 * semver, so it carries the value, the scale, the view month, their setters
 * and the availability predicate — and nothing else.
 */
export function useCalendar(): UseCalendarReturn {
  const {
    value,
    setValue,
    scale,
    setScale,
    month,
    setMonth,
    isDateUnavailable
  } = useCalendarPreviewContext('useCalendar');

  return {
    value,
    setValue: next => setValue(next, 'select', next ?? new Date()),
    scale,
    setScale,
    month,
    setMonth,
    isDateUnavailable
  };
}
