import { CalendarPreviewContent } from './calendar-preview-content';
import { CalendarPreviewGrid } from './calendar-preview-grid';
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewNav } from './calendar-preview-nav';
import { CalendarPreviewRangeInput } from './calendar-preview-range-input';
import { CalendarPreviewRoot } from './calendar-preview-root';
import { CalendarPreviewTrigger } from './calendar-preview-trigger';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Trigger: CalendarPreviewTrigger,
  Content: CalendarPreviewContent,
  Input: CalendarPreviewInput,
  RangeInput: CalendarPreviewRangeInput,
  Nav: CalendarPreviewNav,
  Grid: CalendarPreviewGrid
});
