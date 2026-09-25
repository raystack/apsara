'use client';

import { CalendarPreviewBody } from './calendar-preview-body';
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
import { CalendarPreviewLabel } from './calendar-preview-label';
import { CalendarPreviewPanel } from './calendar-preview-panel';
import {
  CalendarPreviewHalfYears,
  CalendarPreviewMonths,
  CalendarPreviewQuarters,
  CalendarPreviewYears
} from './calendar-preview-periods';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { CalendarPreviewRoot } from './calendar-preview-root';
import {
  CalendarPreviewScale,
  CalendarPreviewScales
} from './calendar-preview-scales';
import { CalendarPreviewSeparator } from './calendar-preview-separator';
import { CalendarPreviewTrigger } from './calendar-preview-trigger';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Trigger: CalendarPreviewTrigger,
  Content: CalendarPreviewContent,
  Input: CalendarPreviewInput,
  Body: CalendarPreviewBody,
  Label: CalendarPreviewLabel,
  Scales: CalendarPreviewScales,
  Scale: CalendarPreviewScale,
  Separator: CalendarPreviewSeparator,
  Panel: CalendarPreviewPanel,
  Months: CalendarPreviewMonths,
  Quarters: CalendarPreviewQuarters,
  HalfYears: CalendarPreviewHalfYears,
  Years: CalendarPreviewYears,
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
