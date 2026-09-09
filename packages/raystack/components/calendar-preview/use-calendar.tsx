'use client';

import { useCalendarPreviewContext } from './calendar-preview-context';
import type { CalendarPreviewValue } from './calendar-preview-root';
import type { CalendarPreviewScale } from './lib/scale';

export interface UseCalendarReturn {
  /* Holds a range at `selection='range'`. */
  value: CalendarPreviewValue;
  /** Commit a day or a range, or clear with `null`. Emits `onValueChange`. */
  setValue: (value: CalendarPreviewValue) => void;
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
    useCalendarPreviewContext<CalendarPreviewValue>('useCalendar');

  return {
    value,
    /* A null commit is a clear, and the day acted on is the day being
       cleared. Reporting `'select'` with `new Date()` broke the context's
       documented promise that `toDate()` is the day acted on — it handed back
       today, which is a day nobody touched. `occasion` is one day either way,
       so a range reports the day it starts on. */
    setValue: next =>
      next === null
        ? setValue(
            null,
            'clear',
            (value instanceof Date ? value : value?.from) ?? new Date()
          )
        : setValue(next, 'select', next instanceof Date ? next : next.from),
    scale,
    month,
    setMonth,
    isDateUnavailable
  };
}
