'use client';

import { useCalendarPreviewContext } from './calendar-preview-context';
import type { Scale } from './lib/scale';

export interface UseCalendarReturn {
  value: Date | null;
  /** Commit a day, or clear with `null`. Emits `onValueChange`. */
  setValue: (value: Date | null) => void;
  scale: Scale;
  setScale: (scale: Scale) => void;
  month: Date;
  /** Bounds never clamp the view. */
  setMonth: (month: Date) => void;
  isDateUnavailable: (date: Date) => boolean;
}

/**
 * The enclosing `CalendarPreview`'s state, for building parts the library does
 * not ship. Deliberately narrow — everything returned here is semver-covered.
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
