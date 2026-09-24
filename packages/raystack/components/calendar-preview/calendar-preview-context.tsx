'use client';

import type { Popover } from '@base-ui/react';
import { createContext, type RefObject, useContext } from 'react';
import type { DayKey } from './date-adapter';
import type { Scale, ScaleValue } from './lib/scale';

export type CalendarPreviewChangeReason =
  | 'select'
  | 'input'
  | 'clear'
  | 'reset'
  | 'scale';

export type CalendarPreviewOpenChangeDetails = Popover.Root.ChangeEventDetails;

export type CalendarPreviewField = 'start' | 'end';

export interface CalendarPreviewDateRange {
  from: Date;
  to: Date;
}

export interface CalendarPreviewDraftRange {
  from?: Date;
  to?: Date;
}

export interface CalendarPreviewChangeDetails {
  reason: CalendarPreviewChangeReason;
  period: { start: DayKey; end: DayKey };
  toDate: () => Date;
}

export type CalendarPreviewValue =
  | Date
  | CalendarPreviewDateRange
  | ScaleValue
  | null;

export interface CalendarPreviewContextValue {
  value: CalendarPreviewValue;
  setValue: (
    value: CalendarPreviewValue,
    reason: CalendarPreviewChangeReason,
    occasion: Date
  ) => void;
  open: boolean;
  setOpen: (open: boolean, details: CalendarPreviewOpenChangeDetails) => void;
  shouldIgnoreFocusOpen: () => boolean;
  shouldRestoreFinalFocus: () => boolean;
  triggerRef: RefObject<HTMLElement | null>;
  triggerHasInput: boolean;
  setTriggerHasInput: (hasInput: boolean) => void;
  defaultDate: Date | CalendarPreviewDateRange | ScaleValue | null | undefined;
  reset: () => void;
  month: Date;
  setMonth: (month: Date) => void;
  yearRange: { from: number; to: number };
  scale: Scale;
  setScale: (scale: Scale) => void;
  isDateUnavailable: (date: Date) => boolean;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  today: Date;
  timeZone: string | undefined;
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
  formatValue: (value: Date | ScaleValue, scale: Scale) => string;

  scales: readonly Scale[];
  trailingValue: boolean;
  scaleDraft: ScaleValue | null;
  switchScale: (scale: Scale) => void;
  selectPeriod: (date: Date | string, scale: Scale) => void;
  dropDraft: () => void;
  isPeriodAvailable: (date: Date | string, scale: Scale) => boolean;

  selection: 'single' | 'range';
  selectDay: (date: Date) => void;
  commitDay: (date: Date, reason: CalendarPreviewChangeReason) => void;
  setEndpoint: (field: CalendarPreviewField, date: Date) => void;
  clearEndpoint: (field: CalendarPreviewField) => void;
  draft: CalendarPreviewDraftRange | null;
  activeField: CalendarPreviewField;
  setActiveField: (field: CalendarPreviewField) => void;
  fieldReadOnly: Record<CalendarPreviewField, boolean>;
  setFieldReadOnly: (field: CalendarPreviewField, readOnly: boolean) => void;
}

export const CalendarPreviewContext =
  createContext<CalendarPreviewContextValue | null>(null);

/* `part` is the caller's display name, so the throw points at the author's element. */
export function useCalendarPreviewContext(
  part: string
): CalendarPreviewContextValue {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview>`);
  }
  return context;
}

/* On `.Days`, so two day views in one tree cannot disable each other's navigation. */
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
