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
  /** The committed value, or `null`. It has the shape of the root's `value`. */
  value: CalendarPreviewValue;
  /** Commits a value, or clears it with `null`. Calls `onValueChange`. */
  setValue: (value: CalendarPreviewValue) => void;
  /** The active scale. `.Scales` and `.Scale` change it. */
  scale: Scale;
  /** The range being built, else the committed range, at `selection="range"`. It is never emitted. */
  draft: CalendarPreviewDraftRange | null;
  /** The period a scale switch holds before a commit. It is never emitted. */
  scaleDraft: ScaleValue | null;
  /** The first month the grid shows. */
  month: Date;
  /** Moves the view. The bounds do not limit it. */
  setMonth: (month: Date) => void;
  /** Returns `true` for a day that is out of bounds or rejected by `isDateUnavailable`. */
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
