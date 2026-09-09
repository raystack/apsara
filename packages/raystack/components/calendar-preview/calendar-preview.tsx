'use client';

import { CalendarPreviewCaption } from './calendar-preview-caption';
import { CalendarPreviewContent } from './calendar-preview-content';
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
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { CalendarPreviewRoot } from './calendar-preview-root';
import { CalendarPreviewTrigger } from './calendar-preview-trigger';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Trigger: CalendarPreviewTrigger,
  Content: CalendarPreviewContent,
  Input: CalendarPreviewInput,
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
