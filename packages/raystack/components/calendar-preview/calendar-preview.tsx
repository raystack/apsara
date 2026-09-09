'use client';

import { CalendarPreviewCaption } from './calendar-preview-caption';
import { CalendarPreviewDays } from './calendar-preview-days';
import { CalendarPreviewFooter } from './calendar-preview-footer';
import {
  CalendarPreviewDay,
  CalendarPreviewGrid,
  CalendarPreviewWeekday
} from './calendar-preview-grid';
import {
  CalendarPreviewHeader,
  CalendarPreviewNextMonth,
  CalendarPreviewPrevMonth
} from './calendar-preview-header';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { CalendarPreviewRoot } from './calendar-preview-root';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Days: CalendarPreviewDays,
  Header: CalendarPreviewHeader,
  PrevMonth: CalendarPreviewPrevMonth,
  NextMonth: CalendarPreviewNextMonth,
  Caption: CalendarPreviewCaption,
  Reset: CalendarPreviewReset,
  Grid: CalendarPreviewGrid,
  Day: CalendarPreviewDay,
  Weekday: CalendarPreviewWeekday,
  Footer: CalendarPreviewFooter
});
