'use client';

import {
  type CalendarDraftRange,
  useCalendarContext
} from './calendar-context';
import { type CalendarValue, monthAnchor } from './calendar-root';
import type { Scale, ScaleValue } from './lib/scale';

export interface UseCalendarReturn {
  value: CalendarValue;
  setValue: (value: CalendarValue) => void;
  scale: Scale;
  /** Never emitted. */
  draft: CalendarDraftRange | null;
  /** Never emitted. */
  scaleDraft: ScaleValue | null;
  month: Date;
  setMonth: (month: Date) => void;
  isDateUnavailable: (date: Date) => boolean;
}

export function useCalendar(): UseCalendarReturn {
  const {
    value,
    setValue,
    scale,
    draft,
    scaleDraft,
    month,
    setMonth,
    isDateUnavailable
  } = useCalendarContext('useCalendar');

  return {
    value,
    /* A clear reports the day being cleared; `new Date()` would name a day nobody touched. */
    setValue: next =>
      next === null
        ? setValue(null, 'clear', monthAnchor(value) ?? new Date())
        : setValue(next, 'select', monthAnchor(next) ?? new Date()),
    scale,
    draft,
    scaleDraft,
    month,
    setMonth,
    isDateUnavailable
  };
}
