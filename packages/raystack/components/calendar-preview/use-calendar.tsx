'use client';

import { useCalendarPreviewContext } from './calendar-preview-context';
import type { CalendarPreviewScale } from './lib/scale';

export interface UseCalendarReturn {
  value: Date | null;
  /** Commit a day, or clear with `null`. Emits `onValueChange`. */
  setValue: (value: Date | null) => void;
  /* Read-only until the scale switcher lands in phase 5. Exposing a setter
     now would be a public API we cannot take back if the switcher reshapes
     it; adding one later is additive. */
  scale: CalendarPreviewScale;
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
  const { value, setValue, scale, month, setMonth, isDateUnavailable } =
    useCalendarPreviewContext('useCalendar');

  return {
    value,
    /* A null commit is a clear, and the day acted on is the day being
       cleared. Reporting `'select'` with `new Date()` broke the context's
       documented promise that `toDate()` is the day acted on — it handed back
       today, which is a day nobody touched. */
    setValue: next =>
      next === null
        ? setValue(null, 'clear', value ?? new Date())
        : setValue(next, 'select', next),
    scale,
    month,
    setMonth,
    isDateUnavailable
  };
}
