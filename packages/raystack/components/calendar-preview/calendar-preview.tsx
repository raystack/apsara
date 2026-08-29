import { CalendarPreviewContent } from './calendar-preview-content';
import { CalendarPreviewGrid } from './calendar-preview-grid';
import { CalendarPreviewRoot } from './calendar-preview-root';
import { CalendarPreviewTrigger } from './calendar-preview-trigger';

export const CalendarPreview = Object.assign(CalendarPreviewRoot, {
  Trigger: CalendarPreviewTrigger,
  Content: CalendarPreviewContent,
  Grid: CalendarPreviewGrid
});
