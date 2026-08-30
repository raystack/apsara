import { CalendarPreviewContent } from './calendar-preview-content';
import {
  CalendarPreviewApply,
  CalendarPreviewCancel,
  CalendarPreviewFooter
} from './calendar-preview-footer';
import { CalendarPreviewGranularityTabs } from './calendar-preview-granularity-tabs';
import { CalendarPreviewGrid } from './calendar-preview-grid';
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewMonthGrid } from './calendar-preview-month-grid';
import { CalendarPreviewNav } from './calendar-preview-nav';
import { CalendarPreviewRangeInput } from './calendar-preview-range-input';
import { CalendarPreviewRoot } from './calendar-preview-root';
import { CalendarPreviewTimeField } from './calendar-preview-time-field';
import { CalendarPreviewTrigger } from './calendar-preview-trigger';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Trigger: CalendarPreviewTrigger,
  Content: CalendarPreviewContent,
  Input: CalendarPreviewInput,
  RangeInput: CalendarPreviewRangeInput,
  GranularityTabs: CalendarPreviewGranularityTabs,
  Nav: CalendarPreviewNav,
  Grid: CalendarPreviewGrid,
  MonthGrid: CalendarPreviewMonthGrid,
  TimeField: CalendarPreviewTimeField,
  Footer: CalendarPreviewFooter,
  Apply: CalendarPreviewApply,
  Cancel: CalendarPreviewCancel
});
