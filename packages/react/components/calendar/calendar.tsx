'use client';

import { CalendarBody } from './calendar-body';
import { CalendarCaption } from './calendar-caption';
import { CalendarContent } from './calendar-content';
import { CalendarDays } from './calendar-days';
import { CalendarFooter } from './calendar-footer';
import { CalendarDay, CalendarGrid, CalendarWeekday } from './calendar-grid';
import {
  CalendarHeader,
  CalendarNextMonth,
  CalendarPrevMonth
} from './calendar-header';
import { CalendarInput } from './calendar-input';
import { CalendarLabel } from './calendar-label';
import { CalendarPanel } from './calendar-panel';
import {
  CalendarHalfYears,
  CalendarMonths,
  CalendarQuarters,
  CalendarYears
} from './calendar-periods';
import { CalendarReset } from './calendar-reset';
import { CalendarRoot } from './calendar-root';
import { CalendarScale, CalendarScales } from './calendar-scales';
import { CalendarSeparator } from './calendar-separator';
import { CalendarTrigger } from './calendar-trigger';

export const Calendar = Object.assign(CalendarRoot, {
  Trigger: CalendarTrigger,
  Content: CalendarContent,
  Input: CalendarInput,
  Body: CalendarBody,
  Label: CalendarLabel,
  Scales: CalendarScales,
  Scale: CalendarScale,
  Separator: CalendarSeparator,
  Panel: CalendarPanel,
  Months: CalendarMonths,
  Quarters: CalendarQuarters,
  HalfYears: CalendarHalfYears,
  Years: CalendarYears,
  Days: CalendarDays,
  Header: CalendarHeader,
  PrevMonth: CalendarPrevMonth,
  NextMonth: CalendarNextMonth,
  Caption: CalendarCaption,
  Reset: CalendarReset,
  Grid: CalendarGrid,
  Day: CalendarDay,
  Weekday: CalendarWeekday,
  Footer: CalendarFooter
});
