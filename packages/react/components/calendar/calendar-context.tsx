'use client';

import type { Popover } from '@base-ui/react';
import { createContext, type RefObject, useContext } from 'react';
import type { DayKey } from './date-adapter';
import type { Scale, ScaleValue } from './lib/scale';

export type CalendarChangeReason =
  | 'select'
  | 'input'
  | 'clear'
  | 'reset'
  | 'scale';

export type CalendarOpenChangeDetails = Popover.Root.ChangeEventDetails;

export type CalendarField = 'start' | 'end';

export interface CalendarDateRange {
  from: Date;
  to: Date;
}

export interface CalendarDraftRange {
  from?: Date;
  to?: Date;
}

export interface CalendarChangeDetails {
  reason: CalendarChangeReason;
  period: { start: DayKey; end: DayKey };
  toDate: () => Date;
}

export type CalendarValue = Date | CalendarDateRange | ScaleValue | null;

export interface CalendarContextValue {
  value: CalendarValue;
  setValue: (
    value: CalendarValue,
    reason: CalendarChangeReason,
    occasion: Date
  ) => void;
  open: boolean;
  setOpen: (open: boolean, details: CalendarOpenChangeDetails) => void;
  shouldIgnoreFocusOpen: () => boolean;
  shouldRestoreFinalFocus: () => boolean;
  triggerRef: RefObject<HTMLElement | null>;
  triggerHasInput: boolean;
  setTriggerHasInput: (hasInput: boolean) => void;
  defaultDate: Date | CalendarDateRange | ScaleValue | null | undefined;
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
  commitDay: (date: Date, reason: CalendarChangeReason) => void;
  setEndpoint: (field: CalendarField, date: Date) => void;
  clearEndpoint: (field: CalendarField) => void;
  draft: CalendarDraftRange | null;
  activeField: CalendarField;
  setActiveField: (field: CalendarField) => void;
  fieldReadOnly: Record<CalendarField, boolean>;
  setFieldReadOnly: (field: CalendarField, readOnly: boolean) => void;
}

export const CalendarContext = createContext<CalendarContextValue | null>(null);

/* `part` is the caller's display name, so the throw points at the author's element. */
export function useCalendarContext(part: string): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(`${part} must be used within <Calendar>`);
  }
  return context;
}

/* On `.Days`, so two day views in one tree cannot disable each other's navigation. */
export interface CalendarDaysContextValue {
  numberOfMonths: number;
  busy: boolean;
  setBusy: (busy: boolean) => void;
}

export const CalendarDaysContext =
  createContext<CalendarDaysContextValue | null>(null);

export function useCalendarDaysContext(): CalendarDaysContextValue | null {
  return useContext(CalendarDaysContext);
}
