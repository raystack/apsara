'use client';

import {
  type CalendarPreviewDraftRange,
  useCalendarPreviewContext
} from './calendar-preview-context';
import {
  type CalendarPreviewValue,
  monthAnchor
} from './calendar-preview-root';
import type { Scale, ScaleValue } from './lib/scale';

export interface UseCalendarReturn {
  value: CalendarPreviewValue;
  setValue: (value: CalendarPreviewValue) => void;
  scale: Scale;
  /** Never emitted. */
  draft: CalendarPreviewDraftRange | null;
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
  } = useCalendarPreviewContext('useCalendar');

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
